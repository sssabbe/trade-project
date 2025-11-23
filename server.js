require('dotenv').config();
const express = require("express");
const db = require("./app/models");
const path = require("path");

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

// ==================== СУЩЕСТВУЮЩИЕ МАРШРУТЫ ====================

// Маршруты для товаров (цветов)
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

// Маршруты для групп товаров (категории цветов)
app.get("/api/categories", async (req, res) => {
  try {
    console.log("📦 Получение всех категорий цветов");
    const categories = await db.goodsGroup.findAll({
      include: [{
        model: db.goodsGroup,
        as: 'parent'
      }],
      order: [['hierarchy_level', 'ASC']]
    });
    console.log(`✅ Найдено категорий: ${categories.length}`);
    res.json(categories);
  } catch (err) {
    console.error("❌ Ошибка при получении категорий:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    console.log("📦 Создание новой категории:", req.body);
    const category = await db.goodsGroup.create(req.body);
    console.log("✅ Категория создана:", category.id);
    res.json(category);
  } catch (err) {
    console.error("❌ Ошибка при создании категории:", err.message);
    res.status(500).json({ error: err.message });
  }
});

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

// ==================== НОВЫЕ МАРШРУТЫ ДЛЯ ТАБЛИЦ ====================

// 📊 ПОКУПАТЕЛИ
app.get("/api/customers", async (req, res) => {
  try {
    console.log("👥 Запрос всех покупателей");
    const customers = await db.customer.findAll({
      order: [['customer_code', 'ASC']]
    });
    console.log(`✅ Найдено покупателей: ${customers.length}`);
    res.json(customers);
  } catch (err) {
    console.error("❌ Ошибка получения покупателей:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/customers", async (req, res) => {
  try {
    console.log("👥 Создание нового покупателя:", req.body);
    const customer = await db.customer.create(req.body);
    console.log("✅ Покупатель создан с кодом:", customer.customer_code);
    res.json(customer);
  } catch (err) {
    console.error("❌ Ошибка создания покупателя:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await db.customer.findByPk(req.params.id);
    customer ? res.json(customer) : res.status(404).json({ error: "Покупатель не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const updated = await db.customer.update(req.body, {
      where: { customer_code: req.params.id }
    });
    updated[0] === 1 ? res.json({ message: "Покупатель обновлен" }) : res.status(404).json({ error: "Покупатель не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  try {
    const deleted = await db.customer.destroy({
      where: { customer_code: req.params.id }
    });
    deleted === 1 ? res.json({ message: "Покупатель удален" }) : res.status(404).json({ error: "Покупатель не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👨‍💼 СОТРУДНИКИ
app.get("/api/employees", async (req, res) => {
  try {
    console.log("👨‍💼 Запрос всех сотрудников");
    const employees = await db.employee.findAll({
      order: [['employee_id', 'ASC']]
    });
    console.log(`✅ Найдено сотрудников: ${employees.length}`);
    res.json(employees);
  } catch (err) {
    console.error("❌ Ошибка получения сотрудников:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    console.log("👨‍💼 Создание нового сотрудника:", req.body);
    const employee = await db.employee.create(req.body);
    console.log("✅ Сотрудник создан с ID:", employee.employee_id);
    res.json(employee);
  } catch (err) {
    console.error("❌ Ошибка создания сотрудника:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/employees/:id", async (req, res) => {
  try {
    const employee = await db.employee.findByPk(req.params.id);
    employee ? res.json(employee) : res.status(404).json({ error: "Сотрудник не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    const updated = await db.employee.update(req.body, {
      where: { employee_id: req.params.id }
    });
    updated[0] === 1 ? res.json({ message: "Сотрудник обновлен" }) : res.status(404).json({ error: "Сотрудник не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  try {
    const deleted = await db.employee.destroy({
      where: { employee_id: req.params.id }
    });
    deleted === 1 ? res.json({ message: "Сотрудник удален" }) : res.status(404).json({ error: "Сотрудник не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌹 ТОВАРЫ (PRODUCTS)
app.get("/api/products", async (req, res) => {
  try {
    console.log("🌹 Запрос всех товаров");
    const products = await db.product.findAll({
      include: [
        { model: db.category, as: 'category' },
        { model: db.supplier, as: 'supplier' }
      ],
      order: [['product_name', 'ASC']]
    });
    console.log(`✅ Найдено товаров: ${products.length}`);
    res.json(products);
  } catch (err) {
    console.error("❌ Ошибка получения товаров:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    console.log("🌹 Создание нового товара:", req.body);
    const product = await db.product.create(req.body);
    console.log("✅ Товар создан с артикулом:", product.article);
    res.json(product);
  } catch (err) {
    console.error("❌ Ошибка создания товара:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await db.product.findByPk(req.params.id, {
      include: [
        { model: db.category, as: 'category' },
        { model: db.supplier, as: 'supplier' }
      ]
    });
    product ? res.json(product) : res.status(404).json({ error: "Товар не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const updated = await db.product.update(req.body, {
      where: { article: req.params.id }
    });
    updated[0] === 1 ? res.json({ message: "Товар обновлен" }) : res.status(404).json({ error: "Товар не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deleted = await db.product.destroy({
      where: { article: req.params.id }
    });
    deleted === 1 ? res.json({ message: "Товар удален" }) : res.status(404).json({ error: "Товар не найден" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚚 ПОСТАВЩИКИ
app.get("/api/suppliers", async (req, res) => {
  try {
    console.log("🚚 Запрос всех поставщиков");
    const suppliers = await db.supplier.findAll({
      order: [['supplier_code', 'ASC']]
    });
    console.log(`✅ Найдено поставщиков: ${suppliers.length}`);
    res.json(suppliers);
  } catch (err) {
    console.error("❌ Ошибка получения поставщиков:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/suppliers", async (req, res) => {
  try {
    console.log("🚚 Создание нового поставщика:", req.body);
    const supplier = await db.supplier.create(req.body);
    console.log("✅ Поставщик создан с кодом:", supplier.supplier_code);
    res.json(supplier);
  } catch (err) {
    console.error("❌ Ошибка создания поставщика:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Маршруты для групп товаров (категории цветов)
app.get("/api/categories", async (req, res) => {
  try {
    console.log("📦 Получение всех категорий цветов");
    const categories = await db.goodsGroup.findAll({
      include: [{
        model: db.goodsGroup,
        as: 'parent'
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log(`✅ Найдено категорий: ${categories.length}`);
    res.json(categories);
  } catch (err) {
    console.error("❌ Ошибка при получении категорий:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    console.log("📂 Создание новой категории:", req.body);
    const category = await db.category.create(req.body);
    console.log("✅ Категория создана с кодом:", category.category_code);
    res.json(category);
  } catch (err) {
    console.error("❌ Ошибка создания категории:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 💰 ПРОДАЖИ
app.get("/api/sales", async (req, res) => {
  try {
    console.log("💰 Запрос всех продаж");
    const sales = await db.sale.findAll({
      include: [
        { model: db.employee, as: 'employee' },
        { model: db.customer, as: 'customer' },
        { 
          model: db.saleItem, 
          as: 'saleItems',
          include: [{ model: db.product, as: 'product' }]
        }
      ],
      order: [['sale_datetime', 'DESC']]
    });
    console.log(`✅ Найдено продаж: ${sales.length}`);
    res.json(sales);
  } catch (err) {
    console.error("❌ Ошибка получения продаж:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sales", async (req, res) => {
  try {
    console.log("💰 Создание новой продажи:", req.body);
    const sale = await db.sale.create(req.body);
    console.log("✅ Продажа создана с номером:", sale.receipt_number);
    res.json(sale);
  } catch (err) {
    console.error("❌ Ошибка создания продажи:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🏷️ ПРАЙС-ЛИСТ
app.get("/api/pricelist", async (req, res) => {
  try {
    console.log("🏷️ Запрос прайс-листа");
    const prices = await db.priceList.findAll({
      include: [{ model: db.product, as: 'product' }],
      order: [['effective_date', 'DESC']]
    });
    console.log(`✅ Найдено записей в прайс-листе: ${prices.length}`);
    res.json(prices);
  } catch (err) {
    console.error("❌ Ошибка получения прайс-листа:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/pricelist", async (req, res) => {
  try {
    console.log("🏷️ Добавление новой цены:", req.body);
    const price = await db.priceList.create(req.body);
    console.log("✅ Цена добавлена с ID:", price.price_id);
    res.json(price);
  } catch (err) {
    console.error("❌ Ошибка добавления цены:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🛒 СОСТАВ ПРОДАЖИ
app.get("/api/sale-items", async (req, res) => {
  try {
    console.log("🛒 Запрос состава продаж");
    const saleItems = await db.saleItem.findAll({
      include: [
        { model: db.sale, as: 'sale' },
        { model: db.product, as: 'product' }
      ],
      order: [['receipt_number', 'DESC']]
    });
    console.log(`✅ Найдено позиций продаж: ${saleItems.length}`);
    res.json(saleItems);
  } catch (err) {
    console.error("❌ Ошибка получения состава продаж:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sale-items", async (req, res) => {
  try {
    console.log("🛒 Добавление позиции продажи:", req.body);
    const saleItem = await db.saleItem.create(req.body);
    console.log("✅ Позиция продажи добавлена");
    res.json(saleItem);
  } catch (err) {
    console.error("❌ Ошибка добавления позиции продажи:", err.message);
    res.status(500).json({ error: err.message });
  }
});

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
console.log("   📊 Основные маршруты:");
console.log("   GET  /api/health");
console.log("   GET  /api/flowers");
console.log("   POST /api/flowers");
console.log("   GET  /api/flowers/:id");
console.log("   GET  /api/flowers/popular");
console.log("   GET  /api/categories");
console.log("   POST /api/categories");
console.log("   GET  /api/bouquets");
console.log("   POST /api/bouquets");

console.log("   👥 Новые маршруты:");
console.log("   GET/POST/PUT/DELETE /api/customers");
console.log("   GET/POST/PUT/DELETE /api/employees");
console.log("   GET/POST/PUT/DELETE /api/products");
console.log("   GET/POST /api/suppliers");
console.log("   GET/POST /api/sales");
console.log("   GET/POST /api/pricelist");
console.log("   GET/POST /api/sale-items");
console.log("   GET /api/categories/:id/products");
console.log("   GET /api/products/:id/prices");
console.log("   GET /api/products/search/:query");

module.exports = app;