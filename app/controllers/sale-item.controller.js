const db = require("../models");
const SaleItem = db.saleItem;

exports.create = (req, res) => {
  const saleItem = {
    receipt_number: req.body.receipt_number,
    article: req.body.article,
    quantity: req.body.quantity,
    price_at_sale: req.body.price_at_sale
  };

  SaleItem.create(saleItem)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  SaleItem.findAll({ include: ["sale", "product"] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};