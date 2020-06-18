DROP DATABASE IF EXISTS company; 

CREATE DATABASE company;

CREATE TABLE company.department(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE company.role(
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary decimal,
    department_id int, 
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES company.department(id)
);

CREATE TABLE company.employee(
    id int AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id int,
    manager_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES company.role(id),
    FOREIGN KEY (manager_id) REFERENCES company.employee(id)
);
INSERT INTO company.department(name) VALUES ('Development'), ('Sales'), ('Support');

INSERT INTO company.role(title, salary, department_id) VALUES ('Software Development Engineer', 120000, 1),
('Sr. SDE', 200000, 1),
('Software Development Manager', 300000, 1),
('Solution Architect', 120000, 2),
('Sr. SA', 150000, 2),
('Operations Manager', 180000, 2),
('Support Engineer', 80000, 3),
('Sr. SE', 100000, 3),
('Operations Manager', 110000, 3);

INSERT INTO company.employee(first_name, last_name, role_id, manager_id) VALUES 
('Regina', 'Huang', 3, NULL),
('Julien','Pollard', 1, 1),
('Gina', 'Barrow', 2,1),
('Asnisha', 'Mcmahon', 1,1),
('Thiago', 'Macfarlane', 6, NULL),
('Shelby', 'Fraser', 4, 5),
('Ada', 'Baxter', 4, 5),
('William', 'Wu', 5, 5),
('Winnie', 'Chang', 9, NULL),
('Sam', 'Stephens', 8, 9),
('Aislinn', 'Anderson', 8, 9);
