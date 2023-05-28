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
        <div class="text-h6">Родительские теги</div>
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
              v-model="searchSelected"
              :options="getSearchParamsArray"
            />
          </div>
          <div class="col-1 q-mt-sm">
            <q-btn flat icon="add" @click="icon = true">
              <q-dialog v-model="icon">
                <q-card class="bg-white text-black add-fact">
                  <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Добавления нового тега</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input v-model="newName" label="Название" />
                    <q-color
                      v-model="newColor"
                      no-header-tabs
                      no-footer
                    ></q-color>
                    <q-btn
                      class="q-mt-lg"
                      flat
                      style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                      @click="addTag()"
                      >Принять</q-btn
                    >
                  </q-card-section>
                </q-card>
              </q-dialog></q-btn
            >
          </div>
        </div>
        <q-separator></q-separator>

        <q-table
          :rows-per-page-options="[0]"
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
                <div>{{ props.row.name }}</div>
                <q-popup-edit
                  v-model="props.row.name"
                  @hide="changeTagName(props.row._id, props.row.name)"
                >
                  <q-input
                    type="textarea"
                    v-model="props.row.name"
                    label="Название тега"
                  ></q-input>
                </q-popup-edit>
              </q-td>

              <q-td key="color" :props="props">
                <q-chip
                  :style="{ 'background-color': `${props.row.color}` }"
                  style="font-size: 16px"
                  text-color="white"
                  >{{ props.row.name }}
                  <q-popup-edit
                    v-model="props.row.color"
                    @hide="changeTagColor(props.row._id, props.row.color)"
                  >
                    <q-color
                      v-model="props.row.color"
                      no-header-tabs
                      no-footer
                    ></q-color>
                  </q-popup-edit>
                </q-chip>
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
              @click="deleteTag(deleteRowId)"
              color="primary"
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <div>
      <q-spinner-ball
        v-if="!loaded"
        class="fixed-center"
        size="5rem"
        color="white"
        :thickness="3"
      />
      <div v-if="loaded && !error">
        <div class="text-h6">Дочерние теги</div>

        <div class="row">
          <div class="col-3">
            <q-input
              style="padding-bottom: 0px"
              bottom-slots
              borderless
              v-model="textCh"
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
              v-model="searchSelected"
              :options="getSearchParamsArrayCh"
            />
          </div>
          <div class="col-1 q-mt-sm">
            <q-btn flat icon="add" @click="iconCh = true">
              <q-dialog v-model="iconCh">
                <q-card class="bg-white text-black add-fact">
                  <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">Добавления нового тега</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input v-model="newChildName" label="Название" />
                    <q-select
                      v-model="newChildParentId"
                      emit-value
                      map-options
                      :options="getParentSelectOptions"
                    ></q-select>
                    <q-btn
                      class="q-mt-lg"
                      flat
                      style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                      @click="addChildTag()"
                      >Принять</q-btn
                    >
                  </q-card-section>
                </q-card>
              </q-dialog></q-btn
            >
          </div>
        </div>
        <q-separator></q-separator>

        <q-table
          :rows-per-page-options="[0]"
          flat
          borderless
          separator="cell"
          :rows="getRowsCh"
          :columns="columnsCh"
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
                <div>{{ props.row.name }}</div>
                <q-popup-edit
                  v-model="props.row.fact_text"
                  @hide="changeChildDirName(props.row._id, props.row.name)"
                >
                  <q-input
                    type="textarea"
                    v-model="props.row.name"
                    label="Название тега"
                  ></q-input>
                </q-popup-edit>
              </q-td>

              <q-td key="parent" :props="props">
                <q-chip
                  :style="{ 'background-color': `${props.row.color}` }"
                  style="font-size: 16px"
                  text-color="white"
                  >{{ props.row.name }}
                  <q-popup-edit
                    v-model="props.row.fact_text"
                    @hide="
                      changeChildDirParent(props.row._id, props.row.parent)
                    "
                  >
                    <q-select
                      v-model="props.row.parent"
                      emit-value
                      map-options
                      :options="getParentSelectOptions"
                    ></q-select>
                  </q-popup-edit>
                </q-chip>
              </q-td>

              <q-td key="control">
                <q-btn
                  @click="(confirmCh = true), (deleteRowIdCh = props.row._id)"
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
      <q-dialog v-model="confirmCh" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">Вы точно хотите удалить запись?</span>
          </q-card-section>

          <q-card-actions align="between">
            <q-btn flat label="Отмена" color="primary" v-close-popup></q-btn>
            <q-btn
              flat
              label="Удалить"
              @click="removeChildDir(deleteRowIdCh)"
              color="primary"
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { api } from "../boot/axios";
import VueCookies from "vue-cookies";
import { ref } from "vue";
export default {
  data() {
    return {
      deleteRowId: -1,
      pagination: ref(null),
      deleteRowIdCh: -1,
      confirm: ref(false),
      confirmCh: ref(false),
      icon: ref(false),
      iconCh: ref(false),
      newColor: "#000000",
      newName: "",
      newChildName: "",
      newChildParent: "",
      newChildParentId: "",
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      text: "",
      textCh: "",
      searchSelected: "",
      searchSelectedCh: "",
      columns: [
        {
          name: "name",
          align: "left",
          label: "Название",
          field: "name",
          canEdit: true,
          sortable: true,
        },
        {
          name: "color",
          align: "left",
          label: "Цвет",
          canEdit: true,
          sortable: false,
        },
        {
          name: "control",
          align: "left",
          label: "Управление",
        },
      ],
      columnsCh: [
        {
          name: "name",
          align: "left",
          label: "Название",
          field: "name",
          canEdit: true,
          sortable: true,
        },
        {
          name: "parent",
          align: "left",
          label: "Тег верхнего уровня",
          canEdit: true,
          sortable: false,
        },
        {
          name: "control",
          align: "left",
          label: "Управление",
        },
      ],
      rows: [],
      rowsCh: [],
      error: 0,
      loaded: false,
    };
  },
  mounted() {
    this.getTegs();
    this.getChildTag();
    this.searchSelectedCh = this.getSearchParamsArrayCh[0];
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    async getChildTag() {
      try {
        const res = await api.get("api/childDir/", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.rowsCh = res.data;
      } catch (error) {
        this.onError(error);
      }
    },
    async addChildTag() {
      if(this.newChildParentId == "" &&  this.newChildName == ""){
        this.$q.notify({
          type: "negative",
          message: "Не все поля заполнены",
        });
        return;
      }
      try {
        const res = await api.post(
          "api/childDir/",
          {
            name: this.newChildName,
            parent: this.newChildParentId,
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
          message: "Тег добавлен",
        });
        this.newChildName = "";
        this.newChildParent = "";
        this.newChildParentId = "";
        this.getChildTag();
      } catch (error) {
        this.onError(error);
      }
    },
    async removeChildDir(id) {
      try {
        const res = await api.delete("api/childDir/" + id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.$q.notify({
          type: "positive",
          message: "Тег удален",
        });
        this.getChildTag();
      } catch (error) {
        this.onError(error);
      }
    },
    async changeChildDirName(id, name) {
      try {
        const res = await api.put(
          "api/childDir/" + id,
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
          message: "Тег сохранен",
        });
        this.getChildTag();
      } catch (error) {
        this.onError(error);
      }
    },
    async changeChildDirParent(id, parent_id) {
      if(parent_id == ""){
        return;
      }
      try {
        const res = await api.put(
          "api/childDir/" + id,
          {
            parent: parent_id,
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
          message: "Тег сохранен",
        });
        this.getChildTag();
      } catch (error) {
        this.onError(error);
      }
    },

    async getTegs() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/direction", {
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

    async changeTagName(id, name) {
      try {
        const res = await api.put(
          "api/direction/" + id,
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
        this.getTegs();
        this.getChildTag();
      } catch (error) {
        this.onError(error);
      }
    },
    async changeTagColor(id, color) {
      try {
        const res = await api.put(
          "api/direction/" + id,
          {
            color: color,
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
          message: "Цвет сохранен",
        });
        this.getTegs();
        this.getChildTag();
      } catch (error) {
        this.onError(error);
      }
    },

    async addTag() {
      try {
        const res = await api.post(
          "api/direction",
          {
            name: this.newName,
            color: this.newColor,
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
          message: "Тег добавлен",
        });
        this.icon = false;
        this.newColor = "#000000";
        this.newName = "";
        this.getTegs();
      } catch (error) {
        this.onError(error);
      }
    },

    async deleteTag(id) {
      console.log(id)
      try {
        const res = await api.delete("api/direction/" + id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.$q.notify({
          type: "positive",
          message: "Тег удален",
        });
        this.getTegs();
      } catch (error) {
        this.onError(error);
      }
    },

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
  },
  computed: {
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
    getSearchParamsArray() {
      let result = [];
      this.columns.forEach((element) => {
        if (element.field) {
          result.push(element.label);
        }
      });
      return result;
    },
    getRowsCh() {
      if (this.textCh !== "") {
        let text = this.textCh;
        let result = [];
        let searchFiled;

        //Определяем по какому полю будм искать
        this.columnsCh.forEach((element) => {
          if (element.label == this.searchSelectedCh) {
            searchFiled = element.field;
          }
        });

        let searchFields = searchFiled.split(".");
        this.rowsCh.map(function (r) {
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
      return this.rowsCh;
    },
    getSearchParamsArrayCh() {
      let result = [];
      this.columnsCh.forEach((element) => {
        if (element.field) {
          result.push(element.label);
        }
      });
      return result;
    },
    getParentSelectOptions() {
      let selectOptions = [];
      this.rows.forEach((el) => {
        selectOptions.push({ label: el.name, value: el._id });
      });
      return selectOptions;
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
