const db = require("../models");
const Sale = db.sale;

exports.create = (req, res) => {
  const sale = {
    sale_datetime: req.body.sale_datetime,
    employee_id: req.body.employee_id,
    customer_code: req.body.customer_code,
    total_amount: req.body.total_amount,
    status: req.body.status
  };

  Sale.create(sale)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Sale.findAll({ 
    include: [
      { model: db.employee, as: "employee" },
      { model: db.customer, as: "customer" },
      { model: db.saleItem, as: "saleItems", include: ["product"] }
    ] 
  })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};