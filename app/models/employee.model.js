module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("employee", {
    employee_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    position: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    contacts: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    work_schedule: {
      type: Sequelize.STRING(50)
    },
    hire_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, {
    tableName: 'employees',
    timestamps: true
  });
  return Employee;
};