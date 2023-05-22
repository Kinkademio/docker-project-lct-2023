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
              <div>{{ props.row.name }}</div>
              <q-popup-edit
                v-model="props.row.name"
                @hide="
                  changeName(props.row._id, props.row.name, props.row.username)
                "
              >
                <q-input
                  type="textarea"
                  v-model="props.row.name"
                  label="Новое имя пользователя"
                ></q-input>
              </q-popup-edit>
            </q-td>

            <q-td key="username" :props="props">
              <div>{{ props.row.username }}</div>
            </q-td>

            <q-td key="registrDate" :props="props">
              <div>
                {{
                  new Date(props.row.registrDate).toLocaleString("ru-RU", {
                    timeZone: "Europe/Moscow"
                  })
                }}
              </div>
            </q-td>

            <q-td key="roles" :props="props">
              <div>{{ props.row.roles }}</div>
              <q-popup-edit
                v-model="props.row.roles"
                @hide="
                  changeRole(props.row._id, props.row.roles, props.row.username)
                "
              >
                <q-select
                  v-model="props.row.roles"
                  :options="roles"
                  label="Роль"
                ></q-select>
              </q-popup-edit>
            </q-td>

            <q-td key="password">
              <q-btn flat dense :color="'grey-8'"
                ><q-icon name="edit"></q-icon>
                <q-popup-edit
                  v-model="props.row.roles"
                  v-slot="scope"
                  @hide="changeUserPass(props.row._id, newPass)"
                >
                  <q-input
                    v-model="newPass"
                    :type="isPwd ? 'password' : 'text'"
                    hint="Новый пароль"
                    validate
                    :rule="rulePas"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      ></q-icon>
                    </template>
                  </q-input>
                </q-popup-edit>
                <q-tooltip>Изменить пароль</q-tooltip>
              </q-btn>
            </q-td>

            <q-td key="control">
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
          @click="removeUser(deleteRowId, deletUserName)"
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
    const passwordRegex = /^[a-zA-Z._0-9]+$/;
    rulePas: [val => !passwordRegex.test(val) || "Пароль не подходит"];
  },

  data() {
    return {
      deletUserName: "",
      deleteRowId: -1,
      confirm: ref(false),
      searchSelected: "",
      newPass: "",
      text: "",
      isPwd: ref(true),
      roles: [],
      columns: [
        {
          name: "name",
          label: "Имя пользователя",
          align: "left",
          field: "name",
          canEdit: true,
          sortable: true
        },
        {
          name: "username",
          label: "Логин",
          align: "left",
          field: "username",
          canEdit: false,
          sortable: true
        },
        {
          name: "registrDate",
          align: "left",
          label: "Дата регистрации",
          field: "registrDate",
          canEdit: false,
          sortable: true
        },
        {
          name: "roles",
          align: "left",
          label: "Роль",
          field: "roles",
          canEdit: true,
          sortable: true
        },
        {
          name: "password",
          align: "left",
          label: "Пароль",
          canEdit: true
        },
        {
          name: "control",
          align: "left",
          label: "Управление"
        }
      ],
      rows: [],
      error: 0,
      loaded: false,
      password: ref(""),
      isPwd: ref(true)
    };
  },
  mounted() {
    this.getUsers();
    this.getRolesArray();
    this.searchSelected = this.getSearchParamsArray[0];
  },
  methods: {
    /**
     * Получение пользователей с бд
     */
    async getUsers() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("auth/users", {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token")
          }
        });
        this.rows = res.data;
        this.rows.forEach(e => {
          e.roles = e.roles[0];
        });
        this.loaded = true;
      } catch (error) {
        this.onError(error);
      }
    },

    /**
     * Изменение роли пользователя
     * @param {*} id
     * @param {*} role
     * @param {*} login
     */
    async changeRole(id, role, login) {
      try {
        await api.put("auth/updateRole", {
          id: id,
          newRole: role
        });
        this.$q.notify({
          type: "positive",
          message: "Роль пользователя сохранена"
        });
        if (VueCookies.get("login") == login) {
          VueCookies.remove("token");
          window.location.reload();
        }
      } catch (error) {
        this.onError(error);
      }
    },
    /**
     * Изменение имени пользователя
     * @param {*} id
     * @param {*} name
     * @param {*} login
     */
    async changeName(id, name, login) {
      if (name == "") {
        this.$q.notify({
          type: "negative",
          message: "Имя пользователя не может быть пустым"
        });
        return;
      }
      try {
        const response = await api.put("auth/updateUser/" + id, {
          name: name
        });
        this.$q.notify({
          type: "positive",
          message: "Имя пользователя сохранено"
        });

        //Обновляем куки если пользователь обновил свое имя
        if (login == VueCookies.get("login")) {
          VueCookies.set("uname", name, "10h");
          window.location.reload();
        }
      } catch (error) {
        this.onError(error);
      }
    },
    /**
     * Получение всех доступных ролей
     */
    async getRolesArray() {
      this.loaded = false;
      this.error = 0;
      try {
        const res = await api.get("auth/roles", {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token")
          }
        });
        this.roles = res.data.map(role => role.value);
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
          message: "Нет соединения с сервером"
        });
        return;
      }
      this.error = error.response.status;
      if (this.error != 403) {
        this.$q.notify({
          type: "negative",
          message: error.response.data.message ?? "Ошибка сервера"
        });
      }
    },
    /**
     * Удаление пользователя
     * @param {*} user_id
     * @param {*} login
     */
    async removeUser(user_id, login) {
      try {
        const res = await api.post(
          "auth/delete",
          {
            id: user_id
          },
          {
            headers: {
              Authorization: "Bearer " + VueCookies.get("token")
            }
          }
        );
        this.loaded = true;

        //Если пользователь удалил себя
        if (login == VueCookies.get("login")) {
          VueCookies.remove("token");
          VueCookies.remove("uname");
          window.location.reload();
        }

        this.$q.notify({
          type: "positive",
          message: "Пользователь удален"
        });
        this.getUsers();
      } catch (error) {
        this.onError(error);
      }
    },
    /**
     * Изменение пароля пользователя
     * @param {*} user_id
     * @param {*} newPass
     */
    async changeUserPass(user_id, newPass) {
      if (newPass == "" || newPass.length < 4) {
        this.$q.notify({
          type: "negative",
          message: "Новый пароль должен быть более 3 символов"
        });
        return;
      }
      try {
        const res = await api.put("auth/updateUser/" + user_id, {
          password: newPass
        });
        this.loaded = true;
        this.$q.notify({
          type: "positive",
          message: "Пароль изменен"
        });
      } catch (error) {
        this.onError(error);
      }
    }
  },
  //Поиск по талице
  computed: {
    /**
     * Примениение поискового фильтра к таблице
     */
    getRows() {
      if (this.text !== "") {
        let text = this.text;
        let result = [];
        let searchFiled;

        //Определяем по какому полю будм искать
        this.columns.forEach(element => {
          if (element.label == this.searchSelected) {
            searchFiled = element.field;
          }
        });

        let searchFields = searchFiled.split(".");
        this.rows.map(function(r) {
          let object = r[searchFields[0]];
          for (let index = 1; index < searchFields.length; index++) {
            object = object[searchFields[index]];
          }

          if (typeof object == "object") {
            object.forEach(elem => {
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
      this.columns.forEach(element => {
        if (element.field) {
          result.push(element.label);
        }
      });
      return result;
    }
  }
};
</script>
<style scoped>
.image {
  height: 60%;
  width: 60%;
}
</style>
