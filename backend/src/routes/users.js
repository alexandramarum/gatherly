import express from 'express';
import { db } from '../config/firebase.js';
import { Router } from 'express';

const router = express.Router();

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

// Get all Users
router.get("/", async (req, res) => {

})

// Get User by ID
router.get("/:id", async (req, res) => {

})

// Update a User
router.put("/:id", async (req, res) => {

})

// Delete a User
router.delete("/:id", async (req, res) => {

})

export default router