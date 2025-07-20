import express from 'express';
import { db } from '../config/firebase.js';
import authenticateToken from '../middleware/authToken.js';

const router = express.Router();

// Get all Users (admin only)
router.get("/", authenticateToken, async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  try {
    const snapshot = await db.collection('users').get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No users found' });
    }

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Fetched all users');
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User by ID (self or admin)
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.uid !== id && !req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Cannot access other users" });
  }

  try {
    const doc = await db.collection('users').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Fetched user', id);
    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a user profile (uses logged-in user UID)
router.post("/", authenticateToken, async (req, res) => {
  const { email, username } = req.body;
  const userId = req.user.uid;

  if (!email || !username) {
    return res.status(400).json({ error: "Email and username are required" });
  }

  const data = {
    email,
    username,
    savedEventIds: []
  };

  try {
    await db.collection('users').doc(userId).set(data);
    console.log('Created new user:', username);
    res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user (self or admin)
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, username } = req.body;

  if (req.user.uid !== id && !req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Cannot update other users" });
  }

  const updatedFields = {};
  if (email) updatedFields.email = email;
  if (username) updatedFields.username = username;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ error: "No fields provided" });
  }

  try {
    const userRef = db.collection("users").doc(id);
    const snap = await userRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.update(updatedFields);

    console.log(`Updated user ${id}`);
    res.status(200).json({ message: "User updated", updatedFields });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user (self or admin)
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.uid !== id && !req.user.admin) {
    return res.status(403).json({ error: "Forbidden: Cannot delete other users" });
  }

  try {
    await db.collection("users").doc(id).delete();
    console.log(`Deleted user ${id}`);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
