module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    customer_code: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    contacts: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    customer_type: {
      type: Sequelize.ENUM('физическое', 'юридическое'),
      allowNull: false
    },
    accumulated_discount_percent: {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 0
    }
  }, {
    tableName: 'customers',
    timestamps: true
  });
  return Customer;
};