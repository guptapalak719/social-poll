
require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is missing. Check your .env file.");
}

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000
});

async function connectDB() {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB connected successfully!");

    return client.db("internshipDB");
}

module.exports = { connectDB };
