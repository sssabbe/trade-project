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

// Маршруты для товаров (цветов)
app.get("/api/flowers", async (req, res) => {
  try {
    console.log("🌸 Запрос всех цветов");
    const flowers = await db.flower.findAll({
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
    
    // Валидация обязательных полей
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
        as: 'parentGroup'
      }]
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
console.log("   GET  /api/health");
console.log("   GET  /api/flowers");
console.log("   POST /api/flowers");
console.log("   GET  /api/flowers/:id");
console.log("   GET  /api/flowers/popular");
console.log("   GET  /api/categories");
console.log("   POST /api/categories");
console.log("   GET  /api/bouquets");
console.log("   POST /api/bouquets");

module.exports = app;