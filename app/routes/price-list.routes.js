module.exports = app => {
  const prices = require("../controllers/price-list.controller.js");
  var router = require("express").Router();

  router.post("/", prices.create);
  router.get("/", prices.findAll);
  router.get("/:id", prices.findOne);
  router.put("/:id", prices.update);
  router.delete("/:id", prices.delete);

  app.use('/api/pricelist', router);
};