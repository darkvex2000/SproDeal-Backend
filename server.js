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

console.log({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,

});

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            ssl: {
                rejectUnauthorized: false
            }
        });

        console.log("✅ Connected Successfully");
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}

testConnection();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,

    connectTimeout: 5000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

console.log(db.config.connectionConfig.host);

// Test Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error(err);
        console.log("Code:", err.code);
        console.log("Message:", err.message);
        return;
    }

    console.log("✅ MySQL Connected");
    connection.release();
});
// ======================
// Routes
// ======================

app.post("/", (req, res) => {
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

const PORT = process.env.PORT || 56689;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
