const db = require("../models");
const Product = db.product;

exports.create = (req, res) => {
  const product = {
    article: req.body.article,
    product_name: req.body.product_name,
    description: req.body.description,
    category_code: req.body.category_code,
    country_of_origin: req.body.country_of_origin,
    grade: req.body.grade,
    expiration_date: req.body.expiration_date,
    unit_of_measure: req.body.unit_of_measure,
    supplier_code: req.body.supplier_code
  };

  Product.create(product)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Product.findAll({ include: ["category", "supplier"] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// остальные методы аналогично...