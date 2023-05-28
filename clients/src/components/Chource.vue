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
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Добавление курса</div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-input v-model="newTitle" label="Название" />
                  <q-input v-model="newText" label="Описание" />
                  <q-input v-model="newImage_url" label="Ссылка на титульное изображение">
                    <q-btn flat dense :color="'grey-8'">
                      <q-icon name="upload" />
                      <q-popup-edit>
                        <q-file v-model="file" label="Выберите изображение" outlined accept=".jpg, .jpeg, .png" use-chips
                          style="max-width: 300px" @update:model-value="uploadFileA()"></q-file>
                      </q-popup-edit>
                      <q-tooltip>Загрузить новове изображение</q-tooltip>
                    </q-btn>
                  </q-input>
                  <q-input v-model="newAuthor" label="Автор"></q-input>
                  <q-checkbox v-model="newisFree" label="Бесплатное" style="opacity: 60%" />
                  <q-select v-model="newDiffLevel" label="Уровень сложности" :options="getLevelOptions">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-chip :style="{ 'background-color': `${scope.opt.color}` }" text-color="white">
                          {{ scope.opt.label }}
                        </q-chip>
                      </q-item>
                    </template>
                  </q-select>
                  <q-btn class="q-mt-md" flat style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                    @click="addNewChource()">Добавить</q-btn>
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
            <q-td key="title" :props="props">
              <div>{{ props.row.title }}</div>
              <q-popup-edit v-model="props.row.title" @hide="changeChourceTitle(props.row._id, props.row.title)">
                <q-input type="textarea" v-model="props.row.title" label="Заголовок"></q-input>
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
                <q-popup-edit @hide="changeChourceImage(props.row._id, props.row.image_url)">
                  <q-file
                    v-model="file"
                    v-on:update:model-value="uploadFileB(props.row._id)"
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
                @hide="changeChourceImage(props.row._id, props.row.image_url)"
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
              <q-popup-edit v-model="props.row.text" @hide="changeChourceText(props.row._id, props.row.text)">
                <q-input type="textarea" v-model="props.row.text" label="Описание"></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="author" :props="props">
              <div>{{ props.row.author }}</div>
              <q-popup-edit v-model="props.row.author" @hide="changeChourceAuthor(props.row._id, props.row.author)">
                <q-input type="textarea" v-model="props.row.author" label="Описание"></q-input>
              </q-popup-edit>
            </q-td>


            <q-td key="isFree" :props="props">
              <q-checkbox
                v-model="props.row.isFree"
                :color="'grey-8'"
                @click="changeIsFree(props.row._id, props.row.isFree)"
              ></q-checkbox>
            </q-td>

            <q-td key="level" :props="props">
              <q-chip v-if="props.row.level"
                        :style="{ 'background-color': `${levelsref[props.row.level].level.color }` }"
                        text-color="white">
                        {{ levelsref[props.row.level].level.name }}
                      </q-chip>
              <q-popup-edit  @hide="updateLevel(props.row._id, props.row.level)">
                <q-select  emit-value map-options  v-model="props.row.level" label="Уровень сложности" :options="getLevelOptions">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-chip :style="{ 'background-color': `${scope.opt.color}` }" text-color="white">
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
              <q-popup-edit @hide="addNewTags(props.row._id, model)">
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
              <q-btn @click="(edit=true), (currentVideos = props.row.videos), (currentChourceId = props.row._id)" flat dense :color="'grey-8'"><q-icon name="edit" />
                <q-tooltip>Редактировать содержимое</q-tooltip>
              </q-btn>

              <q-btn @click="
                (confirm = true),
                (deleteRowId = props.row._id),
                (deletUserName = props.row.username)
              " flat dense :color="'grey-8'"><q-icon name="delete_forever" />
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
        <q-btn flat label="Удалить" @click="removeChource(deleteRowId, deletUserName)" color="primary" v-close-popup></q-btn>
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
      <q-card>
        <q-bar>
          <q-space></q-space>
          <q-btn dense flat icon="close" @click="currentVideos = []" v-close-popup>
            <q-tooltip class="bg-white text-primary">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="text-h6">
          Редактор курса
          <q-btn flat icon="save" @click="saveVideos(currentChourceId, currentVideos)"><q-tooltip class="bg-white text-primary">Сохранить</q-tooltip></q-btn>
          <q-btn @click="addVideo()" flat icon="add"><q-tooltip class="bg-white text-primary">Добавить</q-tooltip></q-btn>
        </q-card-section>

        <q-card-section>
          <div class="row">
          <div class="col-1 q-ma-lg"  v-for="video, key in currentVideos">
            <div class="row justify-between">
      <div class="col-4">
        Видео курса №{{ key+1 }}
      </div>
      <div class="col-4">
        <q-btn flat @click="deleteVideo(video)" icon="delete"><q-tooltip class="bg-white text-primary">Удалить</q-tooltip></q-btn>
      </div>
    </div>

          <q-input v-model="video.title" label="Заголовок"></q-input>
          <q-input v-model="video.text" label="Описание"></q-input>
          <q-input v-model="video.video" label="Ссылка на видео"></q-input>
          </div>
          </div>

        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script>
