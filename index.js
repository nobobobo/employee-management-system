// import libraries
const inquirer = require('inquirer');
const mysql = require('mysql');
const figlet = require('figlet');
const boxen = require('boxen');

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
connection.connect(err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    // console.log("connected as id " + connection.threadId);
})

// Render main figlet to console
console.log(boxen(
    figlet.textSync('Employee \n Management \n System', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'fitted'
    }), { padding: 1 })
);


// helper function: SELECT ALL
const selectAll = async table => {
    let queryString = 'SELECT * FROM ' + table + ';';

    connection.query(queryString, (err, result) => {
        if (err) throw err;
        console.table(result);
        main();
    });
};


const menuPrompt = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: [
            'View All Employees',
            'View Employees By Manager',
            'View All Departments',
            'View All Roles',
            'View Total Salary By Department',
            'Add Departments',
            'Add Roles',
            'Add Employess',
            'Update Employee Roles',
            'Update Employee Managers',
            'Delete Departments',
            'Delete Roles',
            'Delete Employees',
            'Quit'
        ],
        name: "action"
    }
];

const main = async () => {

    let { action } = await inquirer.prompt(menuPrompt);

    switch (action) {
        case 'View All Employees':
            await selectAll('employee');
            break;
        case 'View All Departments':
            await selectAll('department');
            break;
        case 'View All Roles':
            await selectAll('role');
            break;
        default:
            connection.end();
            isDone = true;

    }
}

main();

