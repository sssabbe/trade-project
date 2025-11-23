module.exports = app => {
  const saleItems = require("../controllers/sale-item.controller.js");
  var router = require("express").Router();

  router.post("/", saleItems.create);
  router.get("/", saleItems.findAll);
  router.get("/:id", saleItems.findOne);
  router.put("/:id", saleItems.update);
  router.delete("/:id", saleItems.delete);

  app.use('/api/sale-items', router);
};