const { DataTypes, Model } = require('sequelize');
const db = require('../db/index.js');
const City = require('./City.js');

class Publisher extends Model {


}

Publisher.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Publisher',
    tableName: 'publishers',
    timestamps: false
});

Publisher.belongsTo(City, {
    foreignKey: {
        name: 'city_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    targetKey: 'id',
});

module.exports = Publisher;