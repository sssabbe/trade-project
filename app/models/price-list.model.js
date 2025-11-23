module.exports = (sequelize, Sequelize) => {
  const PriceList = sequelize.define("priceList", {
    price_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    article: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    effective_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    discount_type: {
      type: Sequelize.ENUM('процент', 'фиксированная', 'акция')
    },
    discount_percent: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'pricelist',
    timestamps: true
  });
  return PriceList;
};