const { Op } = require('sequelize');
const FormatModel = require('../models/Format.js');
const logs = require('../logs.js');

class FormatController {

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

        res.json(await FormatModel.findAll({
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]]
        }));
    }
    show = async (req, res, next) => {
        const format = await FormatModel.findByPk(req.params.formatId);
        res.json(format);
    }
    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const format = await FormatModel.create(data);
            const action = `Format ${format.dataValues.description} created`;
            await logs.add(action);
            res.json(format);
        } catch (error) {

            res.status(400).json({ error: error.message });
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.formatId;
            const data = await this._validateData(req.body, id);
            const oldFormat = await FormatModel.findByPk(id);
            await FormatModel.update(data, {
                where: {
                    id: id
                }
            });
            const newFormat = await FormatModel.findByPk(id);
            const action = `Format ${oldFormat.dataValues.description}->${newFormat.dataValues.description}`;
            await logs.add(action);
            res.json(newFormat);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    delete = async (req, res, next) => {
        try {
            const id = req.params.formatId;
            const format = FormatModel.findByPk(id);
            await FormatModel.destroy({
                where: {
                    id: id
                }
            });
            const action = `Format ${format.dataValues.description} deleted`;
            await logs.add(action);
            res.json({});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    _validateData = async (data, id) => {
        const attributes = ['description'];
        const format = {};

        for (const attribute of attributes) {

            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            format[attribute] = data[attribute];
        }
        if (await this._formatExists(format.description, id)) {
            throw new Error(`The format with description "${format.description}" already exists.`);
        }
        return format;
    }
    _formatExists = async (description, id) => {
        const where = {
            description: description
        };

        if (id) {
            where.id = { [Op.ne]: id }; // WHERE id != id
        }

        const count = await FormatModel.count({
            where: where
        });

        return count > 0;
    }
}

module.exports = new FormatController();