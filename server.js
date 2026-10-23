


const express = require("express");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Hello! My Express server is running.");
});

// API test
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "My first API is working!",
        technology: "Node.js and Express.js"
    });
});

// User APIs
app.use("/api/users", userRoutes);

// Connect to MongoDB before starting Express
async function startServer() {
    try {
        const db = await connectDB();

        app.locals.db = db;

        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exitCode = 1;
    }
}

startServer();

