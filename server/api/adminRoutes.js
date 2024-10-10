const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
const router = express.Router();
const { db, bucket } = require("../Firebase/firebaseConfig");

// Middleware to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to add a new admin
router.post("/add-admin", upload.single("photo"), async (req, res) => {
  const { email, password, name, surname, age, idNumber, role } = req.body;

  try {
    // Create user in Firebase Auth
    const user = await admin.auth().createUser({ email, password });
    const userId = user.uid;

    // Upload photo to Firebase Storage
    let photoURL = "";
    if (req.file) {
      const file = bucket.file(`adminPhotos/${userId}`);
      await file.save(req.file.buffer, { contentType: req.file.mimetype });
      photoURL = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });
    }

    // Save admin details in Firestore
    await db.collection("admins").doc(userId).set({
      name,
      surname,
      age,
      idNumber,
      role,
      photoURL,
      SuperAdmin: "No",
    });

    res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Failed to add admin" });
  }
});

// Route to get admins
router.get("/admins", async (req, res) => {
  try {
    const snapshot = await db.collection("admins").get();
    const admins = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(admins);
  } catch (error) {
    console.error("Error retrieving admins:", error);
    res.status(500).json({ error: "Failed to retrieve admins" });
  }
});


module.exports = router;
