const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,  // ← УБРАТЬ ЗАПЯТУЮ

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Все модели
db.goodsGroup = require("./goods-group.model.js")(sequelize, Sequelize);
db.flower = require("./flower.model.js")(sequelize, Sequelize);
db.bouquet = require("./bouquet.model.js")(sequelize, Sequelize);

// Связи между моделями (если нужны)
db.flower.belongsTo(db.goodsGroup, { 
    as: 'category',
    foreignKey: 'categoryId' 
});

db.goodsGroup.hasMany(db.flower, {
    as: 'flowers',
    foreignKey: 'categoryId'
});

module.exports = db;