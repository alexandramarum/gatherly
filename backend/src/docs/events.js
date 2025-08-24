import swaggerJSDoc from "swagger-jsdoc";

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore document ID
 *     responses:
 *       200:
 *         description: Event found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - creatorPid
 *             properties:
 *               creatorPid:
 *                 type: string
 *               timestamp:
 *                 type: integer
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated
 *       400:
 *         description: No fields provided or missing creatorPid
 *       403:
 *         description: "Unauthorized: creatorPid does not match"
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Firestore document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - creatorPid
 *             properties:
 *               creatorPid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event deleted
 *       403:
 *         description: "Unauthorized: creatorPid does not match"
 *       404:
 *         description: Event not found
 */