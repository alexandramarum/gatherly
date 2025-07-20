import express from 'express';
import { db } from '../config/firebase.js';
import { Router } from 'express';

const router = express.Router();

// Get all Users
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
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

// Get User by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const doc = await db.collection('users').doc(id).get()

        if (doc.empty) {
            console.log('No matching document.');
            return;
        }

        console.log('Fetched user', id)
        res.status(200).json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})

/*
Creates a user.

Args: email, password, username
*/
router.post("/", async (req, res) => {
    const { email, password, username } = req.body

      if (!email || !password || !username) {
        return res.status(400).json({ error: "Email, password, and username are required" });
      }

    const data = {
        email: email,
        username: username,
        savedEventIds: []
    }

    try {
        const res = await db.collection('users').doc().set(data)
        console.log('Created new user:', username);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})

// Updates a User
router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { email, password, username } = req.body

    const updatedFields = {};
    if (email) updatedFields.email = email;
    if (username) updatedFields.username = username;

    if(Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ error: "No fields provided" })
    }

    try {
        const userRef = db.collection("users").doc(id); 
        const snap    = await userRef.get();

        if (!snap.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        await userRef.update(updatedFields);

        console.log(`Updated user ${id}`);
        res.status(200).json({ message: "User updated", updatedFields });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Delete a User by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const res = await db.collection("users").doc(id).delete()
        
        console.log(`Deleted user ${id}`);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router