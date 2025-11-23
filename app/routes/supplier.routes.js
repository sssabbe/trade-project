module.exports = app => {
  const suppliers = require("../controllers/supplier.controller.js");
  var router = require("express").Router();

  router.post("/", suppliers.create);
  router.get("/", suppliers.findAll);
  router.get("/:id", suppliers.findOne);
  router.put("/:id", suppliers.update);
  router.delete("/:id", suppliers.delete);

  app.use('/api/suppliers', router);
};