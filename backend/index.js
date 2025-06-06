import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
  
app.use('/api/auth', authRoutes);
connectDB();
app.get('/', (req, res) => {
    res.send('Hello Vikas!');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
