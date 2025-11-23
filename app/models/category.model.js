module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    category_code: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    hierarchy_level: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    parent_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'categories',
    timestamps: true
  });
  return Category;
};