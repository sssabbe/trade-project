module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define("sale", {
    receipt_number: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sale_datetime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    employee_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    customer_code: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('оформлен', 'оплачен', 'отменен'),
      defaultValue: 'оформлен'
    }
  }, {
    tableName: 'sales',
    timestamps: true
  });
  return Sale;
};