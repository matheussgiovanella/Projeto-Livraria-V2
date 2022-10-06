const { Op } = require('sequelize');
const City = require('../models/City.js');
const PublisherModel = require('../models/Publisher.js');
const State = require('../models/State.js');
const logs = require('../logs.js');

class PublisherController {

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

        res.json(await PublisherModel.findAll({
            include: {
                model: City,
                include: {
                    model: State
                }
            },
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]]
        }));
    }
    show = async (req, res, next) => {
        const publisher = await PublisherModel.findByPk(req.params.publisherId, {
            include: {
                model: City
            }
        });
        res.json(publisher);
    }
    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const publisher = await PublisherModel.create(data);
            //const city = await City.findByPk(publisher.dataValues.city_id);
            //const state = await State.findByPk(city.dataValues.state_id);
            const action = `Publisher ${publisher.dataValues.name} created`;
            await logs.add(action);
            res.json(publisher);
        } catch (error) {

            res.status(400).json({ error: error.message });
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.publisherId;
            const data = await this._validateData(req.body, id);
            const oldPublisher = await PublisherModel.findByPk(id);
            //const oldCity = await City.findByPk(oldPublisher.dataValues.city_id);
            //const oldState = await State.findByPk(oldCity.dataValues.state_id);
            await PublisherModel.update(data, {
                where: {
                    id: id
                }
            });
            const newPublisher = await PublisherModel.findByPk(id);
            //const newCity = await City.findByPk(newPublisher.dataValues.city_id);
            //const newState = await State.findByPk(newCity.dataValues.state_id);
            const action = `Publisher ${oldPublisher.dataValues.name}->${newPublisher.dataValues.name}`;
            await logs.add(action);
            res.json(newPublisher);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    delete = async (req, res, next) => {
        try {
            const id = req.params.publisherId;
            const publisher = await PublisherModel.findByPk(id);
            await PublisherModel.destroy({
                where: {
                    id: id
                }
            });
            const action = `Publisher ${publisher.dataValues.name} deleted`;
            await logs.add(action);
            res.json({});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    _validateData = async (data, id) => {
        const attributes = ['name', 'city_id'];
        const publisher = {};

        for (const attribute of attributes) {

            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            publisher[attribute] = data[attribute];
        }
        if (await this._publisherExists(publisher.name, id)) {
            throw new Error(`The publisher with name "${publisher.name}" already exists.`);
        }
        return publisher;
    }
    _publisherExists = async (name, id) => {
        const where = {
            name: name
        };

        if (id) {
            where.id = { [Op.ne]: id }; // WHERE id != id
        }

        const count = await PublisherModel.count({
            where: where
        });

        return count > 0;
    }
}

module.exports = new PublisherController();