select t1.id, first_name, last_name, title, salary from employee t1 LEFT JOIN role t2 ON t1.role_id = t2.id LEFT JOIN department t3 ON t2.department_id = t3.id;


select t1.id, t1.first_name, t1.last_name, title, name as department, salary, concat(t4.first_name, ' ', t4.last_name)  from employee t1 LEFT JOIN role t2 ON t1.role_id = t2.id LEFT JOIN department t3 ON t2.department_id = t3.id LEFT JOIN employee t4 ON t1.manager_id = t4.id;


SELECT id, first_name, last_name FROM employee WHERE manager_id IN (select id from employee WHERE first_name = 'Regina' AND last_name = 'Huang');