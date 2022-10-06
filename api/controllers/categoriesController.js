const { Op } = require('sequelize');
const CategoryModel = require('../models/Categories.js');
const logs = require('../logs.js');

class CategoryController {

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

        res.json(await CategoryModel.findAll({
            where: where,
            limit: limit,
            offset: offset,
            order: [[sort, order]]
        }));
    }
    show = async (req, res, next) => {
        const category = await CategoryModel.findByPk(req.params.categoryId);
        res.json(category);
    }
    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const category = await CategoryModel.create(data);
            const action = `Category ${category.dataValues.description} created`;
            await logs.add(action);
            res.json(category);
        } catch (error) {

            res.status(400).json({ error: error.message });
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.categoryId;
            const data = await this._validateData(req.body, id);
            const oldCategory = await CategoryModel.findByPk(id);
            await CategoryModel.update(data, {
                where: {
                    id: id
                }
            });
            const newCategory = await CategoryModel.findByPk(id);
            const action = `Category ${oldCategory.dataValues.description}->${newCategory.dataValues.description}`;
            await logs.add(action);
            res.json(newCategory);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    delete = async (req, res, next) => {
        try {
            const id = req.params.categoryId;
            const category = CategoryModel.findByPk(id);
            await CategoryModel.destroy({
                where: {
                    id: id
                }
            });
            const action = `Category ${category.dataValues.description} deleted`;
            await logs.add(action);
            res.json({});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    _validateData = async (data, id) => {
        const attributes = ['description'];
        const category = {};

        for (const attribute of attributes) {

            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            category[attribute] = data[attribute];
        }
        if (await this._categoryExists(category.description, id)) {
            throw new Error(`The category with description "${category.description}" already exists.`);
        }
        return category;
    }
    _categoryExists = async (description, id) => {
        const where = {
            description: description
        };

        if (id) {
            where.id = { [Op.ne]: id }; // WHERE id != id
        }

        const count = await CategoryModel.count({
            where: where
        });

        return count > 0;
    }
}

module.exports = new CategoryController();