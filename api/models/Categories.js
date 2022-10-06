const { DataTypes, Model } = require('sequelize');
const db = require('../db/index.js');

class Category extends Model {


}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false
});

module.exports = Category;