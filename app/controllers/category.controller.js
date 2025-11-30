//для цветов и букетлв
const db = require("../models");
const Category = db.category;

exports.create = (req, res) => {
  const category = {
    category_name: req.body.category_name,
    hierarchy_level: req.body.hierarchy_level,
    parent_category_id: req.body.parent_category_id
  };

  Category.create(category)
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

exports.findAll = (req, res) => {
  Category.findAll({ include: ["parent", "children"] })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};