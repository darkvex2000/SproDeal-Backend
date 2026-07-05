require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

app.use(express.json());

// ==============================
// MySQL Connection (Railway)
// ==============================

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.log("❌ MySQL Error:", err);
    } else {
        console.log("✅ MySQL Connected");
        connection.release();
    }
});

// ==============================
// Home Route
// ==============================

app.get("/", (req, res) => {
    res.send("Backend is Running 🚀");
});

// ==============================
// Login API
// ==============================

app.post("/submit", (req, res) => {

    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({
            message: "Phone and Password are required"
        });
    }

    const sql = `
        INSERT INTO users (phone, password)
        VALUES (?, ?)
    `;

    db.query(sql, [phone, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Data Saved Successfully"
        });

    });

});

// ==============================
// Details API
// ==============================

app.post("/details", (req, res) => {

    const {
        fullName,
        problemType,
        experienceLevel,
        pin
    } = req.body;

    const sql = `
        INSERT INTO details
        (full_name, problem_type, experience_level, pin)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [fullName, problemType, experienceLevel, pin],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            res.json({
                success: true,
                message: "Details Saved Successfully"
            });

        }
    );

});

// ==============================
// Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});