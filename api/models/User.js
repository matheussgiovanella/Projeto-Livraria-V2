const { DataTypes, Model } = require('sequelize');
const db = require('../db/index.js');

class User extends Model {

    static async findUser(email, password)
    {
        return await User.findOne(
        {
            where: {
                email: email,
                password: password
            }
        });
    }
}

User.init({
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
    sex: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
});

module.exports = User;