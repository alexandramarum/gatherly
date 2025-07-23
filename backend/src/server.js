import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js'
import authRoutes from './routes/auth.js'

const app = express()
app.use(express.json())

app.use('/users', userRoutes);
app.use('/events', eventRoutes)
app.use('/auth', authRoutes)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
