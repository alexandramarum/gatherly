import express from 'express';
import { db } from '../config/firebase.js';
import authenticateToken from '../middleware/authToken.js';

const router = express.Router();

// Get all Events (public)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return res.status(200).json({ events: [] });
    }

    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Fetched all events');
    res.status(200).json({ events });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Event by ID (public)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection('events').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    console.log('Fetched event', id);
    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create an Event (authenticated)
router.post("/", authenticateToken, async (req, res) => {
  const { timestamp, description, location, title } = req.body;

  if (!timestamp || !title || !location || !description) {
    return res.status(400).json({ error: "Event details are required" });
  }

  const data = {
    timestamp,
    description,
    location,
    title,
    createdBy: req.user.uid,
  };

  try {
    const docRef = await db.collection('events').add(data);
    console.log('Created a new event:', title);
    res.status(201).json({ message: 'Event created', id: docRef.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an Event (authenticated)
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { timestamp, description, location, title } = req.body;

  const updatedFields = {};
  if (timestamp) updatedFields.timestamp = timestamp;
  if (description) updatedFields.description = description;
  if (location) updatedFields.location = location;
  if (title) updatedFields.title = title;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ error: "No fields provided" });
  }

  try {
    const eventRef = db.collection("events").doc(id);
    const snap = await eventRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = snap.data();
    if (event.createdBy !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized to update this event" });
    }

    await eventRef.update(updatedFields);
    console.log(`Updated event ${id}`);
    res.status(200).json({ message: "Event updated", updatedFields });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an Event by ID (authenticated)
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const eventRef = db.collection("events").doc(id);
    const snap = await eventRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = snap.data();
    const isOwner = event.createdBy === req.user.uid;
    const isAdmin = req.user.admin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Unauthorized to delete this event" });
    }

    await eventRef.delete();
    console.log(`Deleted event ${id}`);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
