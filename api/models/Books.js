const { DataTypes, Model } = require('sequelize');
const db = require('../db/index.js');
const Category = require('./Categories.js');
const Publisher = require('./Publisher.js');
const Format = require('./Format.js');

class Book extends Model {


}

Book.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    publication_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.FLOAT(10,2),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Book',
    tableName: 'books',
    timestamps: false
});

Book.belongsTo(Category, {
    foreignKey: {
        name: 'category_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    targetKey: 'id',
});
Book.belongsTo(Publisher, {
    foreignKey: {
        name: 'publisher_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    targetKey: 'id',
});
Book.belongsTo(Format, {
    foreignKey: {
        name: 'format_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    targetKey: 'id',
});

module.exports = Book;