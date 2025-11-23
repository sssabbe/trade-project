module.exports = (sequelize, Sequelize) => {
  const GoodsGroup = sequelize.define("goodsGroup", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    baseGoodsGroup: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'goodsgroups',
    timestamps: true
  });

  // Самосвязь для иерархии категорий
  GoodsGroup.associate = function(models) {
    GoodsGroup.belongsTo(models.goodsGroup, { 
      as: 'parent', 
      foreignKey: 'parent_category_id' 
    });
    GoodsGroup.hasMany(models.goodsGroup, { 
      as: 'children', 
      foreignKey: 'parent_category_id' 
    });
  };

  return GoodsGroup;
};