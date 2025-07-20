import express from 'express';
import { db } from '../config/firebase.js';
import { Router } from 'express';

const router = express.Router();

// Get all Events
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
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
    const { id } = req.params

    try {
        const doc = await db.collection('events').doc(id).get()

        if (doc.empty) {
            console.log('No matching document.');
            return;
        }

        console.log('Fetched event', id)
        res.status(200).json({
            id: doc.id,
            ...doc.data()
        });
    } catch (error) {
        res.status(400).json({ error: error.message})
    }
})


// Creates an Event
router.post("/", async (req, res) => {
    const { timestamp, description, location, title } = req.body

      if (!timestamp || !title || !location || !description) {
        return res.status(400).json({ error: "Event details are required" });
      }

    const data = {
        timestamp: timestamp,
        description: description,
        location: location,
        title: title
    }

    try {
        const res = await db.collection('events').doc().set(data)
        console.log('Created a new event:', title);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})

// Updates an Event
router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { timestamp, description, location, title } = req.body

    const updatedFields = {};
    if (timestamp) updatedFields.timestamp = timestamp;
    if (description) updatedFields.description = description;
    if (location) updatedFields.location = location;
    if (title) updatedFields.title = title;

    if(Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ error: "No fields provided" })
    }

    try {
        const userRef = db.collection("events").doc(id); 
        const snap    = await userRef.get();

        if (!snap.exists) {
            return res.status(404).json({ error: "Event not found" });
        }

        await userRef.update(updatedFields);

        console.log(`Updated event ${id}`);
        res.status(200).json({ message: "event updated", updatedFields });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Delete an Event by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const res = await db.collection("events").doc(id).delete()
        console.log(`Deleted event ${id}`);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router