import * as EventService from '../services/eventsService.js'

export async function getEvents(req, res) {
  try {
    const events = await EventService.getEvents()

    res.status(200).json({ events })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function getEventById(req, res) {
  const { id } = req.params

  try {
    const event = await EventService.getEventById(id)

    res.status(200).json({ event })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export async function createEvent(req, res) {
  const { creatorPid, timestamp, description, location, title, image } = req.body

  if (!creatorPid || !timestamp || !description || !title || !location) {
    return res.status(400).json({ error: "Event details are required" })
  }

  try {
    const event = await EventService.createEvent({ creatorPid, timestamp, description, location, title, image })

    res.status(201).json(event)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export async function updateEventById(req, res) {
  const { id } = req.params
  const { creatorPid, timestamp, description, location, title, image_url } = req.body

  try {
    const event = await EventService.updateEvent(id, {timestamp, description, location, title, image_url}, creatorPid)

    res.status(200).json(event)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteEventById(req, res) {
  const { id } = req.params;
  const { creatorPid } = req.body;

  try {
    const didDelete = await EventService.deleteEvent(id, creatorPid)

    if(didDelete) {
        console.log(`Deleted event ${id}`)
        res.status(200).json({ message: "Event deleted" })
    } else {
        console.log(`Failed to delete event ${id}`)
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
