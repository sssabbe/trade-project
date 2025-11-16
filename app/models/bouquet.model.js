module.exports = (sequelize, Sequelize) => {
    const Bouquet = sequelize.define("bouquet", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            comment: "Описание букета"
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        size: {
            type: Sequelize.STRING,
            comment: "Размер: маленький, средний, большой"
        },
        flowersCount: {
            type: Sequelize.INTEGER,
            comment: "Количество цветов в букете"
        },
        occasion: {
            type: Sequelize.STRING,
            comment: "Повод: день рождения, свадьба, 8 марта и т.д."
        },
        inStock: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        imageUrl: {
            type: Sequelize.STRING,
            comment: "URL изображения букета"
        },
        isCustom: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            comment: "Является ли букет кастомным"
        },
        composition: {
            type: Sequelize.TEXT,
            comment: "Состав букета в JSON формате"
        }
    });

    return Bouquet;
};