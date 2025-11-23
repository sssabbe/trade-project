const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

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

// Существующие модели
db.goodsGroup = require("./goods-group.model.js")(sequelize, Sequelize);
db.flower = require("./flower.model.js")(sequelize, Sequelize);
db.bouquet = require("./bouquet.model.js")(sequelize, Sequelize);

// Новые модели
db.category = require("./category.model.js")(sequelize, Sequelize);
db.supplier = require("./supplier.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize, Sequelize);
db.employee = require("./employee.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.priceList = require("./price-list.model.js")(sequelize, Sequelize);
db.sale = require("./sale.model.js")(sequelize, Sequelize);
db.saleItem = require("./sale-item.model.js")(sequelize, Sequelize);

// ==================== СВЯЗИ ДЛЯ СУЩЕСТВУЮЩИХ МОДЕЛЕЙ ====================

// Связи между цветами и goodsGroup (старые категории)
db.flower.belongsTo(db.goodsGroup, { 
    as: 'category',
    foreignKey: 'categoryId' 
});

db.goodsGroup.hasMany(db.flower, {
    as: 'flowers',
    foreignKey: 'categoryId'
});

// Самосвязь для goodsGroup (если нужно)
db.goodsGroup.belongsTo(db.goodsGroup, { 
    as: 'parentGroup', 
    foreignKey: 'parent_category_id' 
});
db.goodsGroup.hasMany(db.goodsGroup, { 
    as: 'childGroups', 
    foreignKey: 'parent_category_id' 
});

// ==================== СВЯЗИ ДЛЯ НОВЫХ МОДЕЛЕЙ ====================

// Категория -> Товары
db.category.hasMany(db.product, { 
    foreignKey: 'category_code',
    as: 'products' 
});
db.product.belongsTo(db.category, { 
    foreignKey: 'category_code',
    as: 'category' 
});

// Самосвязь категорий (иерархия)
db.category.belongsTo(db.category, { 
    as: 'parent', 
    foreignKey: 'parent_category_id' 
});
db.category.hasMany(db.category, { 
    as: 'children', 
    foreignKey: 'parent_category_id' 
});

// Поставщик -> Товары
db.supplier.hasMany(db.product, { 
    foreignKey: 'supplier_code',
    as: 'products' 
});
db.product.belongsTo(db.supplier, { 
    foreignKey: 'supplier_code',
    as: 'supplier' 
});

// Товар -> Прайс-лист
db.product.hasMany(db.priceList, { 
    foreignKey: 'article',
    as: 'prices' 
});
db.priceList.belongsTo(db.product, { 
    foreignKey: 'article',
    as: 'product' 
});

// Сотрудник -> Продажи
db.employee.hasMany(db.sale, { 
    foreignKey: 'employee_id',
    as: 'sales' 
});
db.sale.belongsTo(db.employee, { 
    foreignKey: 'employee_id',
    as: 'employee' 
});

// Покупатель -> Продажи
db.customer.hasMany(db.sale, { 
    foreignKey: 'customer_code',
    as: 'sales' 
});
db.sale.belongsTo(db.customer, { 
    foreignKey: 'customer_code',
    as: 'customer' 
});

// Продажа -> Состав продажи
db.sale.hasMany(db.saleItem, { 
    foreignKey: 'receipt_number',
    as: 'saleItems' 
});
db.saleItem.belongsTo(db.sale, { 
    foreignKey: 'receipt_number',
    as: 'sale' 
});

// Товар -> Состав продажи
db.product.hasMany(db.saleItem, { 
    foreignKey: 'article',
    as: 'saleItems' 
});
db.saleItem.belongsTo(db.product, { 
    foreignKey: 'article',
    as: 'product' 
});

module.exports = db;