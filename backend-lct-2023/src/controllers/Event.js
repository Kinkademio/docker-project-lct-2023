const boom = require('boom');
const { Event } = require('../models');
const {Direction} = require('../models');
const {ChildDirection} = require('../models');
const path = require('path');

const customCrud = () => ({
      /**
     * Получение одной записи по id
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
      async get({params: {id}}, res) {
        try {
            const item = await Event.findById(id)
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
            const items = await Event.find()
            return res.status(200).send(items)

        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    },
        /**
     * Получение одной записи по id
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
        async getD({ params: { id } }, res) {
            try {
                let item = await Event.findById(id);
               
                let dirs = item.dir;
                let newDirFormat = {};
    
                for (const dir of dirs){
                    let childDir = await ChildDirection.findById(dir);
                    let parentItem =  await Direction.findById(childDir.parent);
               
                    if(!newDirFormat[parentItem.name]) newDirFormat[parentItem.name] = [];
                    newDirFormat[parentItem.name].push({
                        id: childDir._id,
                        name: childDir.name,
                        color: parentItem.color
                    })
                }
                item.dir = newDirFormat; 
                return res.status(200).send(item);
            } catch (err) {
                return res.status(400).send({ status: false, err: boom.boomify(err)});
            }
        },
        /**
         * Получение всех записей
         * @param {*} req 
         * @param {*} res 
         * @returns 
         */
        async getAllD(req, res) {
            try {
                let items = await Event.find();
    
                for(const item of items){
    
                    let dirs = item.dir;
                    if(dirs == null){
                        continue;
                    }
                    let newDirFormat = {};
                    for(const dir of dirs){
                        let childDir = await ChildDirection.findById(dir);
                        let parentItem =  await Direction.findById(childDir.parent);
                        if(!newDirFormat[parentItem.name]) newDirFormat[parentItem.name] = [];
                        newDirFormat[parentItem.name].push({
                            id: childDir._id,
                            name: childDir.name,
                            color: parentItem.color
                        })
                    }
                    item.dir = newDirFormat;
                }
              
                return res.status(200).send(items);
    
            } catch (err) {
                return res.status(400).send({ status: false, err: boom.boomify(err)});
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
            let body = req.body;

            let newItem = await Event.findOne({'api_id': body.api_id})
            if(newItem){
                newItem = await Event.findOneAndUpdate({'api_id': body.api_id}, body)
            }else{
                const item = new Event(body)
                newItem = await item.save()
            }

            return res.status(200).send(newItem)


        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err)});
        }
    },
    /**
     * Обновление записи по id
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
    async update({ params: { id }, body }, res) {
        try {
            const item = await Event.findByIdAndUpdate(id, body, { new: true })
            return res.status(200).send(item)

        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    /**
     * Получение всех мероприятний по id организации
     * @param {*} req 
     * @param {*} res 
     */
    async getAllForOrganization({ params: {id}}, res) {
        try {
             //Инфдефектор организации
             let organization_id = id;
             let items = await Event.find({"organization_id": organization_id});
            return res.status(200).send(items)

        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    /**
     * Получение всех актуальных для организации
     * @param {*} req 
     * @param {*} res 
     */
    async getAllactualForOrganization({params: {id}}, res){
        try {
            //Инфдефектор организации
            let organization_id = id;
            let date = new Date();
            let currentDay = String(date.getDate()).padStart(2, '0');
            let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
            let currentYear = date.getFullYear();
            date = `${currentYear}-${currentMonth}-${currentDay}`

            let items = await Event.find({"organization_id": organization_id, "date_end": {$gt: date}});
           return res.status(200).send(items)

       } catch (err) {
           return res.status(400).send({ status: false, err: boom.boomify(err) });
       }

    },

    /**
     * Получение всех актуальных историй
     * @param {*} req 
     * @param {*} res 
     */
    async getAllActualEvents(req, res){
        try {
            let date = new Date();
            let currentDay = String(date.getDate()).padStart(2, '0');
            let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
            let currentYear = date.getFullYear();
            date = `${currentYear}-${currentMonth}-${currentDay}`
            const items = await Event.find({"date_end": {$gt: date}})
            return res.status(200).send(items)

        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    /**
     * Удаление записи
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
    async delete({ params: { id } }, res) {
        try {
            await Event.findByIdAndDelete(id)
            return res.status(200).send({ status: 'ok', massage: 'Удалено' })
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    async addDir(req, res){
        try {
            let id = req.body.id;
            let newDir = req.body.dir;

            let item = await Event.findById(id);

            if(item.dir.indexOf(newDir) == -1) 
            {
                let dir = item.dir;
                dir.push(newDir);
                Event.findByIdAndUpdate(id, {dir: dir});
            }
           
            return res.status(200).send({ status: 'ok', massage: 'Добавлен тег' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    async removeDir({ params: { id }, body }, res){
        try {
            let removeDir = body.dir;
            let item = await Event.findById(id);
            let index = item.dir.indexOf(removeDir);
            if(index != -1) 
            {
                let dir = item.dir.splice(index, 1);
                Event.findByIdAndUpdate(id, {dir: dir});
            }
            return res.status(200).send({ status: 'ok', massage: 'Тег удален' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    }

})

module.exports = {
    ...customCrud()
}

