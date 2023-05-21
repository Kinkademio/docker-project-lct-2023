<template>
  <div>
    <q-spinner-ball v-if="!loaded" class="fixed-center" size="5rem" color="white" :thickness="3" />
    <div v-if="loaded && !error">
      <div class="row">
        <div class="col-3">
          <q-input style="padding-bottom: 0px" bottom-slots borderless v-model="text" label="Поиск">
            <template v-slot:prepend>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-2">
          <q-select borderless v-model="this.searchSelected" :options="getSearchParamsArray" />
        </div>
        <div class="col-1 q-mt-sm">
          <q-btn flat icon="add" @click="icon = true">
            <q-dialog v-model="icon">
              <q-card class="bg-white text-black add-fact">
                <q-bar>
                  <q-space />
                  <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip class="bg-white text-primary">Закрыть</q-tooltip>
                  </q-btn>
                </q-bar>

                <q-card-section>
                  <div class="text-h6">Добавление нового факта</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input v-model="newAuthor" label="О ком" />
                  <q-input v-model="newFactFooter" label="Авторсоке право на используемое изображение" />
                  <q-input v-model="newFactName" label="Название" />
                  <q-input v-model="newFactText" label="Текст" />
                  <q-input v-model="newImgUrl" label="Ссылка на изображение" />
                  <q-btn flat style="width: 100%;  background-color: rgba(7, 7, 7, 0.050);"
                    @click="addNewFacts()">Принять</q-btn>
                </q-card-section>
              </q-card>
            </q-dialog></q-btn>
        </div>
      </div>
      <q-separator></q-separator>

      <q-table flat borderless separator="cell" :rows="getRows" :columns="columns" row-key="name"
        no-data-label="Ничего не найдено">
        <template v-slot:header-cell="props">
          <q-th :props="props">
            <q-icon v-if="props.col.canEdit" name="lock_open" size="1.5em"></q-icon>
            <q-icon v-else-if="props.col.canEdit != null" name="lock" size="1.5em"></q-icon>
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="author" :props="props">
              <div>{{ getShortText(props.row.author) }}</div>
              <q-popup-edit v-model="props.row.author" @hide="changeAuthor(props.row._id, props.row.author)">
                <q-input type="textarea" v-model="props.row.author" label="Новое имя автора"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="fact_footer" :props="props">
              <div>{{ getShortText(props.row.fact_footer) }}</div>
              <q-popup-edit v-model="props.row.fact_footer" @hide="changeFooter(props.row._id, props.row.fact_footer)">
                <q-input type="textarea" v-model="props.row.fact_footer" label="Новое подпись картины"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="fact_name" :props="props">
              <div>{{ getShortText(props.row.fact_name) }}</div>
              <q-popup-edit v-model="props.row.fact_name" @hide="changeName(props.row._id, props.row.fact_name)">
                <q-input type="textarea" v-model="props.row.fact_name" label="Новое название картины"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="fact_text" :props="props">
              <div>{{ getShortText(props.row.fact_text) }}</div>
              <q-popup-edit v-model="props.row.fact_text" @hide="changeDescription(props.row._id, props.row.fact_text)">
                <q-input type="textarea" v-model="props.row.fact_text" label="Новое описание картины"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="image_url" :props="props">
              <q-btn v-if="props.row.image_url" :href="props.row.image_url" target="_blank" flat dense
                :color="'grey-8'"><q-icon name="link" />
                <q-tooltip>Перейти по ссылке</q-tooltip></q-btn>
              {{ getShortText(props.row.image_url) }}
              <q-popup-edit v-model="props.row.image_url" @hide="changeUrl(props.row._id, props.row.image_url)">
                <q-input type="textarea" v-model="props.row.image_url" label="Новая фотография картины"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="views" :props="props">
              {{ props.row.viewCount}}
            </q-td>

            <q-td key="like" :props="props">
              {{ props.row.likeCount }}
            </q-td>

            <q-td key="control">
              <q-btn @click="removeFacts(props.row._id)" flat dense :color="'grey-8'"><q-icon name="delete_forever" />
                <q-tooltip>Удалить</q-tooltip></q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="text-center" v-if="error == 403">
      <div class="text-h4" style="opacity: 0.5">У вас нет прав</div>
      <img class="image" src="../resources/Уваснедостаточноправv2.svg" />
    </div>
  </div>
</template>

