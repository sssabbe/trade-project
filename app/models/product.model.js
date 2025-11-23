module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    article: {
      type: Sequelize.STRING(50),
      primaryKey: true
    },
    product_name: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    category_code: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    country_of_origin: {
      type: Sequelize.STRING(50)
    },
    grade: {
      type: Sequelize.STRING(20)
    },
    expiration_date: {
      type: Sequelize.INTEGER
    },
    unit_of_measure: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    supplier_code: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'products',
    timestamps: true
  });
  return Product;
};