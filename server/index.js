import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './Routes/AuthRoute.js';
import HomeRouter from './Routes/HomeRoute.js';
import dotenv from 'dotenv';
import './Config/DB.js';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/home', HomeRouter);

app.post('/api/chat', async (req, res) => {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
        return res.status(400).json({ error: 'Invalid or missing history data' });
    }

    try {
        const formattedHistory = history.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
            { contents: formattedHistory },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        res.json({ text: generatedText });
    } catch (error) {
        res.status(500).json({ error: error.response?.data?.error?.message || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
