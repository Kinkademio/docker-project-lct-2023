const boom = require('boom');
const {Fact, Event, School, User} = require('../models');
const types = [
    {
        model: Fact,
        user_field: "fact_views"
    },
    {
        model: Event,
        user_field: "event_views"
    },
    {
        model: School,
        user_field: "school_views"
    }
];
const customCrud = () => ({
    /**
     * Добавление записи
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async create(req, res) {
        try {
            let body = req.body;
            //id юзера
            let user_id = body.user_id;
            //массив всех событий
            let events_views = body.events;

            let user = await User.findById(user_id);

            
            Object.keys(events_views).forEach(async type => {

                if(!type in types){
                    return res.status(400).send({status: false, err: "Тип "+ type +" не существует!"});
                }

                //просмотры для одного события
                let event_views = events_views[type];

                    //Получение массива просмотров конкретного объекта в пользователе
                    let user_field = types[type].user_field;
                    let user_view = user[user_field]; 
                    if(user_view == null){
                        user_view = {};
                    }

                    event_views.forEach(async view => {

                        /********************************************************
                            Добавление просмотров в документ ПОЛЬЗОВАТЕЛЯ
                        *********************************************************/

                        if(user_view[view.entity_id] == undefined){
                            user_view[view.entity_id] = {views: []};
                        }
                        //Объединям информацию с замещением
                        user_view[view.entity_id] = Object.assign(user_view[view.entity_id], view.info);
                        //Если добавится просмотр, то записываем его в view
                        if(view.info.view_date !== undefined){
                            user_view[view.entity_id].views.push(view.info.view_date);
                        }
                         //Обновляем пользователя
                          await User.updateOne({_id: user_id}, {[user_field]:user_view});

                        /********************************************************
                            Добавление просмотров в документ СУЩЬНОСТИ
                        *********************************************************/
                        //Получение объекта
                        let entity = await types[type].model.findById(view.entity_id);
                        let entity_view = entity.views;
                        if(entity_view == null){
                            entity_view = {};
                        }
                        if(entity_view[user_id] == undefined){
                            entity_view[user_id] = {views: []};
                        }
                        entity_view[user_id]  =  Object.assign(entity_view[user_id], view.info);
                        if(view.info.view_date !== undefined){
                            entity_view[user_id].views.push(view.info.view_date);
                        } 
                         //Обновляем сущьность
                        await types[type].model.updateOne({_id: view.entity_id}, {views: entity_view});
                    });  
              });
              return res.status(200).send({status: true});
        } catch (err) {
            return res.status(400).send({status: false, err: boom.boomify(err)});
        }
    },
})

module.exports ={
   ...customCrud()
}

    