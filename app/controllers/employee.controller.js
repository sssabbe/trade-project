const db = require("../models");
const Employee = db.employee;

exports.create = (req, res) => {
  const employee = {
    full_name: req.body.full_name,
    position: req.body.position,
    contacts: req.body.contacts,
    work_schedule: req.body.work_schedule,
    hire_date: req.body.hire_date
  };

  Employee.create(employee)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Employee.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Employee.findByPk(id)
    .then(data => data ? res.send(data) : res.status(404).send({ message: "Сотрудник не найден" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  const id = req.params.id;
  Employee.update(req.body, { where: { employee_id: id } })
    .then(num => num == 1 ? res.send({ message: "Сотрудник обновлен" }) : res.send({ message: "Не удалось обновить" }))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Employee.destroy({ where: { employee_id: id } })
    .then(num => num == 1 ? res.send({ message: "Сотрудник удален" }) : res.send({ message: "Не удалось удалить" }))
    .catch(err => res.status(500).send({ message: err.message }));
};