//для товаров

const db = require("../models");
const GoodsGroup = db.goodsGroup;
const Op = db.Sequelize.Op;

// Create and Save a new GoodsGroup
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Название категории не может быть пустым!"
    });
    return;
  }

  // Create a GoodsGroup
  const goodsGroup = {
    name: req.body.name,
    description: req.body.description,
    baseGoodsGroup: req.body.baseGoodsGroup || false,
    parent_category_id: req.body.parent_category_id || null
  };

  // Save GoodsGroup in the database
  GoodsGroup.create(goodsGroup)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка при создании категории товаров."
      });
    });
};

// Retrieve all GoodsGroups from the database
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  GoodsGroup.findAll({ 
    where: condition,
    include: [{
      model: GoodsGroup,
      as: 'parent'
    }],
    order: [['createdAt', 'DESC']]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка при получении категорий товаров."
      });
    });
};

// Find a single GoodsGroup with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  GoodsGroup.findByPk(id, {
    include: [{
      model: GoodsGroup,
      as: 'parent'
    }]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Категория товаров с id=${id} не найдена.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при получении категории товаров с id=${id}`
      });
    });
};

// Update a GoodsGroup by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  GoodsGroup.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Категория товаров успешно обновлена."
        });
      } else {
        res.send({
          message: `Невозможно обновить категорию товаров с id=${id}. Возможно, категория не найдена или req.body пуст!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Ошибка при обновлении категории товаров с id=${id}`
      });
    });
};

// Delete a GoodsGroup with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  GoodsGroup.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Категория товаров успешно удалена!"
        });
      } else {
        res.send({
          message: `Невозможно удалить категорию товаров с id=${id}. Возможно, категория не найдена!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Не удалось удалить категорию товаров с id=${id}`
      });
    });
};

// Delete all GoodsGroups from the database
exports.deleteAll = (req, res) => {
  GoodsGroup.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} категорий товаров были успешно удалены!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка при удалении всех категорий товаров."
      });
    });
};

// Find all base GoodsGroups
exports.findAllBase = (req, res) => {
  GoodsGroup.findAll({ 
    where: { baseGoodsGroup: true },
    order: [['name', 'ASC']]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ошибка при получении базовых категорий."
      });
    });
};