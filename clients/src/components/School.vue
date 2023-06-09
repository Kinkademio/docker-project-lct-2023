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
        <div class="col-auto">
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
        <div class="col-auto">
          <q-select
            borderless
            v-model="this.searchSelected"
            :options="getSearchParamsArray"
          />
        </div>
        <div class="col q-mt-sm">
          <q-btn flat icon="add" @click="(icon = true), showAddMap()">
            <q-tooltip>Добавить новую запись</q-tooltip>
            <q-dialog v-model="icon">
              <q-card class="bg-white text-black add-fact">
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Добавления новой школы</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input v-model="newName" label="Название" />
                  <q-input v-model="newDescription" label="Описание" />
                  <q-input
                    v-model="newSchoolImg"
                    label="Ссылка на изображение школы"
                  >
                    <q-btn flat dense :color="'grey-8'">
                      <q-icon name="upload" />
                      <q-popup-edit v-model="file_1" >
                        <q-file
                          v-model="file"
                          label="Выберете изображение"
                          outlined
                          accept=".jpg, .jpeg, .png"
                          use-chips
                          style="max-width: 300px"
                          @update:model-value="uploadFileA()"
                        ></q-file>
                      </q-popup-edit>
                      <q-tooltip>Загрузить новове изображение</q-tooltip>
                    </q-btn>
                  </q-input>
                  <q-input
                    v-model="newShoolAddressName"
                    label="Адресс школы"
                    readonly
                  />
                  <q-input
                    v-model="newAddressComment"
                    label="Комментарий адреса"
                  />
                  <div id="container"></div>
                  <q-input v-model="newWebSite" label="Адрес сайта" />
                  <q-input v-model="newMail" label="Электронная почта школы" />
                  <q-btn
                    class="q-mt-md"
                    style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                    flat
                    @click="addNewSchool()"
                    >Добавить</q-btn
                  >
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-btn>
        </div>
        <div class="col-auto q-mt-sm">
          <q-btn label="Синхронизация данных" style="color: #616161" flat no-caps icon="download" @click="(sync=true)"> </q-btn>
          <q-dialog v-model="sync">
            <q-card>

              <q-card-section v-if="syncprocess" style="text-align: center;">
                Идет синхронизация данных
                <div>
                  <q-spinner-dots
                     color="primary"
                     size="2em"
                  ></q-spinner-dots>
                </div>
              </q-card-section>
              <div v-else>
              <q-card-section >
                Вы уверены что хотите запустить синхронизацию?
                <br>
                (внесенные изменения могут быть утеряны)
              </q-card-section>
              <q-card-actions align="center">
                <q-btn flat no-caps label="Да" @click="syncprocess=true">
                </q-btn>
                <q-btn flat no-caps label="Отмена" @click="sync=false">
                </q-btn>
              </q-card-actions>
            </div>
            </q-card>
          </q-dialog>
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
                  label="Название школы"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="description" :props="props">
              <div>{{ getShortText(props.row.description) }}</div>
              <q-popup-edit
                v-model="props.row.description"
                @hide="changeDescription(props.row._id, props.row.description)"
              >
              <q-input
                  type="textarea"
                  v-model="props.row.description"
                  label="Название школы"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="shool_image" :props="props">
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
                <q-popup-edit v-model="file_2"  @hide="changeSchoolImage(props.row._id, props.row.image_url)">
                  <q-file
                    v-model="file"
                    @update:model-value="uploadFileB(props.row._id)"
                    label="Выберете изображение"
                    outlined
                    accept=".jpg, .jpeg, .png"
                    use-chips
                    style="max-width: 300px"
                  ></q-file>
                </q-popup-edit>
                <q-tooltip>Загрузить новове изображение</q-tooltip>
              </q-btn>
              <q-popup-edit
                v-model="props.row.image_url"
                @hide="changeSchoolImage(props.row._id, props.row.image_url)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.image_url"
                  label="Ссылка на изображение школы"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="address_str" :props="props">
              <q-btn
                flat
                dense
                :color="'grey-8'"
                @click="
                  (iconn = true),
                    (idMap = props.row._id),
                    (curMapAdressAdress = props.row.address)
                "
                ><q-icon name="map" /> <q-tooltip> Координаты </q-tooltip>
              </q-btn>
              {{ props.row.address.address_str }}
            </q-td>

            <q-td key="address_comment" :props="props">
              <div>{{ getShortText(props.row.address.comment) }}</div>
              <q-popup-edit
                v-model="props.row.address.comment"
                @hide="changeAddress(props.row._id, props.row.address)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.address.comment"
                  label="Комментарий к адресу"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="web_site" :props="props">
              <q-btn
                v-if="props.row.contacts.web_site"
                :href="props.row.contacts.web_site"
                target="_blank"
                flat
                dense
                :color="'grey-8'"
                ><q-icon name="link" />
                <q-tooltip>Перейти по ссылке</q-tooltip></q-btn
              >
              {{ props.row.contacts.web_site }}
              <q-popup-edit
                v-model="props.row.contacts.web_site"
                @hide="changeContact(props.row._id, props.row.contacts)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.contacts.web_site"
                  label="Веб сайт"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="mail" :props="props">
              <div>{{ props.row.contacts.mail }}</div>
              <q-popup-edit
                v-model="props.row.contacts.mail"
                @hide="changeContact(props.row._id, props.row.contacts)"
              >
                <q-input
                  type="textarea"
                  v-model="props.row.contacts.mail"
                  label="Адресс электронной почты"
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
              <q-popup-edit    v-model="model" @hide="addNewTags(props.row._id, model)">
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
    <q-dialog @show="mapOpen()" v-model="iconn">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Изменине координат школы</div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          <div id="map"></div>
          <q-btn
            @click="changeCoordinate()"
            flat
            style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
          >
            Принять</q-btn
          >
        </q-card-section>
      </q-card>
    </q-dialog>
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
            @click="removeSchool(deleteRowId)"
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
import { load } from "@2gis/mapgl";

