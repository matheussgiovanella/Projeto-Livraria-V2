const { DataTypes, Model } = require('sequelize');
const db = require('../db/index.js');

class Format extends Model {


}

Format.init({
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
    modelName: 'Format',
    tableName: 'formats',
    timestamps: false
});

module.exports = Format;