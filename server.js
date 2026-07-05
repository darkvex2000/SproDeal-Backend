require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

console.log({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE
});

// ======================
// MySQL Pool
// ======================

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,

    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,

    ssl: {
        rejectUnauthorized: false
    }
});

// Test Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL Error");
        console.error("Code:", err.code);
        console.error("Message:", err.message);
        return;
    }

    console.log("✅ MySQL Connected Successfully");
    connection.release();
});

// ======================
// Routes
// ======================

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

app.post("/submit", (req, res) => {

    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({
            success: false,
            message: "Phone and Password are required"
        });
    }

    const sql = "INSERT INTO users(phone, password) VALUES (?, ?)";

    db.query(sql, [phone, password], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Data Saved Successfully",
            id: result.insertId
        });
    });
});

// ======================

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});