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
            v-model="searchSelected"
            :options="getSearchParamsArray"
          />
        </div>
        <div class="col q-mt-sm">
          <q-btn flat icon="add" @click="icon = true">
            <q-dialog v-model="icon">
              <q-card class="bg-white text-black add-fact">
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6">Добавления нового уровня сложности</div>
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
                    @click="addLevel()"
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
        v-model:pagination="pagination"
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
                v-model="props.row.fact_text"
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
                  v-model="props.row.fact_text"
                  @hide="changeLevelDiffColor(props.row._id, props.row.color)"
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
            @click="deleteLevel(deleteRowId)"
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
import VueCookies from "vue-cookies";
import { ref } from "vue";
export default {
  data() {
    return {
      deleteRowId: -1,
      pagination: ref(null),
      confirm: ref(false),
      icon: ref(false),
      newColor: "#000000",
      newName: "",
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      text: "",
      searchSelected: "",
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
      rows: [],
      error: 0,
      loaded: false,
    };
  },
  mounted() {
    this.getLevels();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    async getLevels() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("api/level", {
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
          "api/level/" + id,
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
        this.getLevels();
      } catch (error) {
        this.onError(error);
      }
    },
    async changeLevelDiffColor(id, color) {
      try {
        const res = await api.put(
          "api/level/" + id,
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
        this.getLevels();
      } catch (error) {
        this.onError(error);
      }
    },

    async addLevel() {
      try {
        const res = await api.post(
          "api/level",
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
          message: "Уровень сложности добавлен",
        });
        this.icon = false;
        this.newColor = "#000000";
        this.newName = "";
        this.getLevels();
      } catch (error) {
        this.onError(error);
      }
    },

    async deleteLevel(id) {
      try {
        const res = await api.delete("api/level/" + id, {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.$q.notify({
          type: "positive",
          message: "Уровень сложности удален удален",
        });
        this.getLevels();
      } catch (error) {
        this.onError(error);
      }
    },

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
