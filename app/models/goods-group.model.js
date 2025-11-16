module.exports = (sequelize, Sequelize) => {
    const GoodsGroup = sequelize.define("goodsgroup", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING
        },
        baseGoodsGroup: {
            type: Sequelize.INTEGER
        }
    });
    
    // Связь для иерархии групп (родительская группа)
    GoodsGroup.belongsTo(GoodsGroup, { 
        as: 'parentGroup',
        foreignKey: 'baseGoodsGroup' 
    });

    return GoodsGroup;
};