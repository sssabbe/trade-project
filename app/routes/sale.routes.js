module.exports = app => {
  const sales = require("../controllers/sale.controller.js");
  var router = require("express").Router();

  router.post("/", sales.create);
  router.get("/", sales.findAll);
  router.get("/:id", sales.findOne);
  router.put("/:id", sales.update);
  router.delete("/:id", sales.delete);

  app.use('/api/sales', router);
};