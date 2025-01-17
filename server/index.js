import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./Routes/AuthRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server started on port ${PORT}`);
    }
});

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.log(err.message);
    });

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

app.get("/api/get-api-key", (req, res) => {
    res.json({ apiKey: process.env.VITE_API_KEY });
});

app.use("/", authRoutes);
