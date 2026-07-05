require("dotenv").config();
console.log(process.env.MONGO_URI);
console.log(process.env.MYSQL_HOST);
console.log(process.env.MYSQL_USER);
console.log(process.env.MYSQL_DATABASE);
console.log(process.env.MYSQL_PASSWORD);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mysql = require("mysql2");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));
app.use(express.json());

app.post("/submit", (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({
            message: "Phone and Password are required"
        });
    }

    const sql = "INSERT INTO users (phone, password) VALUES (?, ?)";

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

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     family: 4
// })
//     .then(() => console.log("✅ MongoDB Connected"))
//     .catch(err => console.error(err));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }
});

app.get("/", (req, res) => {
    res.send("Backend is Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post("/submit", (req, res) => {
    const { phone, password } = req.body;

    const sql = "INSERT INTO users (phone, password) VALUES (?, ?)";

    db.query(sql, [phone, password], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Error" });
        }

        res.json({ message: "Data Saved Successfully" });
    });
});