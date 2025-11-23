module.exports = (sequelize, Sequelize) => {
  const SaleItem = sequelize.define("saleItem", {
    receipt_number: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    article: {
      type: Sequelize.STRING(50),
      primaryKey: true
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price_at_sale: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'sale_items',
    timestamps: false
  });
  return SaleItem;
};