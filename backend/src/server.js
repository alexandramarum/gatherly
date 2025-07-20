import express from 'express';
import 'dotenv/config';
import admin from 'firebase-admin';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello from API');
});

app.use('/users', userRoutes);
app.use('/events', eventRoutes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
