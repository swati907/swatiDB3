import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";

// ES Module __dirname Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Important for Render

// =========================
// Middleware
// =========================
app.use(express.json());
app.use(cors()); // ✅ Allow all origins (works for Render + Local)
app.use(express.static(path.join(__dirname, "public")));

// =========================
// MongoDB Connection
// =========================
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// =========================
// SCHEDULE SCHEMA
// =========================
const scheduleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        date: {
            type: String,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

// =========================
// ROUTES
// =========================

// GET ALL SCHEDULES
app.get("/api/schedules", async (req, res) => {
    try {
        const schedules = await Schedule.find().sort({ date: 1, startTime: 1 });
        res.json(schedules);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// CREATE SCHEDULE
app.post("/api/schedules", async (req, res) => {
    try {
        const { title, description, date, startTime, endTime } = req.body;

        if (!title || !date || !startTime || !endTime) {
            return res
                .status(400)
                .json({ message: "All required fields must be filled" });
        }

        const newSchedule = await Schedule.create({
            title: title.trim(),
            description,
            date,
            startTime,
            endTime,
        });

        res.status(201).json(newSchedule);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE SCHEDULE
app.put("/api/schedules/:id", async (req, res) => {
    try {
        const updated = await Schedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.json(updated);
    } catch {
        res.status(400).json({ message: "Invalid ID" });
    }
});

// DELETE SCHEDULE
app.delete("/api/schedules/:id", async (req, res) => {
    try {
        const deleted = await Schedule.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch {
        res.status(400).json({ message: "Invalid ID" });
    }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});