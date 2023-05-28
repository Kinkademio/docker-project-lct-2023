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
            v-model="text"
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
                  <div class="text-h6">Добавления нового мероприятия</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input v-model="newName" label="Название" />

                  <q-input v-model="newDateStart" label="Дата начала">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="newDateStart"
                            mask="DD.MM.YYYY, HH:mm:ss"
                            minimal
                            first-day-of-week="1"
                            :locale="localeCalend"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Закрыть"
                                color="primary"
                                flat
                              ></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>

                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="newDateStart"
                            mask="DD.MM.YYYY, HH:mm:ss"
                            format24h
                            first-day-of-week="1"
                            :locale="localeCalend"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Закрыть"
                                color="primary"
                                flat
                              ></q-btn>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-input v-model="newDateEnd" label="Дата окончания">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="newDateEnd"
                            mask="DD.MM.YYYY, HH:mm:ss"
                            minimal
                            first-day-of-week="1"
                            :locale="localeCalend"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Закрыть"
                                color="primary"
                                flat
                              ></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>

                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="newDateEnd"
                            mask="DD.MM.YYYY, HH:mm:ss"
                            format24h
                            first-day-of-week="1"
                            :locale="localeCalend"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Закрыть"
                                color="primary"
                                flat
                              ></q-btn>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-checkbox
                    v-model="newIsFree"
                    label="Бесплатное"
                    style="opacity: 60%"
                  />
                  <q-input v-model="newOrganizName" label="Организатор" />
                  <q-input v-model="newUrl" label="Адрес сайта" />
                  <q-btn
                    class="q-mt-md"
                    flat
                    style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                    @click="addNewEvent()"
                    >Добавить</q-btn
                  >
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-btn>
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
            <q-td key="name" :props="props">
              <div>{{ getShortText(props.row.name) }}</div>
              <q-popup-edit
                v-model="props.row.name"
                @hide="changeName(props.row._id, props.row.name)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.name"
                  label="Название мероприятия"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="date_start" :props="props">
              <div>{{ props.row.date_start }}</div>
              <q-popup-edit
                v-model="props.row.date_start"
                @hide="changeDateStart(props.row._id, props.row.date_start)"
              >
                <q-input v-model="props.row.date_start">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="props.row.date_start"
                          mask="DD.MM.YYYY, HH:mm:ss"
                          minimal
                          first-day-of-week="1"
                          :locale="localeCalend"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Закрыть"
                              color="primary"
                              flat
                            ></q-btn>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="props.row.date_start"
                          mask="DD.MM.YYYY, HH:mm:ss"
                          format24h
                          first-day-of-week="1"
                          :locale="localeCalend"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Закрыть"
                              color="primary"
                              flat
                            ></q-btn>
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="date_end" :props="props">
              <div>{{ props.row.date_end }}</div>
              <q-popup-edit
                v-model="props.row.date_end"
                @hide="changeDateEnd(props.row._id, props.row.date_end)"
              >
                <q-input v-model="props.row.date_end">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="props.row.date_end"
                          mask="DD.MM.YYYY, HH:mm:ss"
                          minimal
                          first-day-of-week="1"
                          :locale="localeCalend"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Закрыть"
                              color="primary"
                              flat
                            ></q-btn>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="props.row.date_end"
                          mask="DD.MM.YYYY, HH:mm:ss"
                          format24h
                          first-day-of-week="1"
                          :locale="localeCalend"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Закрыть"
                              color="primary"
                              flat
                            ></q-btn>
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="isFree" :props="props">
              <q-checkbox
                v-model="props.row.isFree"
                :color="'grey-8'"
                @click="changeIsFree(props.row._id, props.row.isFree)"
              ></q-checkbox>
            </q-td>

            <q-td key="organization_name" :props="props">
              <div>{{ getShortText(props.row.organization_name) }}</div>
              <q-popup-edit
                v-model="props.row.organization_name"
                @hide="
                  changeOrganizName(props.row._id, props.row.organization_name)
                "
              >
                <q-input
                  type="textarea"
                  v-model="props.row.organization_name"
                  label="Организация"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="url" :props="props">
              <q-btn
                v-if="props.row.url"
                :href="props.row.url"
                target="_blank"
                flat
                dense
                :color="'grey-8'"
                ><q-icon name="link" />
                <q-tooltip>Перейти по ссылке</q-tooltip></q-btn
              >
              {{ getShortText(props.row.url) }}
              <q-popup-edit
                v-model="props.row.url"
                @hide="changeUrl(props.row._id, props.row.url)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.url"
                  label="Ссылка на мероприятие"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="tags" :props="props">
              <div v-if="props.row.dir" v-for="dir in props.row.dir">
                <div v-if="dir" v-for="subdir in dir">
                  <q-chip
                    removable
                    clickabl
                    @remove="delTag(props.row._id, subdir.id)"
                    :style="{ 'background-color': `${subdir.color}` }"
                    text-color="white"
                  >
                    {{ subdir.name }}
                  </q-chip>
                </div>
              </div>
              <q-btn icon="add" size="sm" round dense />
              <q-popup-edit  v-model="model" @hide="addNewTags(props.row._id, model)">
                <q-select
                  v-model="model"
                  emit-value
                  map-options
                  :options="getTagSelectOptions"
                  style="width: 250px"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-chip
                        :style="{ 'background-color': `${scope.opt.color}` }"
                        text-color="white"
                      >
                        {{ scope.opt.label }}
                      </q-chip>
                    </q-item>
                  </template>
                </q-select>
              </q-popup-edit>
            </q-td>

            <q-td key="views" :props="props">
              <div>
                {{ props.row.viewCount }}
              </div>
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
          @click="removeEvent(deleteRowId)"
          color="primary"
          v-close-popup
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from "../boot/axios";
import { ref } from "vue";
import VueCookies from "vue-cookies";
export default {
  setup() {
    return {
      icon: ref(false),
    };
  },
  data() {
    return {
      deleteRowId: -1,
      confirm: ref(false),
      localeCalend: {
        monthsShort: [
          "Янв.",
          "Фев.",
          "Мар.",
          "Апр.",
          "Май.",
          "Июн.",
          "Июл.",
          "Авг.",
          "Сен.",
          "Окт.",
          "Ноя.",
          "Дек.",
        ],
        months: [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ],
        daysShort: ["Вс.", "Пн.", "Вт.", "Ср.", "Чт.", "Пт.", "Сб."],
        days: [
          "Воскрксенье",
          "Понедельник",
          "Вторник",
          "Среда",
          "Четверг",
          "Пятница",
          "Суббота",
        ],
      },
      newPass: "",
      text: "",
      searchSelected: "",
      roles: [],
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      trueFalseCond: [
        {
          value: true,
          icon: "check_box",
          label: "Бесплатное",
        },
        {
          value: false,
          icon: "check_box_outline_blank",
          label: "Платное",
        },
      ],
      columns: [
        {
          name: "name",
          label: "Название",
          align: "left",
          field: "name",
          canEdit: true,
          sortable: true,
        },
        {
          name: "date_start",
          label: "Дата начала",
          align: "left",
          field: "date_start",
          canEdit: true,
          sortable: true,
        },
        {
          name: "date_end",
          align: "left",
          label: "Дата окончания",
          field: "date_end",
          canEdit: true,
          sortable: true,
        },
        {
          name: "isFree",
          align: "center",
          label: "Бесплатно",
          canEdit: true,
          sortable: true,
        },
        {
          name: "organization_name",
          align: "left",
          label: "Организаторы",
          field: "organization_name",
          canEdit: true,
          sortable: true,
        },
        {
          name: "url",
          align: "left",
          label: "Адресс сайта",
          field: "url",
          canEdit: true,
          sortable: true,
        },
        {
          name: "tags",
          align: "left",
          label: "Теги",
          field: "dir",
          canEdit: true,
          sortable: false,
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
          name: "control",
          align: "center",
          label: "Управление",
        },
      ],
      rows: [],
      error: 0,
      loaded: false,
      newName: "",
      newDateStart: "",
      newDateEnd: "",
      newIsFree: false,
      newOrganizName: "",
      newUrl: "",
      model: "",
      tags: [],
      tegid: "",
    };
  },
  mounted() {
    this.getEvents();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    async getTags() {
      try {
        const res = await api.get("api/childDir", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.tags = res.data;
      } catch (error) {
        this.onError(error);
      }
    },
    /**
     * Получение всех мероприятий с базы данных
     */
    async getEvents() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/event/dir/s", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        await this.getTags();
        res.data.forEach((el) => {
          el.date_end = this.formDateToUserView(el.date_end);
          el.date_start = this.formDateToUserView(el.date_start);
          el["viewCount"] = el.views != null ? Object.keys(el.views).length : 0;
        });
        this.rows = res.data;
        this.loaded = true;
      } catch (error) {
        this.onError(error);
      }
    },

    async addNewTags(id, tegid) {
      if (this.model == "") {
        return;
      }
      try {
        const response = await api.post(
          "api/event/dir/s/",
          {
            id: id,
            dir: tegid,
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
          message: "Новый тэг успешно добавлен.",
        });
        this.model = "";
        this.getEvents();
      } catch (error) {
        this.onError(error);
      }
    },

    async delTag(id, tegId) {
      try {
        const response = await api.post(
          "api/event/dir/s/del",
          {
            id: id,
            dir: tegId,
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
          message: "Тег успешно удален.",
        });
        this.getEvents();
      } catch (error) {
        this.onError(error);
      }
    },
    /**
     * Обработка ошибок при связи с сервером
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
     * Удаление мероприятия
     * @param {*} event_id
     */
    async removeEvent(event_id) {
      try {
        const res = await api.delete("api/event/" + event_id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.loaded = true;

        this.$q.notify({
          type: "positive",
          message: "Событие удалено",
        });
        this.getEvents();
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Измениение названия события
     * @param {*} id
     * @param {*} name
     */
    async changeName(id, name) {
      try {
        await api.put(
          "api/event/" + id,
          {
            name: name,
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
          message: "Название сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },

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
     * Форматирование отображения даты
     * в понятный пользователю формат
     * @param {*} date
     */
    formDateToUserView(date) {
      let dateFormat = new Date(date).toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
      });
      return dateFormat;
    },
    /**
     * Форматирование даты для отправки в базу данных
     * @param {*} date
     */
    formDateToDB(date_to_form) {
      let date = date_to_form.split(",");
      let date_date = date[0].split(".");
      let time = date[1].split(":");

      let formDBdate =
        date_date[2] +
        "-" +
        date_date[1] +
        "-" +
        date_date[0] +
        "T" +
        (Number(time[0]) - 3).toString().padStart(2, "0") +
        ":" +
        time[1] +
        ":" +
        time[2] +
        ".000Z";
      return formDBdate;
    },

    /**
     * Изменение даты начала события
     * @param {*} id
     * @param {*} dateStart
     */
    async changeDateStart(id, dateStart) {
      let formedDate = this.formDateToDB(dateStart);
      try {
        await api.put(
          "api/event/" + id,
          {
            date_start: formedDate,
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
          message: "Дата начала сохранена",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение даты окончания события
     * @param {*} id
     * @param {*} dateEnd
     */
    async changeDateEnd(id, dateEnd) {
      let formedDate = this.formDateToDB(dateEnd);

      try {
        await api.put(
          "api/event/" + id,
          {
            date_end: dateEnd,
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
          message: "Дата окончания сохранена",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменине типа мероприятия
     * Платное/Бесплатное
     * @param {*} id
     * @param {*} isFree
     */
    async changeIsFree(id, isFree) {
      try {
        await api.put(
          "api/event/" + id,
          {
            isFree: isFree,
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
          message: "Тип сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение названия организации
     * @param {*} id
     * @param {*} name
     */
    async changeOrganizName(id, name) {
      try {
        await api.put(
          "api/event/" + id,
          {
            organization_name: name,
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
          message: "Название организации сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение ссылки на мероприятие
     * @param {*} id
     * @param {*} url
     */
    async changeUrl(id, url) {
      try {
        await api.put(
          "api/event/" + id,
          {
            url: url,
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
          message: "Ссылка на мероприятие сохранена",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async addNewEvent() {
      let date_start = this.formDateToDB(this.newDateStart);
      let date_end = this.formDateToDB(this.newDateEnd);
      let obj = {
        name: this.newName,
        date_start: date_start,
        date_end: date_end,
        isFree: this.newIsFree,
        organization_name: this.newOrganizName,
        url: this.newUrl,
      };

      try {
        const response = await api.post(
          "api/event",
          {
            name: this.newName,
            date_start: date_start,
            date_end: date_end,
            isFree: this.newIsFree,
            organization_name: this.newOrganizName,
            url: this.newUrl,
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
          message: "Новое событие успешно добавлено.",
        });
        this.icon = false;
        this.getEvents();
      } catch (error) {
        this.onError(error);
      }
    },
  },
  computed: {
    /**
     * Получение фильтров для поиска
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
    getTagSelectOptions() {
      let options = [];
      this.tags.forEach((tag) => {
        options.push({ label: tag.name, value: tag._id, color: tag.color });
      });
      return options;
    },
    /**
     * Поиск по фильтрам
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
</style>
