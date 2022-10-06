const { Op } = require('sequelize');
const BookModel = require('../models/Books.js');
const Category = require('../models/Categories.js');
const Publisher = require('../models/Publisher.js');
const Format = require('../models/Format.js');
const logs = require('../logs.js');

class BookController {

    index = async (req, res, next) => {
        const params = req.query;
        const limit = params.limit || 100;
        const page = params.page || 1;
        const offset = (page - 1) * limit;
        const where = {};

        let sort = params.sort || 'id';
        let order = params.order || 'ASC';

        sort = sort.split('-');
        order = order.split('-');

        let sortOrder = [];

        for (let i = 0; i < sort.length; i++) {
            if (sort[i] != '' && order[i] != '') {
                sortOrder.push([sort[i], order[i]]);
            }
        }

        console.log(sortOrder)

        if (params.title) {
            where.title = {
                [Op.iLike]: `${params.title}%`
            }
        }
        if (params.category) {
            if (params.category != 0) {
                where.category_id = params.category
            }
        }

        res.json(await BookModel.findAll({
            include: [
                { model: Category },
                { model: Publisher },
                { model: Format }
            ],
            where: where,
            limit: limit,
            offset: offset,
            order: sortOrder
        }));
    }
    show = async (req, res, next) => {
        const book = await BookModel.findByPk(req.params.bookId, {
            include: [
                { model: Category },
                { model: Publisher },
                { model: Format }
            ],
        });
        res.json(book);
    }
    create = async (req, res, next) => {
        try {
            const data = await this._validateData(req.body);
            const book = await BookModel.create(data);
            const action = `Book ${book.dataValues.title} created`;
            await logs.add(action);
            res.json(book);
        } catch (error) {

            res.status(400).json({ error: error.message });
        }
    }
    update = async (req, res, next) => {
        try {
            const id = req.params.bookId;
            const data = await this._validateData(req.body, id);
            const oldBook = await BookModel.findByPk(id);
            await BookModel.update(data, {
                where: {
                    id: id
                }
            });
            const newBook = await BookModel.findByPk(id);
            const action = `Book ${oldBook.dataValues.title}->${newBook.dataValues.title}`;
            await logs.add(action);
            res.json(newBook);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    delete = async (req, res, next) => {
        try {
            const id = req.params.bookId;
            const book = await BookModel.findByPk(id);
            await BookModel.destroy({
                where: {
                    id: id
                }
            });
            const action = `Book ${book.dataValues.title} deleted`;
            await logs.add(action);
            res.json({});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    _validateData = async (data, id) => {
        const attributes = ['title', 'author', 'publication_year', 'pages', 'value', 'category_id', 'publisher_id', 'format_id'];
        const book = {};

        for (const attribute of attributes) {

            if (!data[attribute]) {
                throw new Error(`The attribute "${attribute}" is required.`);
            }
            book[attribute] = data[attribute];
            if (await this._negativeValue(book.value)) {
                throw new Error(`Value cannot be negative!`);
            }
        }
        return book;
    }
    _negativeValue = async (value) => {
        if (value < 0) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = new BookController();