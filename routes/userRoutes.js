

const express = require("express");

const router = express.Router();

// GET API - Retrieve all users from MongoDB
router.get("/", async (req, res) => {
    try {
        const db = req.app.locals.db;

        const users = await db.collection("users")
            .find({})
            .toArray();

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });
    }
});

// POST API - Save a user to MongoDB
router.post("/", async (req, res) => {
    const { name, email } = req.body;

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        !name.trim() ||
        !email.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid name and email are required."
        });
    }

    try {
        const db = req.app.locals.db;

        const result = await db.collection("users").insertOne({
            name: name.trim(),
            email: email.trim(),
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "User saved to MongoDB successfully!",
            user: {
                id: result.insertedId,
                name: name.trim(),
                email: email.trim()
            }
        });
    } catch (error) {
        console.error("Error saving user:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to save user."
        });
    }
});

module.exports = router;
