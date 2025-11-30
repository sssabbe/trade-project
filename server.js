require('dotenv').config();
const express = require("express");
const db = require("./app/models");
const path = require("path");

// Импорт контроллеров
const goodsGroups = require("./app/controllers/goodsgroup.controller.js");
const categories = require("./app/controllers/category.controller.js");
const products = require("./app/controllers/product.controller.js");
const customers = require("./app/controllers/customer.controller.js");
const employees = require("./app/controllers/employee.controller.js");
const suppliers = require("./app/controllers/supplier.controller.js");
const sales = require("./app/controllers/sale.controller.js");
const priceList = require("./app/controllers/price-list.controller.js");
const saleItems = require("./app/controllers/sale-item.controller.js");

const app = express();
const PORT = process.env.NODE_LOCAL_PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Синхронизация с БД и запуск сервера
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ База данных цветочного магазина синхронизирована.");
    console.log("📊 Доступные модели:");
    Object.keys(db).forEach(modelName => {
      if (db[modelName] && typeof db[modelName] === 'object' && db[modelName].name) {
        console.log(`   - ${modelName}: ${db[modelName].name}`);
      }
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 Сервер цветочного магазина запущен на порту ${PORT}`);
      console.log(`🌐 Откройте в браузере: http://localhost:${PORT}`);
      console.log(`🌸 Добро пожаловать в Flower Shop!`);
    });
  })
  .catch((err) => {
    console.log("❌ Ошибка синхронизации БД: " + err.message);
  });

// Главная страница - отдаем HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== API МАРШРУТЫ ДЛЯ ЦВЕТОЧНОГО МАГАЗИНА ====================

// Проверка здоровья приложения
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: "Connected",
    shop: "Flower Shop",
    models: Object.keys(db).filter(key => key !== 'Sequelize' && key !== 'sequelize')
  });
});

// ==================== СТАРЫЕ МАРШРУТЫ (goodsGroup, flower, bouquet) ====================

