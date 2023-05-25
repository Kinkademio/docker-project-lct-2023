const fs = require('fs');
const path = require('path');
const mime = require('mime-types')
const boom = require('boom')

const customCrud = () => ({
    /**
     * Получение файлов из папки uploads
     * @param {*} req 
     * @param {*} res 
     */
    async get(req, res) {
        let url = req.url;
        let contentType = mime.contentType(path.extname(url));
        let file_path = path.join(ROOT + '/uploads/' + url);
        fs.readFile(file_path, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.write('file not found' + req.url + file_path);
                res.end();
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Content-Length': content.length
                });
                res.write(content);
                res.end();
            }
        })
    },
    /**
     * Запись указанного файла на сервер
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async create(req, res){
        try{
            if (req.files) {
                let uploaded_file = req.files.file;
                //генерируем случайное имя для файла
                let server_file_name = (Date.now()).toString() + path.extname(uploaded_file.name);
                file_url = '/uploads/' + server_file_name;
                uploaded_file.mv(ROOT + file_url);
                file_url = SERVER_URL + file_url;
            }
            return res.status(200).send(file_url);
        }catch (err){
            return res.status(400).send({ status: false, err: boom.boomify(err) });
        }
       
    },
});
module.exports = {
    ...customCrud()
}

