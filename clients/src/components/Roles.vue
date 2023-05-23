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
            <q-td key="_id" :props="props">
              <div>{{ props.row._id }}</div>
            </q-td>
            <q-td key="value" :props="props">
              <div>{{ props.row.value }}</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div class="text-center" v-if="error == 403">
      <div class="text-h4 " style="opacity: 0.5">У вас нет прав</div>
      <img class="image" src="../resources/Уваснедостаточноправv2.svg">

    </div>
  </div>
</template>

<script>
import { api } from "../boot/axios";
import VueCookies from "vue-cookies";

export default {
  data() {
    return {
      text: "",
      searchSelected: "",
      columns: [
        {
          name: "_id",
          align: "center",
          label: "Id",
          field: "_id",
          canEdit: false,
          sortable: true
        },
        {
          name: "value",
          align: "center",
          label: "Роль",
          field: "value",
          canEdit: false,
          sortable: true
        },
      ],
      rows: [],
      error: 0,
      loaded: false,
    };
  },
  mounted() {
    this.roles();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    async roles() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("auth/roles", {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token"),
          },
        });
        this.rows = res.data;
        this.loaded = true;
      } catch (error) {
        this.onError(error);
      }
    },
    onError(error) {
      this.loaded = true;
      if (!error.response || !error.response.status) {
        this.$q.notify({
          type: 'negative',
          message: "Нет соединения с сервером"
        });
        return;
      }
      this.error = error.response.status
      if (this.error != 403) {
        this.$q.notify({
          type: 'negative',
          message: error.response.data.message ?? 'Ошибка сервера'
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
    getSearchParamsArray() {
      let result = [];
      this.columns.forEach(
        element => {
          if (element.field) {
            result.push(element.label);
          }
        }
      )
      return result;
    }

  },
}
</script>
<style scoped>
.image {
  height: 30%;
  width: 30%;
}
</style>
