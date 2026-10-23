
const { connectDB } = require("./config/db");

async function testConnection() {
    try {
        const db = await connectDB();

        console.log("Database name:", db.databaseName);
        console.log("Database connection test passed!");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exitCode = 1;
    }
}

testConnection();
