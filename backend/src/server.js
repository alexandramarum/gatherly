import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Gatherly API",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger"
    },
    servers: [
      {
        url: "http://localhost:3000",
        url: "https://gatherly-backend-q9vm.onrender.com",
      },
    ],
  },
  apis: ["./src/docs/*.js"],
};

const specs = swaggerJSDoc(options);

const app = express()

app.use(express.json())

app.use('/users', userRoutes);
app.use('/events', eventRoutes)
app.use(
    '/docs',
    serve,
    setup(specs)
)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
