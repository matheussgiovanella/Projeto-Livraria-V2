const { Op } = require('sequelize');
const LogModel = require('../models/Log.js');

class LogController {

    index = async (req, res, next) => {
        const params = req.query;
        const limit = params.limit || 100;
        const page = params.page || 1;
        const offset = (page - 1) * limit;
        const sort = params.sort || 'id';
        const order = params.order || 'ASC';
        const where = {};

        res.json(await LogModel.findAll({
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]]
        }));
    }
    show = async (req, res, next) => {
        const log = await LogModel.findByPk(req.params.logId);
        res.json(log);
    }
    create = async (newLog) => {
        try {
            const log = await LogModel.create(newLog);
            res.json(log);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new LogController();