<script>
import { api } from "../boot/axios";
import { ref } from "vue";
import VueCookies from "vue-cookies";
export default {

  data() {
    return {
      icon: ref(false),
      newPass: "",
      text: "",
      roles: [],
      searchSelected: "",
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      columns: [
        {
          name: "author",
          label: "О ком",
          align: "left",
          field: "author",
          canEdit: true,
          sortable: true,
        },
        {
          name: "fact_footer",
          align: "left",
          label: "Авторское право на используемое изображение",
          field: "fact_footer",
          canEdit: true,
          sortable: true,
        },
        {
          name: "fact_name",
          align: "left",
          label: "Название",
          field: "fact_name",
          canEdit: true,
          sortable: true,
        },
        {
          name: "fact_text",
          align: "left",
          label: "Тест",
          field: "fact_text",
          canEdit: true,
          sortable: true,
        },
        {
          name: "image_url",
          align: "left",
          label: "Ссылка на изображение",
          field: "image_url",
          canEdit: true,
          sortable: true,
        },
        {
          name: "views",
          align: "left",
          label: "Просмотры",
          field: "viewCount",
          canEdit: false,
          sortable: true,
        },
        {
          name: "like",
          align: "left",
          label: "Лайки",
          field: "likeCount",
          canEdit: false,
          sortable: true,
        },
        {
          name: "control",
          align: "left",
          label: "Управление",
        },
      ],
      rows: [],
      error: 0,
      loaded: false,
      newAuthor: "",
      newFactFooter: "",
      newFactName: "",
      newFactText: "",
      newImgUrl: "",
    };
  },
  mounted() {
    this.getFacts();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    /**
     * Сокращение длинного теста при выводе в таблицу
     * @param {*} descr
     * @param {*} maxLength
     */
    getShortText(descr, maxLength = 50) {
      if (descr && descr.length > maxLength) {
        return descr.substring(0, maxLength) + "...";
      }
      return descr;
    },
    /**
     * Получить все факты из бд
     */
    async getFacts() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/fact", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        res.data.forEach(el=>{
          let likeCount = 0;
          if(el.views != null){
            Object.values(el.views).forEach(v=>{
            if(v.like) likeCount++;
          })
          }
          el['likeCount'] = likeCount;
          el['viewCount'] = el.views ? Object.values(el.views).length : 0;
        })
        this.rows = res.data;
        this.loaded = true;
      } catch (error) {
        this.onError(error);
      }
    },
    /**
     * Обработка ошибок апи
     * @param {*} error
     */
    onError(error) {
      this.loaded = true;
      if (!error.response || !error.response.status) {
        this.$q.notify({
          type: "negative",
          message: "Нет соединения с сервером",
        });
        return;
      }
      this.error = error.response.status;
      if (this.error != 403) {
        this.$q.notify({
          type: "negative",
          message: error.response.data.message ?? "Ошибка сервера",
        });
      }
    },
    /**
     * Удаелине факта
     * @param {*} facts_id
     */
    async removeFacts(facts_id) {
      try {
        const res = await api.delete("api/fact/" + facts_id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.loaded = true;

        this.$q.notify({
          type: "positive",
          message: "Факт удален",
        });
        this.getFacts();
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение автора факта
     * @param {*} id
     * @param {*} name
     */
    async changeAuthor(id, name) {
      try {
        await api.put(
          "api/fact/" + id,
          {
            author: name,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          }
        );
        this.$q.notify({
          type: "positive",
          message: "Автор сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение копирайта на изображение
     * @param {*} id
     * @param {*} footer
     */
    async changeFooter(id, footer) {
      try {
        await api.put(
          "api/fact/" + id,
          {
            fact_footer: footer,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          }
        );
        this.$q.notify({
          type: "positive",
          message: "Автор сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение названия (заголовка) факта
     * @param {*} id
     * @param {*} name
     */
    async changeName(id, name) {
      try {
        await api.put(
          "api/fact/" + id,
          {
            fact_name: name,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          }
        );
        this.$q.notify({
          type: "positive",
          message: "Автор сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение описание факта
     * @param {*} id
     * @param {*} desc
     */
    async changeDescription(id, desc) {
      try {
        await api.put(
          "api/fact/" + id,
          {
            fact_text: desc,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          }
        );
        this.$q.notify({
          type: "positive",
          message: "Автор сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение ссылки на изображение факта
     * @param {*} id
     * @param {*} url
     */
    async changeUrl(id, url) {
      try {
        await api.put(
          "api/fact/" + id,
          {
            image_url: url,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          }
        );
        this.$q.notify({
          type: "positive",
          message: "Автор сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    async addNewFacts() {
      try {
        const response = await api.post(
          "api/fact",
          {
            author: this.newAuthor,
            fact_footer: this.newFactFooter,
            fact_name: this.newFactName,
            fact_text: this.newFactText,
            image_url: this.newImgUrl,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          }
        );
        this.$q.notify({
          type: "positive",
          message: "Новый факт успешно добавлен.",
        });
        this.icon = false;
        this.getFacts();
        this.newAuthor = "";
        this.newFactName = "";
        this.newFactText = "";
        this.newImgUrl = "";
      } catch (error) {
        this.onError(error);
      }
    },
  },
  computed: {
    /**
     * Получение критериев фильтрации поиска
     */
    getSearchParamsArray() {
      let result = [];
      this.columns.forEach((element) => {
        if (element.field) {
          result.push(element.label);
        }
      });
      return result;
    },
    /**
     * Поиск по выбранному критерию
     */
     getRows() {
      if (this.text !== "") {
        let text = this.text;
        let result = [];
        let searchFiled;

        //Определяем по какому полю будм искать
        this.columns.forEach((element) => {
          if (element.label == this.searchSelected) {
            searchFiled = element.field;
          }
        });

        let searchFields = searchFiled.split('.');
        this.rows.map(function (r) {
          let object = r[searchFields[0]];
          for(let index = 1; index<searchFields.length; index ++){
            object = object[searchFields[index]];
          }

          if (typeof object == "object") {
            object.forEach((elem) => {
              if (elem.toString().toLowerCase().includes(text.toString().toLowerCase())) {
                result.push(r);
              }
            });
          }
          else{
            if (object.toString().toLowerCase().includes(text.toString().toLowerCase())) {
              result.push(r);
            }
          }

        });
        return result;
      }
      return this.rows;
    },
  },
};
</script>
<style scoped>
.image {
  height: 60%;
  width: 60%;
}

.add-fact {
  width: 700px;
}
</style>
