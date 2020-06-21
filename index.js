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


// SELECT AND RENDER
const selectAndRender = async (queryString) => {
    connection.query(queryString, (err, result) => {
        if (err) throw err;
        console.table(result);
        main();
    });
};

// SELECT MANAGERS
const selectManagers = async (cb) => {
    let queryString = "SELECT CONCAT(first_name, ' ', last_name) AS manager_name FROM employee WHERE id IN (SELECT DISTINCT manager_id FROM employee);";

    connection.query(queryString, (err, result) => {
        if (err) throw err;
        let managerList = [];
        for (elem of result) {
            managerList.push(elem.manager_name);
        }
        cb(managerList);
    });
}

// SELECT DEPARTMENT 
const selectDepartment = async (cb) => {
    connection.query("SELECT name from department", (err, result) =>{
        if (err) throw err;
        let departmentList =[];
        for (elem of result){
            departmentList.push(elem.name);
        }
        cb(departmentList);
    });
}

// INSERT
const insert = async queryString => {
    connection.query(queryString, (err, result)=> {
        if (err) throw err;
        main();
    });
}

const menuPrompt = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: [
            'View All Employees',
            'View All Departments',
            'View All Roles',
            'View Employees By Manager',
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

const addDep = [
    {
        type:'input',
        message: 'Please enter the name of the new department: ',
        name: 'department_name'
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
            selectManagers(function (managerList) {
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

        case 'View Total Salary By Department':
            selectAndRender('SELECT d.name AS department, SUM(salary) AS total_salary FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id GROUP BY department_id;')
            break;

        case 'Add Departments':
            inquirer.prompt(addDep).then( res => {
                insert(`INSERT INTO department (name) VALUES ('${res.department_name}');`);
            });
            break;
        case 'Add Roles':
            selectDepartment(departmentList=>{
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'Please enter the title of the new role',
                        name: 'title'
                    },{ 
                        type: 'list',
                        message: "Please select a department:",
                        choices: departmentList,
                        name: 'departmentName' 
                    }, {
                        type: 'number',
                        message: 'Please enter the salary of this role: ',
                        name: 'salary'
                    }]
                ).then (async res => {
                    // INSERT INTO role (title, salary, department_id) VALUES ('Intern', 50000, (SELECT id FROM Department WHERE name = 'Sales'));
                    insert(`INSERT INTO role (title, salary, department_id) VALUES ('${res.title}',${res.salary}, (SELECT id FROM Department WHERE name = '${res.departmentName}'));`);
                })
            })
            break;
        //case 'Add Employess':


        default:
            connection.end();
    }
}

main();

