import swaggerJSDoc from "swagger-jsdoc";

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 *   - name: Events
 *     description: Event management
 *   - name: Images
 *     description: Image upload, fetch, and deletion
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - pid
 *         - username
 *       properties:
 *         pid:
 *           type: string
 *           description: The unique user-facing personal identification of the user
 *         username:
 *           type: string
 *           description: The display name of the user
 *         rsvpEvents:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of event IDs the user has RSVP'd to
 *
 *     Event:
 *       type: object
 *       required:
 *         - creatorPid
 *         - timestamp
 *         - description
 *         - location
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated Firestore document ID of the event
 *         creatorPid:
 *           type: string
 *           description: The PID of the user who created the event
 *         timestamp:
 *           type: string
 *           description: The event timestamp
 *         description:
 *           type: string
 *           description: The detailed description of the event
 *         location:
 *           type: string
 *           description: The location of the event
 *         title:
 *           type: string
 *           description: The title of the event
 * 
 *     Image:
 *       type: object
 *       required:
 *         - public_id
 *         - url
 *       properties:
 *         public_id:
 *           type: string
 *           description: The Cloudinary public ID and associated event ID of the uploaded image
 *         url:
 *           type: string
 *           description: The accessible URL of the uploaded image
 */
