const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const PORT = 8080;

// Настройка базы данных
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'flower-shop.db'
});

// Модели
const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false }
});

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING },
  inStock: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Связи
Category.hasMany(Product);
Product.belongsTo(Category);

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Маршруты
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/categories', async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
});

app.get('/api/products', async (req, res) => {
  const products = await Product.findAll({
    include: [{ model: Category }]
  });
  res.json(products);
});

// Инициализация базы данных и запуск сервера
async function startServer() {
  try {
    await sequelize.sync({ force: true });
    
    // Начальные данные
    const categories = await Category.bulkCreate([
      { name: 'Розы' }, 
      { name: 'Экзотические цветы' }, 
      { name: 'Букеты' }
    ]);
    
    // Товары с вашими новыми фотографиями
    const products = await Product.bulkCreate([
      { 
        name: 'Розовая роза', 
        price: 1200, 
        description: 'Нежная розовая роза в подарочной упаковке', 
        categoryId: 1, 
        image: '2025-11-11 22.11.35.jpg' 
      },
      { 
        name: 'Экзотический букет', 
        price: 3200, 
        description: 'Яркий букет из экзотических цветов', 
        categoryId: 2, 
        image: '2025-11-11 22.14.57.jpg' 
      },
      { 
        name: 'Свадебная композиция', 
        price: 4500, 
        description: 'Элегантная белая композиция для свадьбы', 
        categoryId: 3, 
        image: '2025-11-11 22.15.01.jpg' 
      }
    ]);

    console.log('🌸 FLOWER SHOP - Магазин Цветов 🌸');
    console.log(`Сервер запущен: http://localhost:${PORT}`);
    console.log('База данных создана!');
    console.log('Добавлены товары с фотографиями:');
    console.log('- Розовая роза (2025-11-11 22.11.35.jpg)');
    console.log('- Экзотический букет (2025-11-11 22.14.57.jpg)');
    console.log('- Свадебная композиция (2025-11-11 22.15.01.jpg)');
    
    app.listen(PORT);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

startServer();