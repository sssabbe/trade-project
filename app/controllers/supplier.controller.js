const db = require("../models");
const Supplier = db.supplier;

exports.create = (req, res) => {
  const supplier = {
    company_name: req.body.company_name,
    contacts: req.body.contacts,
    country: req.body.country,
    reliability_rating: req.body.reliability_rating,
    specialization: req.body.specialization
  };

  Supplier.create(supplier)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Supplier.findAll()
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// остальные методы...