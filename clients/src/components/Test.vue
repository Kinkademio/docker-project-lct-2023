<template>
  <div>
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
                    <div class="text-h6">Добавление теста</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input v-model="newTitle" label="Название" />
                    <q-input v-model="newText" label="Описание" />
                    <q-input
                      v-model="newImage_url"
                      label="Ссылка на титульное изображение"
                    >
                      <q-btn flat dense :color="'grey-8'">
                        <q-icon name="upload" />
                        <q-popup-edit v-model="file_1" >
                          <q-file
                            v-model="file"
                            label="Выберите изображение"
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
                    <q-select
                      v-model="newDiffLevel"
                      label="Уровень сложности"
                      :options="getLevelOptions"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-chip
                            :style="{
                              'background-color': `${scope.opt.color}`,
                            }"
                            text-color="white"
                          >
                            {{ scope.opt.label }}
                          </q-chip>
                        </q-item>
                      </template>
                    </q-select>
                    <q-btn
                      class="q-mt-md"
                      flat
                      style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                      @click="addNewTest()"
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
                <div>{{ props.row.title }}</div>
                <q-popup-edit
                  v-model="props.row.title"
                  @hide="changeTestTitle(props.row._id, props.row.title)"
                >
                  <q-input
                    type="textarea"
                    v-model="props.row.title"
                    label="Заголовок"
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
                  <q-popup-edit v-model="file_2"
                    @hide="changeTestImage(props.row._id, props.row.image_url)"
                  >
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
                  @hide="changeTestImage(props.row._id, props.row.image_url)"
                >
                  <q-input
                    type="textarea"
                    v-model="props.row.image_url"
                    label="Ссылка титульное изображение"
                  ></q-input>
                </q-popup-edit>
              </q-td>

              <q-td key="text" :props="props">
                <div>{{ props.row.text }}</div>
                <q-popup-edit
                  v-model="props.row.text"
                  @hide="changeTestText(props.row._id, props.row.text)"
                >
                  <q-input
                    type="textarea"
                    v-model="props.row.text"
                    label="Описание"
                  ></q-input>
                </q-popup-edit>
              </q-td>

              <q-td key="tasks" :props="props">
                <div>{{ props.row.tasks }}</div>
                <q-popup-edit
                  v-model="props.row.tasks"
                  @hide="changeTestTask(props.row._id, props.row.tasks)"
                >
                  <q-input
                    type="textarea"
                    v-model="props.row.tasks"
                    label="Видео"
                  ></q-input>
                </q-popup-edit>
              </q-td>

              <q-td key="level" :props="props">
                <q-chip
                  v-if="props.row.level"
                  :style="{
                    'background-color': `${
                      levelsref[props.row.level].level.color
                    }`,
                  }"
                  text-color="white"
                >
                  {{ levelsref[props.row.level].level.name }}
                </q-chip>
                <q-popup-edit
                  v-model="props.row.level"
                  @hide="updateLevel(props.row._id, props.row.level)"
                >
                  <q-select
                    emit-value
                    map-options
                    v-model="props.row.level"
                    label="Уровень сложности"
                    :options="getLevelOptions"
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

              <q-td key="dir" :props="props">
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
                <q-popup-edit
                  v-model="model"
                  @hide="addNewTags(props.row._id, model)"
                >
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

              <q-td key="control">
                <q-btn
                  @click="
                    (edit = true),
                      (currentTasks = props.row.tasks),
                      (currentChourceId = props.row._id)
                  "
                  flat
                  dense
                  :color="'grey-8'"
                  ><q-icon name="edit" />
                  <q-tooltip>Редактировать содержимое</q-tooltip>
                </q-btn>

                <q-btn
                  @click="
                    (confirm = true),
                      (deleteRowId = props.row._id),
                      (deletUserName = props.row.username)
                  "
                  flat
                  dense
                  :color="'grey-8'"
                  ><q-icon name="delete_forever" />
                  <q-tooltip>Удалить</q-tooltip>
                </q-btn>
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
            @click="removeTest(deleteRowId, deletUserName)"
            color="primary"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="edit"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="background-color: #738664">
        <q-card-section
          style="background-color: white"
          class="row items-center q-pb-none"
        >
          <div class="text-h5">Редактор теста</div>
          <q-space></q-space>
          <q-btn
            dense
            flat
            icon="close"
            @click="currentTasks = []"
            v-close-popup
          >
            <q-tooltip class="bg-white text-primary">Закрыть</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section style="background-color: white">
          <q-btn
            :color="'grey-8'"
            flat
            icon="save"
            @click="saveTasks(currentChourceId, currentTasks)"
            ><q-tooltip class="bg-white text-primary"
              >Сохранить</q-tooltip
            ></q-btn
          >
          <q-btn :color="'grey-8'" @click="addTasks()" flat icon="add"
            ><q-tooltip class="bg-white text-primary"
              >Добавить</q-tooltip
            ></q-btn
          >
        </q-card-section>
        <q-card-section>
          <div class="row">
            <q-card
              style="min-width: 450px"
              class="col-2 q-ma-lg q-pa-lg"
              v-for="(tasks, key) in currentTasks"
            >
              <div class="row justify-between">
                <div class="col-8 text-h6" style="color: gray">
                  {{ key + 1 }}
                </div>
                <div class="col-1">
                  <q-btn
                    :color="'grey-8'"
                    flat
                    @click="deleteTasks(tasks)"
                    icon="delete"
                    ><q-tooltip class="bg-white text-primary"
                      >Удалить</q-tooltip
                    ></q-btn
                  >
                </div>
              </div>
              <q-input v-model="tasks.title" label="Заголовок"></q-input>
              <q-input v-model="tasks.text" label="Описание"></q-input>
              <q-input v-model="tasks.video" label="Ссылка на видео"> </q-input>
              <iframe
                :src="tasks.video"
                style="width: 100%; height: 250px"
              ></iframe>
            </q-card>
          </div>
        </q-card-section>
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
      file_1: null,
      file_2: null,
      modaladdvideo: ref(false),
      columns: [
        {
          name: "title",
          label: "Название",
          align: "left",
          field: "title",
          canEdit: true,
          sortable: true,
          forSeacrch: true,
        },
        {
          name: "image_url",
          label: "Титульное изображение",
          align: "left",
          field: "image_url",
          canEdit: true,
          sortable: true,
          forSeacrch: true,
        },
        {
          name: "text",
          align: "left",
          label: "Описание",
          field: "text",
          canEdit: true,
          sortable: true,
          forSeacrch: true,
        },
        {
          name: "level",
          align: "left",
          label: "Уровень сложности",
          field: "level",
          canEdit: true,
          sortable: true,
          forSeacrch: false,
        },
        {
          name: "dir",
          align: "left",
          label: "Теги",
          field: "dir",
          canEdit: true,
          sortable: false,
          forSeacrch: false,
        },
        {
          name: "control",
          align: "left",
          label: "Управление",
        },
      ],
      tags: [],
      levels: [],
      levelsref: {},
      rows: [],
      text: "",
      model: "",
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      confirm: ref(false),
      edit: ref(false),
      error: 0,
      loaded: false,
      searchSelected: "",
      icon: ref(false),

      newTitle: "",
      newText: "",
      newImage_url: "",
      newTags: [],
      newDiffLevel: "",
      file: ref(null),
      currentTasks: [],
      currentChourceId: "",
    };
  },
  async beforeMount() {
    //Получаем теги
    await this.getChildTag();
    //Получаем уровни сложности
    await this.getLevels();
    await this.getTests();
    //this.getRolesArray();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    deleteTasks(tasks) {
      let index = this.currentTasks.indexOf(tasks);
      this.currentTasks.splice(index, 1);
    },
    addTasks() {
      this.currentTasks.push({
        title: "",
        text: "",
        video: "",
      });
    },
    async saveTasks(id, tasks) {
      try {
        const res = await api.put(
          "api/test/" + id,
          {
            tasks: tasks,
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
          message: "Тест сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async removeTest(id) {
      try {
        const res = await api.delete("api/test/" + id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.$q.notify({
          type: "positive",
          message: "Тест удален",
        });
        this.getTests();
      } catch (error) {
        this.onError(error);
      }
    },
    async changeTestTask(id, newAuthor) {
      try {
        const res = await api.put(
          "api/test/" + id,
          {
            author: newAuthor,
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
          message: "Автор сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async changeTestText(id, newText) {
      try {
        const res = await api.put(
          "api/test/" + id,
          {
            text: newText,
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
          message: "Описание сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async changeTestImage(id, imageUrl) {
      console.log('do')
      try {
        await api.put(
          "api/test/" + id,
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
    async changeTestTitle(id, newName) {
      try {
        const res = await api.put(
          "api/test/" + id,
          {
            title: newName,
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
        this.newImgUrl = res.data;
        this.file = null;
        this.$q.notify({
          type: "positive",
          message: "Изображение загружено",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    async getLevels() {
      try {
        const res = await api.get("api/level", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.levels = res.data;
        res.data.forEach((level) => {
          this.levelsref[level._id] = { level };
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async getChildTag() {
      try {
        const res = await api.get("api/childDir/", {
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

    async updateLevel(id, levelid) {
      try {
        const res = await api.put(
          "api/test/" + id,
          {
            level: levelid,
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
          message: "Уровень сложности сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Получение пользователей с бд
     */
    async getTests() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/test/dir/s", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.rows = res.data;
        this.loaded = true;
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
    getShortText(descr, maxLength = 50) {
      if (descr && descr.length > maxLength) {
        return descr.substring(0, maxLength) + "...";
      }
      return descr;
    },
    async addNewTags(id, tegid) {
      if (this.model == "") {
        return;
      }
      try {
        const response = await api.post(
          "api/test/dir/s/",
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
        this.getTests();
      } catch (error) {
        this.onError(error);
      }
    },

    async delTag(id, tegId) {
      try {
        const response = await api.post(
          "api/test/dir/s/del",
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
        this.getTests();
      } catch (error) {
        this.onError(error);
      }
    },
    async addNewTest() {
      try {
        const response = await api.post(
          "api/test/",
          {
            title: this.newTitle,
            text: this.newText,
            level: this.newDiffLevel.value,
            image_url: this.newImage_url,
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
          message: "Тест успешно добавлен.",
        });
        this.getTests();
        this.newTitle = "";
        this.newText = "";
        this.newDiffLevel = "";
        this.newImage_url = "";
        this.icon = false;
      } catch (error) {
        this.onError(error);
      }
    },
  },
  //Поиск по таблице
  computed: {
    getTagSelectOptions() {
      let options = [];
      this.tags.forEach((tag) => {
        options.push({ label: tag.name, value: tag._id, color: tag.color });
      });
      return options;
    },

    getLevelOptions() {
      let options = [];
      this.levels.forEach((level) => {
        options.push({
          label: level.name,
          color: level.color,
          value: level._id,
        });
      });
      return options;
    },
    /**
     * Примениение поискового фильтра к таблице
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
    /**
     * Получение параметров поиска
     */
    getSearchParamsArray() {
      let result = [];
      this.columns.forEach((element) => {
        if (element.field && element.forSeacrch) {
          result.push(element.label);
        }
      });
      return result;
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
