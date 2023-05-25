const nodemailer = require("nodemailer");
const boom = require("boom");

const serverName = "@yandex.ru";
const systemMail = "Tech.ArtEducation-official";
const systemMailPass ="qigmzjgmvrxbhuhm";

const genericCrud = () => ({
    async send({body}, res) {
        try {
            const {email, subject, message} = body
            //Тут должна быть валидация значений

            let transporter = nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: systemMail+serverName,
                    pass: systemMailPass,
                },
            });
            let sub = "Сообщение в техническую поддержку";
            //Формируем сообщение
            let msg = "<b>От:</b>  "+ email+"<br><br><b>Тема:</b>  "+subject+ "<br><br><b>Сообщение:</b>  "+message;

            let info = await transporter.sendMail({
                from: systemMail+serverName,
                to: systemMail+serverName,
                subject: sub,
                text: message,
                html: msg,
            });
            if (info) {
                return res.status(200).send(true)
            } else {
                return res.status(400).send(false)
            }
        } catch (err) {
            return res.status(400).send({status: 'false', massage: boom.boomify(err)})
        }
    }
})
module.exports ={
    ...genericCrud(),
}