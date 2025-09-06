import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

// Get all Events
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

// Get Event by ID
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

// Create an Event
router.post("/", async (req, res) => {
  const { 
    creatorPid, 
    timestamp, 
    description, 
    location, 
    title,
    image_url
  } = req.body;

  if (!creatorPid || !timestamp || !description || !title || !location) {
    return res.status(400).json({ error: "Event details are required" });
  }

  if (
    typeof(creatorPid) != "string" ||
    typeof(timestamp) != "string" ||
    typeof(description) != "string" ||
    typeof(title) != "string" ||
    typeof(location) != "string" ||
    (image_url && typeof image_url !== "string")
  ) {
    return res.status(400).json({ error: "Event details must be strings!" })
  }

  const data = {
    creatorPid, 
    timestamp, 
    description,
    location, 
    title
  }
  if (image_url) data.image_url = image_url;

  try {
    const docRef = await db.collection('events').add(data);
    console.log('Created a new event:', title);
    res.status(201).json({ message: 'Event created', id: docRef.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an Event
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { creatorPid, timestamp, description, location, title, image_url } = req.body;

  const updatedFields = {};
  if (timestamp && typeof(timestamp) == "string") updatedFields.timestamp = timestamp;
  if (description && typeof(description) == "string") updatedFields.description = description;
  if (location && typeof(location) == "string") updatedFields.location = location;
  if (title && typeof(title) == "string") updatedFields.title = title;
  if (image_url && typeof image_url === "string") updatedFields.image_url = image_url;

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
    if (event.creatorPid !== creatorPid) {
      return res.status(403).json({ error: "Unauthorized: creatorPid does not match" });
    }

    await eventRef.update(updatedFields);
    console.log(`Updated event ${id}`);
    res.status(200).json({ message: "Event updated", updatedFields });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an Event by ID (authenticated)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { creatorPid } = req.body

  try {
    const eventRef = db.collection("events").doc(id);
    const snap = await eventRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = snap.data();
    if (event.creatorPid !== creatorPid) {
      return res.status(403).json({ error: "Unauthorized: creatorPid does not match" });
    }

    await eventRef.delete();
    console.log(`Deleted event ${id}`);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
