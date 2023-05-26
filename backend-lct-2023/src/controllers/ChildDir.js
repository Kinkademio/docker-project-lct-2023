const genericCrud = require('./GenericController')
const {ChildDirection} = require('../models');
const {Direction} = require('../models');
const boom = require('boom');
module.exports ={
     /**
     * Получение одной записи по id
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
     async get({params: {id}}, res) {
        try {
            let item = await ChildDirection.findById(id);
            let color = await Direction.findById(item.parent);
            item.color = color.color;
            return res.status(200).send(item)

        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    },
    /**
     * Получение всех записей
     * @param {*} _ 
     * @param {*} res 
     * @returns 
     */
    async getAll(_, res) {
        try {
            let items = await ChildDirection.find();
            for(const item of items){
                let color = await Direction.findById(item.parent);
                item.color = color.color;
            }
            return res.status(200).send(items)
        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    },
    /**
     * Добавление записи
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async create(req, res) {
        try {

            const item = new ChildDirection(req.body)
            const newItem = await item.save()
            return res.status(200).send(newItem)

        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    },
    /**
     * Обновление записи
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
    async update({params: {id}, body}, res) {
        try {
            const item = await ChildDirection.findByIdAndUpdate(id, body, {new: true})
            return res.status(200).send(item)

        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    },
    /**
     * Удаление записи
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
    async delete({params: {id}}, res) {
        try {
            await ChildDirection.findByIdAndDelete(id)
            return res.status(200).send({status: 'ok', massage: 'Удалено'})
        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    }
}