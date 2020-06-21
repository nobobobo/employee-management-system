// import libraries
const inquirer = require('inquirer');
const mysql = require('mysql');
const figlet = require('figlet');
const boxen = require('boxen');
const cTable = require('console.table');

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


// helper function: SELECT AND RENDER
const selectAndRender = async (queryString) => {
    connection.query(queryString, (err, result) => {
        if (err) throw err;
        console.table(result);
        main();
    });
};

// helper function: SELECT WHERE

const selectManagers = async (cb) => {
    let queryString = "SELECT CONCAT(first_name, ' ', last_name) AS manager_name FROM employee WHERE id IN (SELECT DISTINCT manager_id FROM employee);";

    connection.query(queryString, (err, result) => {
        if (err) throw err;
        let managerList = [];
        for (elem of result) {
            managerList.push(elem.manager_name);
        }
        cb(managerList);
    })
}

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
            selectAndRender("SELECT t1.id, t1.first_name, t1.last_name, title, name AS department, salary, CONCAT(t4.first_name, ' ', t4.last_name) AS manager FROM employee t1 LEFT JOIN role t2 ON t1.role_id = t2.id LEFT JOIN department t3 ON t2.department_id = t3.id LEFT JOIN employee t4 ON t1.manager_id = t4.id;");
            break;
        case 'View All Departments':
            selectAndRender('SELECT * FROM department');
            break;
        case 'View All Roles':
            selectAndRender('SELECT * FROM role');
            break;
        case 'View Employees By Manager':
            selectManagers(function(managerList){
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Which employee do you want to see direct reports for?",
                        choices: managerList,
                        name: "managerName"
                    }
                ]).then(res => {
                    let [firstName, lastName] = res.managerName.split(' ');
                    selectAndRender(`SELECT id, first_name, last_name FROM employee WHERE manager_id IN (select id from employee WHERE first_name = '${firstName}' AND last_name = '${lastName}');`);
                })
            });
            break;
        default:
            connection.end();
    }
}

main();

