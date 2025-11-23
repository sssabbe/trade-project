module.exports = (sequelize, Sequelize) => {
  const Supplier = sequelize.define("supplier", {
    supplier_code: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    company_name: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    contacts: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    country: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    reliability_rating: {
      type: Sequelize.INTEGER
    },
    specialization: {
      type: Sequelize.STRING(100)
    }
  }, {
    tableName: 'suppliers',
    timestamps: true
  });
  return Supplier;
};