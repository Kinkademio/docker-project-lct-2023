<template>
  <div>
    <q-spinner-ball
      v-if="!loaded"
      class="fixed-center"
      size="5rem"
      color="white"
      :thickness="3"
    />
    <div v-if="loaded && !error">
      <div class="row">
        <div class="col-3">
          <q-input
            style="padding-bottom: 0px"
            bottom-slots
            borderless
            v-model="textSearch"
            label="Поиск"
          >
            <template v-slot:prepend>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-2">
          <q-select
            borderless
            v-model="this.searchSelected"
            :options="getSearchParamsArray"
          />
        </div>
        <div class="col-1 q-mt-sm">
          <q-btn flat icon="add" @click="icon = true">
            <q-dialog v-model="icon">
              <q-card class="bg-white text-black add-fact">
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Добавления новой новости</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input v-model="newTitle" label="Заголовок" />
                  <q-input v-model="newText" label="Текст" />
                  <q-input v-model="newImgUrl" label="Ссылка на изображение" />
                  <q-btn
                    class="q-mt-md"
                    flat
                    style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                    @click="addNewNews()"
                    >Добавить</q-btn
                  >
                </q-card-section>
              </q-card>
            </q-dialog></q-btn
          >
        </div>
      </div>
      <q-separator></q-separator>

      <q-table
        flat
        borderless
        separator="cell"
        :rows="getRows"
        :columns="columns"
        row-key="name"
        no-data-label="Ничего не найдено"
      >
        <template v-slot:header-cell="props">
          <q-th :props="props">
            <q-icon
              v-if="props.col.canEdit"
              name="lock_open"
              size="1.5em"
            ></q-icon>
            <q-icon
              v-else-if="props.col.canEdit != null"
              name="lock"
              size="1.5em"
            ></q-icon>
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="title" :props="props">
              <div>{{ getShortText(props.row.title) }}</div>
              <q-popup-edit
                v-model="props.row.title"
                @hide="changeTitle(props.row._id, props.row.title)"
              >
                <q-input v-model="props.row.title" label="Заголовок"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="text" :props="props">
              <div>{{ getShortText(props.row.text) }}</div>
              <q-popup-edit
                v-model="props.row.text"
                @hide="changeDescription(props.row._id, props.row.text)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.text"
                  label="Текст"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="image_url" :props="props">
              <q-btn
                v-if="props.row.image_url"
                :href="props.row.image_url"
                target="_blank"
                flat
                dense
                :color="'grey-8'"
                ><q-icon name="link" />
                <q-tooltip>Перейти по ссылке</q-tooltip></q-btn
              >
              {{ getShortText(props.row.image_url) }}
              <q-btn flat dense :color="'grey-8'">
                <q-icon name="upload" />
                <q-popup-edit>
                  <q-input
                    @update:model-value="
                      ((val) => {
                        file = val[0];
                      },
                      uploadFile(props.row._id))
                    "
                    filled
                    type="file"
                  ></q-input>
                </q-popup-edit>
                <q-tooltip>Загрузить новове изображение</q-tooltip>
              </q-btn>
              <q-popup-edit
                v-model="props.row.image_url"
                @hide="changeUrl(props.row._id, props.row.image_url)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.image_url"
                  label="Ссылка на изображение"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="views" :props="props">
              {{ props.row.viewCount }}
            </q-td>

            <q-td key="like" :props="props">
              {{ props.row.likeCount }}
            </q-td>

            <q-td key="control">
              <q-btn
                @click="(confirm = true), (deleteRowId = props.row._id)"
                flat
                dense
                :color="'grey-8'"
                ><q-icon name="delete_forever" />
                <q-tooltip>Удалить</q-tooltip></q-btn
              >
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="text-center" v-if="error == 403">
      <div class="text-h4" style="opacity: 0.5">У вас нет прав</div>
      <img class="image" src="../resources/Уваснедостаточноправv2.svg" />
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Вы точно хотите удалить запись?</span>
        </q-card-section>

        <q-card-actions align="between">
          <q-btn flat label="Отмена" color="primary" v-close-popup></q-btn>
          <q-btn
            flat
            label="Удалить"
            @click="removeNews(deleteRowId)"
            color="primary"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { api } from "../boot/axios";
import { ref } from "vue";
import VueCookies from "vue-cookies";
export default {
  data() {
    return {
      file: ref(null),
      deleteRowId: -1,
      icon: ref(false),
      newPass: "",
      textSearch: "",
      confirm: ref(false),
      searchSelected: "",
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      columns: [
        {
          name: "title",
          label: "Заголовок",
          align: "left",
          field: "title",
          canEdit: true,
          sortable: true,
        },
        {
          name: "text",
          align: "left",
          label: "Текст",
          field: "text",
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
      ],
      rows: [],
      error: 0,
      loaded: false,
      newTitle: "",
      newText: "",
      newImgUrl: "",
    };
  },
  mounted() {
    this.getNews();
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
    async uploadFile(prop) {
      let formData = new FormData();
      formData.append("file", this.file);
      try {
        const res = await api.post(
          "api/uploads",
          {
            formData,
          },
          {
            headers: {
              Authorization: "Basic " + btoa(this.auth),
              "x-requested-with": "*",
            },
          }
        );
        this.rows.forEach((el) => {
          if (el._id == prop) {
            el.image_url = res.data;
          }
        });
      } catch (error) {
        this.onError(error);
      }
    },
    /**
     * Получить все факты из бд
     */
    async getNews() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/news", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        res.data.forEach((el) => {
          let likeCount = 0;
          if (el.views != null) {
            Object.values(el.views).forEach((v) => {
              if (v.like) likeCount++;
            });
          }
          el["likeCount"] = likeCount;
          el["viewCount"] = el.views ? Object.values(el.views).length : 0;
        });
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
    async removeNews(facts_id) {
      try {
        const res = await api.delete("api/news/" + facts_id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.loaded = true;

        this.$q.notify({
          type: "positive",
          message: "Новость удалена",
        });
        this.getNews();
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение названия (заголовка) факта
     * @param {*} id
     * @param {*} title
     */
    async changeTitle(id, title) {
      try {
        await api.put(
          "api/news/" + id,
          {
            title: title,
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
          message: "Заголовок сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение описание факта
     * @param {*} id
     * @param {*} text
     */
    async changeDescription(id, text) {
      try {
        await api.put(
          "api/news/" + id,
          {
            text: text,
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
          message: "Текст сохранен",
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
          "api/news/" + id,
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
          message: "Ссылка сохранена",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    async addNewNews() {
      try {
        const response = await api.post(
          "api/news",
          {
            title: this.newTitle,
            text: this.newText,
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
          message: "Новость успешно добавлена.",
        });
        this.icon = false;
        this.getNews();
        this.newTitle = "";
        this.newText = "";
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

        let searchFields = searchFiled.split(".");
        this.rows.map(function (r) {
          let object = r[searchFields[0]];
          for (let index = 1; index < searchFields.length; index++) {
            object = object[searchFields[index]];
          }

          if (typeof object == "object") {
            object.forEach((elem) => {
              if (
                elem
                  .toString()
                  .toLowerCase()
                  .includes(text.toString().toLowerCase())
              ) {
                result.push(r);
              }
            });
          } else {
            if (
              object
                .toString()
                .toLowerCase()
                .includes(text.toString().toLowerCase())
            ) {
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
  height: 30%;
  width: 30%;
}

.add-fact {
  width: 700px;
}
</style>
