const { DataTypes, Model } = require('sequelize');
const db = require('../db/index.js');
const State = require('./State.js');

class City extends Model {


}

City.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    cep: {
        type: DataTypes.CHAR(9),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'City',
    tableName: 'cities',
    timestamps: false
});

City.belongsTo(State, {
    foreignKey: {
        name: 'state_id',
        allowNull: false
    },
    onDelete: 'CASCADE',
    targetKey: 'id',
});

module.exports = City;