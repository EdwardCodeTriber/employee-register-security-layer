const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// Firebase Admin SDK initialization
const serviceAccount = require("./employee-node-6d9ec-firebase-adminsdk-44lp0-b147227770.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "employee-node-6d9ec.appspot.com",
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors());

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

    // Validate required fields
    if (!name || !surname || !position || !email || !idNumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    /// Auto ID

    // const employeeId = uuidv4();

    const newEmployee = {
      // id: employeeId, // Store this unique ID in the document
      name,
      surname,
      position,
      email,
      idNumber,
      picture: picture || null, // Make picture optional
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("employees").add(newEmployee);

    // Fetch the newly created document to get the server-generated timestamp
    const newDoc = await docRef.get();
    const savedEmployee = { id: docRef.id, ...newDoc.data() };

    // Convert Firestore Timestamp to ISO string for JSON response
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
    await db.collection("employees").doc(id).delete();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res
      .status(500)
      .json({ error: "Failed to delete employee", details: error.message });
  }
});

// Route to verify the Firebase Admin setup
app.get("/test-firebase", (req, res) => {
  res.send("Firebase Admin SDK is set up correctly!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
