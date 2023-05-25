const genericCrud = require('./GenericController')
const {Test} = require('../models');
module.exports ={
    ...genericCrud(Test),
    async addDir(req, res){
        try {
            let id = req.body.id;
            let newDir = req.body.dir;
            let item = Test.findById(id);
            let index = item.dir.indexOf(newDir);
            if(index != -1) 
            {
                let dir = item.dir.splice(index, 1);
                Test.findByIdAndUpdate(id, {dir: dir});
            }
            return res.status(200).send({ status: 'ok', massage: 'Добавлен тег' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    },
    async removeDir(req, res){
        try {
            let id = req.body.id;
            let delDir = req.body.dir;
            let item = Test.findById(id);

            if(item.dir.indexOf(delDir) == -1) 
            {
                let dir = item.dir;
                dir.push(delDir);
                Test.findByIdAndUpdate(id, {dir: dir});
            }
            return res.status(200).send({ status: 'ok', massage: 'Тег удален' });
        } catch (err) {
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
    }
}