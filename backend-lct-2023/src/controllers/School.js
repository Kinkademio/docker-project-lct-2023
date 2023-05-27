const genericCrud = require('./GenericController')
const {Direction} = require('../models');
const {ChildDirection} = require('../models');
const {School} = require('../models');
module.exports ={
      /**
     * Получение одной записи по id
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
      async get({params: {id}}, res) {
        try {
            const item = await School.findById(id)
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
            const items = await School.find()
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
                let item = await School.findById(id);
               
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
                let items = await School.find();
    
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

            const item = new School(req.body)
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
            const item = await School.findByIdAndUpdate(id, body, {new: true})
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
            await School.findByIdAndDelete(id)
            return res.status(200).send({status: 'ok', massage: 'Удалено'})
        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    },
    async addDir(req, res){
        try {
            let id = req.body.id;
            let newDir = req.body.dir;

            let item = await School.findById(id);

            if(item.dir.indexOf(newDir) == -1) 
            {
                let dir = item.dir;
                dir.push(newDir);
                await School.findByIdAndUpdate(id, {dir: dir});
            }
           
            return res.status(200).send({ status: 'ok', massage: 'Добавлен тег' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    async removeDir(req, res){
        try {
            let id= req.body.id;
            let removeDir = req.body.dir;
            let item = await School.findById(id);
            let index = item.dir.indexOf(removeDir);
            if(index != -1) 
            {
                item.dir.splice(index, 1);
                await School.findByIdAndUpdate(id, {dir: item.dir});
            }
            return res.status(200).send({ status: 'ok', massage: 'Тег удален' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    }
}