// Маршруты для товаров (цветов) - пока оставляем как есть
app.get("/api/flowers", async (req, res) => {
  try {
    console.log("🌸 Запрос всех цветов");
    const flowers = await db.flower.findAll({
      include: [{
        model: db.goodsGroup,
        as: 'category'
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log(`✅ Найдено цветов: ${flowers.length}`);
    res.json(flowers);
  } catch (err) {
    console.error("❌ Ошибка получения цветов:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/flowers", async (req, res) => {
  try {
    console.log("📨 Получен запрос на добавление цветка:", req.body);
    
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ 
        error: "Обязательные поля: name, price" 
      });
    }
    
    const flower = await db.flower.create(req.body);
    console.log("✅ Цветок добавлен с ID:", flower.id);
    res.json(flower);
  } catch (err) {
    console.error("❌ Ошибка добавления цветка:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/flowers/:id", async (req, res) => {
  try {
    console.log(`🌸 Запрос цветка с ID: ${req.params.id}`);
    const flower = await db.flower.findByPk(req.params.id);
    
    if (flower) {
      console.log("✅ Цветок найден:", flower.name);
      res.json(flower);
    } else {
      console.log("❌ Цветок не найден, ID:", req.params.id);
      res.status(404).json({ error: "Цветок не найден" });
    }
  } catch (err) {
    console.error("❌ Ошибка получения цветка:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Маршруты для СТАРЫХ категорий (goodsGroup) - через контроллер
app.get("/api/goods-categories", goodsGroups.findAll);
app.post("/api/goods-categories", goodsGroups.create);
app.get("/api/goods-categories/:id", goodsGroups.findOne);
app.put("/api/goods-categories/:id", goodsGroups.update);
app.delete("/api/goods-categories/:id", goodsGroups.delete);
app.delete("/api/goods-categories", goodsGroups.deleteAll);
app.get("/api/goods-categories-base", goodsGroups.findAllBase);

// Маршруты для букетов
app.get("/api/bouquets", async (req, res) => {
  try {
    console.log("💐 Запрос всех букетов");
    const bouquets = await db.bouquet.findAll({
      order: [['createdAt', 'DESC']]
    });
    console.log(`✅ Найдено букетов: ${bouquets.length}`);
    res.json(bouquets);
  } catch (err) {
    console.error("❌ Ошибка получения букетов:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bouquets", async (req, res) => {
  try {
    console.log("💐 Создание нового букета:", req.body);
    const bouquet = await db.bouquet.create(req.body);
    console.log("✅ Букет создан с ID:", bouquet.id);
    res.json(bouquet);
  } catch (err) {
    console.error("❌ Ошибка создания букета:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Маршрут для получения популярных цветов
app.get("/api/flowers/popular", async (req, res) => {
  try {
    console.log("⭐ Запрос популярных цветов");
    const popularFlowers = await db.flower.findAll({
      where: { isPopular: true },
      limit: 8
    });
    console.log(`✅ Найдено популярных цветов: ${popularFlowers.length}`);
    res.json(popularFlowers);
  } catch (err) {
    console.error("❌ Ошибка получения популярных цветов:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==================== НОВЫЕ МАРШРУТЫ ЧЕРЕЗ КОНТРОЛЛЕРЫ ====================

// 📊 ПОКУПАТЕЛИ
app.get("/api/customers", customers.findAll);
app.post("/api/customers", customers.create);
app.get("/api/customers/:id", customers.findOne);
app.put("/api/customers/:id", customers.update);
app.delete("/api/customers/:id", customers.delete);
app.delete("/api/customers", customers.deleteAll);

// 👨‍💼 СОТРУДНИКИ
app.get("/api/employees", employees.findAll);
app.post("/api/employees", employees.create);
app.get("/api/employees/:id", employees.findOne);
app.put("/api/employees/:id", employees.update);
app.delete("/api/employees/:id", employees.delete);
app.delete("/api/employees", employees.deleteAll);

// 🌹 ТОВАРЫ (PRODUCTS)
app.get("/api/products", products.findAll);
app.post("/api/products", products.create);
app.get("/api/products/:id", products.findOne);
app.put("/api/products/:id", products.update);
app.delete("/api/products/:id", products.delete);
app.delete("/api/products", products.deleteAll);

// 🚚 ПОСТАВЩИКИ
app.get("/api/suppliers", suppliers.findAll);
app.post("/api/suppliers", suppliers.create);
app.get("/api/suppliers/:id", suppliers.findOne);
app.put("/api/suppliers/:id", suppliers.update);
app.delete("/api/suppliers/:id", suppliers.delete);
app.delete("/api/suppliers", suppliers.deleteAll);

// 📂 НОВЫЕ КАТЕГОРИИ (category)
app.get("/api/categories", categories.findAll);
app.post("/api/categories", categories.create);
app.get("/api/categories/:id", categories.findOne);
app.put("/api/categories/:id", categories.update);
app.delete("/api/categories/:id", categories.delete);
app.delete("/api/categories", categories.deleteAll);

// 💰 ПРОДАЖИ
app.get("/api/sales", sales.findAll);
app.post("/api/sales", sales.create);
app.get("/api/sales/:id", sales.findOne);
app.put("/api/sales/:id", sales.update);
app.delete("/api/sales/:id", sales.delete);
app.delete("/api/sales", sales.deleteAll);

// 🏷️ ПРАЙС-ЛИСТ
app.get("/api/pricelist", priceList.findAll);
app.post("/api/pricelist", priceList.create);
app.get("/api/pricelist/:id", priceList.findOne);
app.put("/api/pricelist/:id", priceList.update);
app.delete("/api/pricelist/:id", priceList.delete);
app.delete("/api/pricelist", priceList.deleteAll);

// 🛒 СОСТАВ ПРОДАЖИ
app.get("/api/sale-items", saleItems.findAll);
app.post("/api/sale-items", saleItems.create);
app.get("/api/sale-items/:id", saleItems.findOne);
app.put("/api/sale-items/:id", saleItems.update);
app.delete("/api/sale-items/:id", saleItems.delete);
app.delete("/api/sale-items", saleItems.deleteAll);

// ==================== ДОПОЛНИТЕЛЬНЫЕ МАРШРУТЫ ====================

// Получить товары по категории
app.get("/api/categories/:id/products", async (req, res) => {
  try {
    const products = await db.product.findAll({
      where: { category_code: req.params.id },
      include: [
        { model: db.category, as: 'category' },
        { model: db.supplier, as: 'supplier' }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить актуальные цены на товары
app.get("/api/products/:id/prices", async (req, res) => {
  try {
    const prices = await db.priceList.findAll({
      where: { article: req.params.id },
      order: [['effective_date', 'DESC']],
      limit: 5
    });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Поиск товаров
app.get("/api/products/search/:query", async (req, res) => {
  try {
    const products = await db.product.findAll({
      where: {
        product_name: {
          [db.Sequelize.Op.iLike]: `%${req.params.query}%`
        }
      },
      include: [
        { model: db.category, as: 'category' },
        { model: db.supplier, as: 'supplier' }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обработка 404 для API
app.use("/api/*", (req, res) => {
  console.log(`❌ API маршрут не найден: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "API маршрут не найден",
    path: req.originalUrl 
  });
});

// Обработка 404 для остальных маршрутов
app.use((req, res) => {
  console.log(`❌ Маршрут не найден: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: "Маршрут не найден",
    path: req.path 
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error("💥 Необработанная ошибка:", err);
  res.status(500).json({ 
    error: "Внутренняя ошибка сервера"
  });
});

console.log("🔄 Загруженные маршруты для цветочного магазина:");
console.log("   🌸 Старые маршруты:");
console.log("   GET/POST /api/flowers");
console.log("   GET /api/flowers/:id");
console.log("   GET /api/flowers/popular");
console.log("   GET/POST/PUT/DELETE /api/goods-categories");
console.log("   GET/POST /api/bouquets");

console.log("   📊 Новые маршруты через контроллеры:");
console.log("   GET/POST/PUT/DELETE /api/customers");
console.log("   GET/POST/PUT/DELETE /api/employees");
console.log("   GET/POST/PUT/DELETE /api/products");
console.log("   GET/POST/PUT/DELETE /api/suppliers");
console.log("   GET/POST/PUT/DELETE /api/categories");
console.log("   GET/POST/PUT/DELETE /api/sales");
console.log("   GET/POST/PUT/DELETE /api/pricelist");
console.log("   GET/POST/PUT/DELETE /api/sale-items");

console.log("   🔍 Дополнительные маршруты:");
console.log("   GET /api/categories/:id/products");
console.log("   GET /api/products/:id/prices");
console.log("   GET /api/products/search/:query");

module.exports = app;