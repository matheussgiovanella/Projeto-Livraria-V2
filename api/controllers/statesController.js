const { Op } = require('sequelize');
const StateModel = require('../models/State.js');
const logs = require('../logs.js');

class StateController {

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

        res.json(await StateModel.findAll({
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]]
        }));
    }
    show = async (req, res, next) => {
        const state = await StateModel.findByPk(req.params.stateId);
        res.json(state);
    }
    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const state = await StateModel.create(data);
            const action = `State ${state.dataValues.name}-${state.dataValues.province} created`;
            await logs.add(action);
            res.json(state);
        } catch (error) {

            res.status(400).json({ error: error.message });
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.stateId;
            const data = await this._validateData(req.body, id);
            const oldState = await StateModel.findByPk(id);
            await StateModel.update(data, {
                where: {
                    id: id
                }
            });
            const newState = await StateModel.findByPk(id);
            const action = `State ${oldState.dataValues.name}-${oldState.dataValues.province}` +
                `->${newState.dataValues.name}-${newState.dataValues.province}`;
            await logs.add(action);
            res.json(newState);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    delete = async (req, res, next) => {
        try {
            const id = req.params.stateId;
            const state = await StateModel.findByPk(id);
            await StateModel.destroy({
                where: {
                    id: id
                }
            });
            const action = `State ${state.dataValues.name}-${state.dataValues.province} deleted`;
            await logs.add(action);
            res.json({});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    _validateData = async (data, id) => {
        const attributes = ['name', 'province'];
        const state = {};

        for (const attribute of attributes) {

            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            state[attribute] = data[attribute];
        }
        if (await this._stateNameExists(state.name, id)) {
            throw new Error(`The state with name "${state.name}" already exists.`);
        }
        if (await this._stateProvinceExists(state.province, id)) {
            throw new Error(`The state with province "${state.province}" already exists.`);
        }
        return state;
    }
    _stateNameExists = async (name, id) => {
        const where = {
            name: name
        };

        if (id) {
            where.id = { [Op.ne]: id }; // WHERE id != id
        }

        const count = await StateModel.count({
            where: where
        });

        return count > 0;
    }
    _stateProvinceExists = async (province, id) => {
        const where = {
            province: province
        };

        if (id) {
            where.id = { [Op.ne]: id }; // WHERE id != id
        }

        const count = await StateModel.count({
            where: where
        });

        return count > 0;
    }
}

module.exports = new StateController();