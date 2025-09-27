import express from 'express';
import * as eventsController from '../controllers/eventsController.js';

const router = express.Router();

router.get("/", eventsController.getEvents)
router.get("/:id", eventsController.getEventById)
router.post("/", eventsController.createEvent)
router.put("/:id", eventsController.updateEventById)
router.delete("/:id", eventsController.deleteEventById)

export default router;
