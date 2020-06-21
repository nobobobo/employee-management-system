select t1.id, first_name, last_name, title, salary from employee t1 LEFT JOIN role t2 ON t1.role_id = t2.id LEFT JOIN department t3 ON t2.department_id = t3.id;


select t1.id, t1.first_name, t1.last_name, title, name as department, salary, concat(t4.first_name, ' ', t4.last_name)  from employee t1 LEFT JOIN role t2 ON t1.role_id = t2.id LEFT JOIN department t3 ON t2.department_id = t3.id LEFT JOIN employee t4 ON t1.manager_id = t4.id;


SELECT id, first_name, last_name FROM employee WHERE manager_id IN (select id from employee WHERE first_name = 'Regina' AND last_name = 'Huang');

SELECT d.name AS department, SUM(salary) AS total_salary FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id GROUP BY department_id;



INSERT INTO role (title, salary, department_id) VALUES ('Intern', 50000, (SELECT id FROM Department WHERE name = 'Sales'));


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Noboru', 'Hayashi', (SELECT id FROM role WHERE title = 'Software Development Engineer'), (SELECT t.id FROM (SELECT * FROM employee WHERE first_name = 'Regina' AND last_name = 'Huang') t ));