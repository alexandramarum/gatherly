import swaggerJSDoc from "swagger-jsdoc";

/**
 * @swagger
 * components:
 *   schemas:
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
 *         image_url:
 *          type: string
 *          nullable: true
 *          description: Optional URL of the uploaded image associated with this event
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
