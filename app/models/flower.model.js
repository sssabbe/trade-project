module.exports = (sequelize, Sequelize) => {
    const Flower = sequelize.define("flower", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        latinName: {
            type: Sequelize.STRING,
            comment: "Латинское название цветка"
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            comment: "Описание цветка"
        },
        color: {
            type: Sequelize.STRING,
            comment: "Основной цвет"
        },
        season: {
            type: Sequelize.STRING,
            comment: "Сезонность: весна, лето, осень, зима, круглый год"
        },
        inStock: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        imageUrl: {
            type: Sequelize.STRING,
            comment: "URL изображения цветка"
        },
        isPopular: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        categoryId: {
            type: Sequelize.INTEGER,
            comment: "Ссылка на категорию из goodsGroup"
        }
    });

    return Flower;
};