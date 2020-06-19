// import libraries
const inquirer = require('inquirer');
const mysql = require('mysql');

require('dotenv').config()

// init mysql connections
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS,
    database: 'company'
});


// connect to mysql server
connection.connect(err=>{
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
})