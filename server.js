require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// MySQL Pool Connection
// ======================

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    connectTimeout: 30000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test Connection

db.getConnection((err, connection) => {

    if (err) {
        console.log("❌ MySQL Error:", err);
    } else {
        console.log("✅ MySQL Connected");
        connection.release();
    }

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
            message: "Phone and Password are required"
        });
    }

    const sql =
        "INSERT INTO users(phone,password) VALUES(?,?)";

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

// ======================

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});