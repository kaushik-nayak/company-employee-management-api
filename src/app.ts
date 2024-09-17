import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import router from './routes';

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

// Use routes
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
