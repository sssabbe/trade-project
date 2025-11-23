// app/controllers/customer.controller.js
const db = require("../models");
const Customer = db.customer;

// Создание нового покупателя
exports.create = (req, res) => {
  const customer = {
    full_name: req.body.full_name,
    contacts: req.body.contacts,
    customer_type: req.body.customer_type,
    accumulated_discount_percent: req.body.accumulated_discount_percent
  };

  Customer.create(customer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка при создании покупателя"
      });
    });
};

// Получение всех покупателей
exports.findAll = (req, res) => {
  Customer.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка при получении покупателей"
      });
    });
};

// Получение покупателя по ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Customer.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Покупатель с id=${id} не найден`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при получении покупателя с id=${id}`
      });
    });
};

// Обновление покупателя
exports.update = (req, res) => {
  const id = req.params.id;

  Customer.update(req.body, {
    where: { customer_code: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Покупатель успешно обновлен"
        });
      } else {
        res.send({
          message: `Не удалось обновить покупателя с id=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при обновлении покупателя с id=${id}`
      });
    });
};

// Удаление покупателя
exports.delete = (req, res) => {
  const id = req.params.id;

  Customer.destroy({
    where: { customer_code: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Покупатель успешно удален"
        });
      } else {
        res.send({
          message: `Не удалось удалить покупателя с id=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при удалении покупателя с id=${id}`
      });
    });
};