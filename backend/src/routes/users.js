import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();

    if (snapshot.empty) {
      return res.status(200).json({ users: [] });
    }

    const users = snapshot.docs.map(doc => ({
      ...doc.data()
    }));

    console.log('Fetched all users');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by PID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const snapshot = await db.collection('users').where('pid', '==', pid).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = snapshot.docs[0].data();

    console.log('Fetched user', pid);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a user
router.post("/", async (req, res) => {
  const { pid, username } = req.body;

  if (!pid || !username) {
    return res.status(400).json({ error: "pid and username are required" });
  }

  const data = {
    pid,
    rsvpEvents: [],
    username
  };

  try {
    const snapshot = await db.collection('users').where('pid', '==', pid).get();
    if (snapshot.empty) {
      await db.collection('users').add(data);
      console.log('Created new user:', username);
      res.status(201).json({ message: 'User created', pid });
    } else {
      res.status(400).json({ message: 'PID already in use', pid})
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { email, rsvpEvents, username } = req.body;

  const updatedFields = {};
  if (email) updatedFields.email = email;
  if (Array.isArray(rsvpEvents)) updatedFields.rsvpEvents = rsvpEvents
  if (username) updatedFields.username = username;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ error: "No fields provided" });
  }

  try {
    const snapshot = await db.collection('users').where('pid', '==', pid).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = snapshot.docs[0].ref;
    await userDoc.update(updatedFields);

    console.log(`Updated user ${pid}`);
    res.status(200).json({ message: "User updated", updatedFields });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const snapshot = await db.collection('users').where('pid', '==', pid).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = snapshot.docs[0].ref;
    await userDoc.delete();

    console.log(`Deleted user ${pid}`);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
