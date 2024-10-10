const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const { db } = require('./Firebase/firebaseConfig');
const adminRoutes = require('./api/adminRoutes');

// Firebase Admin SDK initialization
// const serviceAccount = require("./employee-node-6d9ec-firebase-adminsdk-44lp0-b147227770.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "employee-node-6d9ec.appspot.com",
// });

// const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api/admins", adminRoutes);

const PORT = process.env.PORT || 5000;

// POST METHOD - Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    try {
      // Firebase token
      const customToken = await admin.auth().createCustomToken(username);
      return res.status(200).json({ token: customToken });
    } catch (error) {
      console.error("Error creating custom token:", error);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  } else {
    return res.status(401).json({ error: "Invalid username or password" });
  }
});

// GET METHOD - Fetch all employees
app.get("/api/employees", async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();
    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch employees", details: error.message });
  }
});

// POST METHOD - Add a new employee
app.post("/api/employees", async (req, res) => {
  try {
    const { name, surname, position, email, idNumber, picture } = req.body;

    if (!name || !surname || !position || !email || !idNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get and increment the lastEmployeeId counter
    const counterRef = db.collection("counters").doc("employeeCounter");
    let newEmployeeId;

    await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        // Initialize
        newEmployeeId = 1;
        transaction.set(counterRef, { lastEmployeeId: newEmployeeId });
      } else {
        // Increment lastEmployeeId by 1
        newEmployeeId = counterDoc.data().lastEmployeeId + 1;
        transaction.update(counterRef, { lastEmployeeId: newEmployeeId });
      }
    });

    // Create new employee with incremented ID
    const newEmployee = {
      idEmp: newEmployeeId,
      name,
      surname,
      position,
      email,
      idNumber,
      picture: picture || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save new employee data with custom document ID
    const docRef = db.collection("employees").doc(newEmployeeId.toString());
    await docRef.set(newEmployee);

    // Fetch the newly created document to include server timestamp in response
    const newDoc = await docRef.get();
    const savedEmployee = { id: newEmployeeId, ...newDoc.data() };

    if (savedEmployee.createdAt) {
      savedEmployee.createdAt = savedEmployee.createdAt.toDate().toISOString();
    }

    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error adding employee:", error);
    res
      .status(500)
      .json({ error: "Failed to add employee", details: error.message });
  }
});

// PUT METHOD - Update an employee
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { name, surname, position, email, idNumber, picture } = req.body;
  try {
    const employeeRef = db.collection("employees").doc(id);
    const updateData = {
      name,
      surname,
      position,
      email,
      idNumber,
      picture,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await employeeRef.update(updateData);

    // Fetch the updated document
    const updatedDoc = await employeeRef.get();
    const updatedEmployee = { id, ...updatedDoc.data() };

    // Convert Firestore Timestamp
    if (updatedEmployee.updatedAt) {
      updatedEmployee.updatedAt = updatedEmployee.updatedAt
        .toDate()
        .toISOString();
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ error: "Failed to update employee", details: error.message });
  }
});

// DELETE METHOD - Delete an employee
app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the employee data that is about to be deleted
    const employeeRef = db.collection("employees").doc(id);
    const employeeDoc = await employeeRef.get();

    if (!employeeDoc.exists) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeData = employeeDoc.data();

    // Save the employee data to the deletedEmployees collection with a timestamp
    await db
      .collection("deletedEmployees")
      .doc(id)
      .set({
        ...employeeData,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
        
      });

    // Delete the employee from the employees collection
    await employeeRef.delete();

    res
      .status(200)
      .json({
        message:
          "Employee deleted successfully and archived in deletedEmployees",
      });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res
      .status(500)
      .json({ error: "Failed to delete employee", details: error.message });
  }
});

// deleted employees
app.get("/api/deletedEmployees", async (req, res) => {
  try {
    const snapshot = await db.collection("deletedEmployees").get();
    const deletedEmployees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(deletedEmployees);
  } catch (error) {
    console.error("Error fetching deleted employees:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch deleted employees",
        details: error.message,
      });
  }
});

// Route to verify the Firebase Admin setup
app.get("/test-firebase", (req, res) => {
  res.send("Firebase Admin SDK is set up correctly!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