import { api } from "../boot/axios";
import { ref } from "vue";
import VueCookies from "vue-cookies";
export default {
  data() {
    return {
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
          name: "author",
          align: "left",
          label: "Автор",
          field: "author",
          canEdit: true,
          sortable: true,
          forSeacrch: true,
        },
        {
          name: "isFree",
          align: "left",
          label: "Бесплатный",
          field: "isFree",
          canEdit: true,
          sortable: true,
          forSeacrch: false,
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
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      confirm: ref(false),
      edit:ref(false),
      error: 0,
      loaded: false,
      searchSelected: "",
      icon: ref(false),

      newTitle: "",
      newText: "",
      newImage_url: "",
      newAuthor: "",
      newisFree: false,
      newTags: [],
      newDiffLevel: "",
      file: ref(null),
      currentVideos:[],
      currentChourceId:"",
    };
  },
    async beforeMount() {

    //Получаем теги
    await this.getChildTag();
    //Получаем уровни сложности
    await this.getLevels();
    await this.getChource();
    //this.getRolesArray();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    deleteVideo(video){
      let index = this.currentVideos.indexOf(video);
      console.log(index)
      this.currentVideos.splice(index, 1);
    },
    addVideo(){
      this.currentVideos.push({title:"", text: "", video: ""});
    },
    async saveVideos(id, videos){
      try {
        const res = await api.put("api/chource/" + id,
          {
            videos: videos

          }, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          }
        });
        this.$q.notify({
          type: "positive",
          message: "Курс сохранен",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async removeChource(id){
      try {
        const res = await api.delete("api/chource/" + id,
         {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          }
        });
        this.$q.notify({
          type: "positive",
          message: "Курс удален",
        });
        this.getChource();
      } catch (error) {
        this.onError(error);
      }
    },
    async changeIsFree(id, status){
      try {
        const res = await api.put("api/chource/" + id,
          {
            isFree: status
          }, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          }
        });
        this.$q.notify({
          type: "positive",
          message: "Автор сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async changeChourceAuthor(id, newAuthor) {
      try {
        const res = await api.put("api/chource/" + id,
          {
            author: newAuthor

          }, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          }
        });
        this.$q.notify({
          type: "positive",
          message: "Автор сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async changeChourceText(id, newText) {
      try {
        const res = await api.put("api/chource/" + id,
          {
            text: newText

          }, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          }
        });
        this.$q.notify({
          type: "positive",
          message: "Описание сохранено",
        });
      } catch (error) {
        this.onError(error);
      }
    },
    async changeChourceImage(id, imageUrl) {
      try {
        await api.put(
          "api/chource/" + id,
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

    async changeChourceTitle(id, newName) {
      try {
        const res = await api.put("api/chource/" + id,
          {
            title: newName

          }, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          }
        });
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
          }
        });
        this.levels = res.data;
        res.data.forEach(level=>{
          this.levelsref[level._id] = {level}
        })
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
          }
        });
        this.tags = res.data;
      } catch (error) {
        this.onError(error);
      }
    },

    async updateLevel(id, levelid){
      try {
        const res = await api.put("api/chource/" + id,
          {
            level: levelid

          }, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          }
        });
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
    async getChource() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/chource/dir/s", {
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
      console.log(error)
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
          "api/chource/dir/s/",
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
        this.getChource();
      } catch (error) {
        this.onError(error);
      }
    },

    async delTag(id, tegId) {
      try {
        const response = await api.post(
          "api/chource/dir/s/del",
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
        this.getChource();
      } catch (error) {
        this.onError(error);
      }
    },
    async addNewChource(){
      try {
        const response = await api.post(
          "api/chource/",
          {
            title: this.newTitle,
            text: this.newText,
            author: this.newAuthor,
            level: this.newDiffLevel.value,
            image_url: this.newImage_url,
            isFree: this.newisFree
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
          message: "Курс успешно добавлен.",
        });
       this.getChource();
      } catch (error) {
        this.onError(error);
      }
    }
  },
  //Поиск по талице
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
      console.log(this.levels)
      this.levels.forEach(level => {
        options.push({ label: level.name, color: level.color, value: level._id })

      })
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
