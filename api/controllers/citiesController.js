const { Op } = require('sequelize');
const CityModel = require('../models/City.js');
const State = require('../models/State.js');
const logs = require('../logs.js');
const axios = require('axios');

class CityController {

    index = async (req, res, next) => {
        const params = req.query;
        const limit = params.limit || 100;
        const page = params.page || 1;
        const offset = (page - 1) * limit;
        const sort = params.sort || 'id';
        const order = params.order || 'ASC';
        const where = {};

        if (params.exclude) {
            where.id = {
                [Op.ne]: params.exclude
            }
        }

        res.json(await CityModel.findAll({
            include: {
                model: State
            },
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]]
        }));
    }
    show = async (req, res, next) => {
        const city = await CityModel.findByPk(req.params.cityId, {
            include: {
                model: State
            }
        });
        res.json(city);
    }
    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const city = await CityModel.create(data);
            const state = await State.findByPk(city.dataValues.state_id);
            const action = `City ${city.dataValues.name}/${state.dataValues.province} created!`;
            await logs.add(action);
            res.json(city);
        } catch (error) {

            res.status(400).json({ error: error.message });
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.cityId;
            const data = await this._validateData(req.body, id);
            const oldCity = await CityModel.findByPk(id);
            const oldState = await State.findByPk(oldCity.dataValues.state_id);
            await CityModel.update(data, {
                where: {
                    id: id
                }
            });
            const newCity = await CityModel.findByPk(id);
            const newState = await State.findByPk(newCity.dataValues.state_id);
            const action = `City ${oldCity.dataValues.name}/${oldState.dataValues.province}->${newCity.dataValues.name}/${newState.dataValues.province}`;
            await logs.add(action);
            res.json(newCity);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    delete = async (req, res, next) => {
        try {
            const id = req.params.cityId;
            const city = await CityModel.findByPk(id);
            const state = await State.findByPk(city.dataValues.state_id);
            await CityModel.destroy({
                where: {
                    id: id
                }
            });
            const action = `City ${city.dataValues.name}/${state.dataValues.province} deleted`;
            await logs.add(action);
            res.json({});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    _validateData = async (data, id) => {
        const attributes = ['name', 'cep', 'state_id'];
        const city = {};

        for (const attribute of attributes) {

            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            city[attribute] = data[attribute];
        }
        if (await this._cityExists(city.name, id, city.state_id)) {
            throw new Error(`The city with name "${city.name}" already exists.`);
        }
        if (!await this._validCEP(city.cep)) {
            throw new Error(`The CEP "${city.cep}" is invalid.`);
        }
        if (await this._cepExists(city.cep, id)) {
            throw new Error(`The city with CEP "${city.cep}" already exists.`);
        }
        return city;
    }
    _cityExists = async (name, id, state_id) => {
        const where = {
            name: name,
            state_id: state_id
        };

        if (id) {
            where.id = { [Op.ne]: id }; // WHERE id != id
        }

        const count = await CityModel.count({
            where: where
        });

        return count > 0;
    }
    _validCEP = async (cep) => {
        const response = await axios.get(`http://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        if (data.erro) {
            return false;
        } else {
            return true;
        }
    }
    _cepExists = async (cep, id) => {
        const where = {
            cep: cep
        }

        if (id) {
            where.id = { [Op.ne]: id };
        }

        const count = await CityModel.count({
            where: where
        });

        return count > 0;
    }
}

module.exports = new CityController();