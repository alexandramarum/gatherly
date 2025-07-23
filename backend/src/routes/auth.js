import express from 'express';
import { authClient, db } from '../config/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredentials = await signInWithEmailAndPassword(authClient, email, password);
    const idToken = await userCredentials.user.getIdToken();

    return res.status(200).json({
      token: idToken,
      uid: userCredentials.user.uid,
    });
  } catch (error) {
    console.error("Log in error:", error);
    return res.status(401).json({ error: "Invalid email or password" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const userCredentials = await createUserWithEmailAndPassword(authClient, email, password);
    const idToken = await userCredentials.user.getIdToken();

    // Save user profile data with Admin SDK Firestore (you still import Admin db)
    await db.collection("users").doc(userCredentials.user.uid).set({
      email,
      username,
      savedEventIds: []
    });

    return res.status(201).json({
      token: idToken,
      uid: userCredentials.user.uid,
    });
  } catch (error) {
    console.error("Sign up error:", error);
    return res.status(500).json({ error: "Error creating account" });
  }
});

export default router;
