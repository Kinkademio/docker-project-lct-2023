const boom = require('boom');
const { Fact } = require('../models');
const {Direction} = require('../models');
const path = require('path');

const customCrud = () => ({
    /**
     * Получение одной записи по id
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
    async get({ params: { id } }, res) {
        try {
            let item = await Fact.findById(id);
           
            let dirs = item.dir;
            let newDirFormat = {};

            for (const dir of dirs){
                let parentItem =  await Direction.findById(dir);
                if(!newDirFormat[parentItem.name]) newDirFormat[parentItem.name] = [];
                newDirFormat[parentItem.name].push({
                    name: dir.name,
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
    async getAll(req, res) {
        try {
            let items = await Fact.find();

            for(const item of items){

                let dirs = item.dir;
                if(dirs == null){
                    continue;
                }
                let newDirFormat = {};
                for(const dir of dirs){
                    let parentItem =  await Direction.findById(dir);
                    if(!newDirFormat[parentItem.name]) newDirFormat[parentItem.name] = [];
                    newDirFormat[parentItem.name].push({
                        name: dir.name,
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
     * Получение всех не просмотренных юзеро фактов
     * @param {*} param0 
     * @param {*} res 
     * @returns 
     */
    async getAllActualForUser({ params: { id } }, res) {
        try {
            const items = await Fact.find({ ["views." + id]: { $exists: false } });
            return res.status(200).send(items);

        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
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
            let file_url = '';
            if (!body.image_url) {

                //Если есть файл, то подгружаем его в uploads
                if (req.files) {
                    let uploaded_file = req.files.file;
                    //генерируем случайное имя для файла
                    let server_file_name = (Date.now()).toString() + path.extname(uploaded_file.name);
                    file_url = '/uploads/' + server_file_name;
                    uploaded_file.mv(ROOT + file_url);
                    file_url = SERVER_URL + file_url;
                }
            }
            else {
                file_url = body.image_url;

            }
            //Формируем объект для занесения в базу
            let object = {
                author: body.author ?? '',
                fact_name: body.fact_name ?? '',    
                fact_text: body.fact_text ?? '',
                fact_footer: body.fact_footer ?? '',
                image_url: file_url
            }

            //Сохраняем объект в базу
            const item = new Fact(object);
            const newItem = await item.save();
            return res.status(200).send(newItem);

        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
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
            const item = await Fact.findByIdAndUpdate(id, body, { new: true });
            return res.status(200).send(item);

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
            await Fact.findByIdAndDelete(id);
            return res.status(200).send({ status: 'ok', massage: 'Удалено' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    async addDir(req, res){
        try {
            let id = req.body.id;
            let delDir = req.body.dir;
            let item = Fact.findById(id);

            if(item.dir.indexOf(delDir) == -1) 
            {
                let dir = item.dir;
                dir.push(delDir);
                Fact.findByIdAndUpdate(id, {dir: dir});
            }
           
            return res.status(200).send({ status: 'ok', massage: 'Добавлен тег' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    async removeDir(req, res){
        try {
            let id = req.body.id;
            let newDir = req.body.dir;
            let item = Fact.findById(id);
            let index = item.dir.indexOf(newDir);
            if(index != -1) 
            {
                let dir = item.dir.splice(index, 1);
                Fact.findByIdAndUpdate(id, {dir: dir});
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

