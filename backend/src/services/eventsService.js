import { db } from '../config/firebase.js';
import cloudinary from '../config/cloudinary.js';

export async function getEvents() {
    try {
        const snapshot = await db.collection('events').get()

        if (snapshot.empty) {
            console.log('No events found')
            return []
        }

        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Successfully fetched events!")
        return events
    } catch(error) {
        console.error("Failed to fetch events:", error)
        throw error
    }
}

export async function getEventById(id) {
    try {
        const doc = await db.collection('events').doc(id).get()

        if (!doc.exists) {
            console.log("Event not found")
            throw new Error("Event not found")
        }

        const event = {
            id: doc.id,
            ...doc.data()
        }

        return event
    } catch (error) {
        throw error
    }
}

export async function createEvent(data) {
    const { creatorPid, timestamp, description, location, title, image } = data

    try {
        const doc = await db.collection('events').add({ creatorPid, timestamp, description, location, title })
        const eventId = doc.id

        let image_url

        if (image) {
            const result = await cloudinary.uploader.upload_large(image, {
            public_id: eventId,
            overwrite: true,
            quality: "auto"
            })

            image_url = result.secure_url

            if (image_url) {
                await doc.update({ image_url })
            }
        }

        const event = { id: eventId, creatorPid, timestamp, description, location, title }
        if (image_url) event.image_url = image_url

        console.log('Created event with image (if provided):', eventId)
        return event

    } catch(error) {
        console.error("Failed to create event:", error)
        throw error
    }
} 

export async function updateEvent(id, data, creatorPid) {
  const { timestamp, description, location, title, image_url } = data

  const updatedFields = {}
  if (timestamp && typeof timestamp === "string") updatedFields.timestamp = timestamp
  if (description && typeof description === "string") updatedFields.description = description
  if (location && typeof location === "string") updatedFields.location = location
  if (title && typeof title === "string") updatedFields.title = title
  if (image_url && typeof image_url === "string") updatedFields.image_url = image_url

  if (Object.keys(updatedFields).length === 0) {
    console.log("No fields provided to update")
    throw new Error("No fields provided to update")
  }

  try {
    const docRef = db.collection("events").doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      console.log("No event found")
      throw new Error("No event found")
    }

    const event = docSnap.data()
    if (event.creatorPid !== creatorPid) {
      console.log("Unauthorized: creatorPid does not match!")
      throw new Error("Unauthorized: creatorPid does not match!")
    }

    await docRef.update(updatedFields)

    const updatedDocSnap = await docRef.get()

    console.log(`Updated event ${id}`)
    return { id: updatedDocSnap.id, ...updatedDocSnap.data() }
  } catch (error) {
    console.log("Failed to update event:", error)
    throw error
  }
}

export async function deleteEvent(id, creatorPid) {
    try {
        const eventRef = db.collection("events").doc(id)
        const snap = await eventRef.get()

        if (!snap.exists) {
            console.log("Event not found")
            throw new Error("Event not found")
        }

        const event = snap.data();
        if (event.creatorPid !== creatorPid) {
            console.log("Unauthorized: creatorPid does not match")
            throw new Error("Unauthorized: creatorPid does not match")
        }

        await eventRef.delete();
        console.log(`Deleted event ${id}`)
        return true
    } catch (error) {
        throw error
    }
}