export default {
  setup() {
    return {
      newShoolAddressName: ref(""),
      alert: ref(false),
    };
  },
  data() {
    return {
      file_1: null,
      file_2: null,
      file: ref(null),
      deleteRowId: -1,
      confirm: ref(false),
      sync: ref(false),
      syncprocess: ref(false),
      iconn: ref(false),
      icon: ref(false),
      iconTegs: ref(false),
      newPass: "",
      text: "",
      roles: [],
      searchSelected: "",
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
          name: "description",
          label: "Описание",
          align: "left",
          field: "description",
          canEdit: true,
          sortable: true,
        },
        {
          name: "shool_image",
          label: "Ссылка на изображение школы",
          align: "left",
          field: "image_url",
          canEdit: true,
          sortable: true,
        },
        {
          name: "address_str",
          align: "left",
          label: "Адресс школы",
          field: "address.address_str",
          canEdit: false,
          sortable: true,
        },
        {
          name: "address_comment",
          align: "left",
          label: "Комментарий к адресу",
          field: "address.comment",
          canEdit: true,
          sortable: true,
        },
        {
          name: "web_site",
          align: "left",
          label: "Сайт школы",
          field: "contacts.web_site",
          canEdit: true,
          sortable: true,
        },
        {
          name: "mail",
          align: "left",
          label: "Адресс электронной почты",
          field: "contacts.mail",
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
          align: "left",
          label: "Управление",
        },
      ],
      rows: [],
      tegs: [],
      colorTeg: [],
      error: 0,
      loaded: false,
      password: ref(""),
      isPwd: ref(true),
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      newName: "",
      newDescription: "",
      newSchoolImg: "",
      newAddressStr: "",
      newAddressComment: "",
      newWebSite: "",
      newMail: "",
      x: 0,
      y: 0,
      xMarkerMap: 0,
      yMarkerMap: 0,
      curMapAdressAdress: {},
      idMap: "",
      tags: [],
      model: "",
      factTegId: "",
    };
  },
  mounted() {
    this.getSchool();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    async uploadFileB(prop) {
      if (this.file == null) return;
      let formData = new FormData();
      formData.append("file", this.file);
      try {
        const res = await api.post("api/uploads/create/", formData, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });

        this.rows.forEach((el) => {
          if (el._id == prop) {
            el.image_url = res.data;
          }
        });
        this.file = null;
        this.$q.notify({
          type: "positive",
          message: "Изображение загружено",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async uploadFileA() {
      if (this.file == null) return;
      let formData = new FormData();
      formData.append("file", this.file);
      try {
        const res = await api.post("api/uploads/create/", formData, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.newSchoolImg = res.data;
        this.file = null;
        this.$q.notify({
          type: "positive",
          message: "Изображение загружено",
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
     * Получение списка всех тегов
     */
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
     * Получение списка все школ
     */
    async getSchool() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/school/dir/s", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        await this.getTags();
        res.data.forEach((el) => {
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
          "api/school/dir/s/",
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
        this.getSchool();
      } catch (error) {
        this.onError(error);
      }
    },

    async delTag(id, tegId) {
      try {
        const response = await api.post(
          "api/school/dir/s/del",
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
        this.getSchool();
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Обработка ошибок при работе с API
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
     * Удаление школы из списка
     * @param {*} school_id
     */
    async removeSchool(school_id) {
      try {
        const res = await api.delete("api/school/" + school_id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.loaded = true;

        this.$q.notify({
          type: "positive",
          message: "Шкоала удалена",
        });
        this.getSchool();
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение имени школы
     * @param {*} id
     * @param {*} name
     */
    async changeName(id, name) {
      try {
        await api.put(
          "api/school/" + id,
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
          message: "Имя школы сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменине описания школы
     * @param {*} id
     * @param {*} description
     */
    async changeDescription(id, description) {
      try {
        await api.put(
          "api/school/" + id,
          {
            description: description,
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
          message: "Описание школы сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение ссылки на изображение школы
     * @param {*} id
     * @param {*} imageUrl
     */
    async changeSchoolImage(id, imageUrl) {
      try {
        await api.put(
          "api/school/" + id,
          {
            image_url: imageUrl,
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
          message: "Ссылка на изображение сохранена",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение адреса школы
     * @param {*} id
     * @param {*} address
     */
    async changeAddress(id, address) {
      try {
        await api.put(
          "api/school/" + id,
          {
            address: address,
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
          message: "Адрес сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение ссылки на веб сраницу школы
     * @param {*} id
     * @param {*} web
     */
    async changeContact(id, contact) {
      try {
        await api.put(
          "api/school/" + id,
          {
            contacts: contact,
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
          message: "Ссылка на веб-ресурс сохранена",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    async showAddMap() {
      const mapglAPI = await load();

      // container — id of the div element in your html
      const map = new mapglAPI.Map("container", {
        center: [37.62199313139937, 55.754172570006155],
        zoom: 15,
        key: "042b5b75-f847-4f2a-b695-b5f58adc9dfd",
      });

      let selectedIds = null;
      let newMarker;

      map.on("click", (e) => {
        if (!e.target) {
          return;
        }

        const { id } = e.target;
        //Если это первое нажатие после открытия
        if (selectedIds == null) {
          //Выбранный оъект становится тем, куда произведено нажатие курсором
          selectedIds = id;
          //Создаем в этом месте маркер
          newMarker = new mapglAPI.Marker(map, {
            coordinates: [e.lngLat[0], e.lngLat[1]],
          });
        }
        //Если ранее был выбран объект
        else {
          //Устанавиваем новый id
          selectedIds = id;
          //Удаляем существующий ранее маркер и создаем новый
          newMarker.destroy();
          newMarker = new mapglAPI.Marker(map, {
            coordinates: [e.lngLat[0], e.lngLat[1]],
          });
        }

        this.x = e.lngLat[0];
        this.y = e.lngLat[1];
        this.getNewSchoolName();
        map.setSelectedObjects([selectedIds]);
      });
    },

    getNewSchoolName() {
      const key = "rujnfh1727";
      const url = `https://catalog.api.2gis.com/3.0/items/geocode?lon=${this.x}&lat=${this.y}&type=building&key=${key}`;

      const xhr = new XMLHttpRequest();

      xhr.open("GET", url);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          this.newShoolAddressName = data.result.items[0].address_name;
        } else {
        }
      };
      xhr.send();
    },

    /**
    Добавление новой школы
    */
    async addNewSchool() {
      if (this.newShoolAddressName == "" || this.x == -1 || this.y == -1) {
        this.$q.notify({
          type: "negative",
          message: "Ошибка не все поля заполнены",
        });
        return;
      }
      try {
        const response = api.post(
          "api/school",
          {
            name: this.newName,
            description: this.newDescription,
            image_url: this.newSchoolImg,
            address: {
              address_str: this.newShoolAddressName,
              comment: this.newAddressComment,
              mapPos: {
                x: this.x,
                y: this.y,
              },
            },
            contacts: {
              mail: this.newMail,
              web_site: this.newWebSite,
            },
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
          message: "Новое соьбытие успешно добавлен.",
        });
        this.newName  = "";
        this.newDescription = "";
        this.newSchoolImg = "";
        this.newShoolAddressName = "";
        this.newAddressComment = "";
        this.newWebSite = "";
        this.newMail = "";

        this.icon = false;
        this.getSchool();
      } catch (error) {
        this.onError(error);
      }
    },
    /**
    Получение нового адреса школы
    */
    getNewAddSchoolName() {
      const key = "rupzho5301";
      const url = `https://catalog.api.2gis.com/3.0/items/geocode?lon=${this.curMapAdressAdress.mapPos.x}&lat=${this.curMapAdressAdress.mapPos.y}&type=building&key=${key}`;

      const xhr = new XMLHttpRequest();

      xhr.open("GET", url);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          this.curMapAdressAdress.address_str = data.result.items[0].address_name;
        }
      };
      xhr.send();
    },

    /**
     * Изменение координат школы
     */
    async changeCoordinate() {
      this.getNewAddSchoolName();
      setTimeout(() => {
        try {
          api.put(
            "api/school/" + this.idMap,
            {
              address: this.curMapAdressAdress,
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
            message: "Координаты школы успешно обновлены",
          });
          this.iconn = false;
          this.getSchool();
        } catch (error) {
          this.onError(error);
        }
      }, "2000");
    },
    /*
    Открытие карты
    */
    async mapOpen() {
      const mapglAPI = await load();

      // container — id of the div element in your html
      const map = new mapglAPI.Map("map", {
        center: [
          this.curMapAdressAdress.mapPos.x,
          this.curMapAdressAdress.mapPos.y,
        ],
        zoom: 18,
        key: "042b5b75-f847-4f2a-b695-b5f58adc9dfd",
      });

      const marker = new mapglAPI.Marker(map, {
        coordinates: [
          this.curMapAdressAdress.mapPos.x,
          this.curMapAdressAdress.mapPos.y,
        ],
      });

      let selectedIds = null;
      let newMarker;

      map.on("click", (e) => {
        if (!e.target) {
          return;
        }

        const { id } = e.target;
        //Если это первое нажатие после открытия
        if (selectedIds == null) {
          //Выбранный оъект становится тем, куда произведено нажатие курсором
          selectedIds = id;
          //Создаем в этом месте маркер
          newMarker = new mapgl.Marker(map, {
            coordinates: [e.lngLat[0], e.lngLat[1]],
          });
          //Удаляем стартовый маркер
          marker.destroy();
        }
        //Если ранее был выбран объект
        else {
          //Устанавиваем новый id
          selectedIds = id;
          //Удаляем существующий ранее маркер и создаем новый
          newMarker.destroy();
          newMarker = new mapgl.Marker(map, {
            coordinates: [e.lngLat[0], e.lngLat[1]],
          });
        }

        this.curMapAdressAdress.mapPos.x = e.lngLat[0];
        this.curMapAdressAdress.mapPos.y = e.lngLat[1];

        map.setSelectedObjects([selectedIds]);
      });
    },
  },
  computed: {
    /**
     * Выборка параметров для поиска из колонок таблицы
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
     * Фильр содержимого таблицы по результату совпадения поиска
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

#map {
  width: 500px;
  height: 600px;
}

#container {
  width: 400px;
  height: 400px;
  overflow: hidden;
}
</style>
