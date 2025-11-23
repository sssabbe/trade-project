const db = require("../models");
const PriceList = db.priceList;

exports.create = (req, res) => {
  const price = {
    article: req.body.article,
    effective_date: req.body.effective_date,
    price: req.body.price,
    discount_type: req.body.discount_type,
    discount_percent: req.body.discount_percent
  };

  PriceList.create(price)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  PriceList.findAll({ include: ["product"] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};