<template>
  <q-card>
    <div class="row">
      <div class="col">
        <q-card-section>
          <div class="text-h6">Данные пользователя</div>
        </q-card-section>
        <q-card-section>
          <q-input
            :readonly="cantEdit"
            v-model="name"
            hint="Имя пользователя"
            @blur="changeName()"
          >
            <template v-slot:append>
              <q-icon
                :name="'edit'"
                class="cursor-pointer"
                @click="cantEdit = !cantEdit"
              >
              </q-icon>
            </template>
          </q-input>

          <q-input
            :readonly="true"
            v-model="username"
            hint="Адресс эл. почты"
          />
        </q-card-section>
      </div>
      <q-separator vertical inset></q-separator>
      <div class="col">
        <q-card-section>
          <div class="text-h6">Изменение пароля</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Новый пароль"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              ></q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="password_again"
            :type="isPwd ? 'password' : 'text'"
            label="Подтвержение пароля"
          />
        </q-card-section>

        <q-card-section>
          <q-btn
            flat
            class="button"
            label="Изменить пароль"
            @click="changeUserPass"
          ></q-btn>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import { api } from "../boot/axios";
import { ref } from "vue";
import VueCookies from "vue-cookies";
export default {
  beforeMount() {
    this.username = VueCookies.get("login");
    this.name = VueCookies.get("uname");
  },
  data() {
    return {
      password: "",
      password_again: "",
      isPwd: ref(true),
      username: "",
      name: "",
      cantEdit: true,
    };
  },
  methods: {
    async changeName() {
      this.cantEdit = true;
      if (this.name == "") {
        this.$q.notify({
          type: "negative",
          message: "Имя пользователя не может быть пустым",
        });
        return;
      }
      if (VueCookies.get("uname") == this.name) {
        return;
      }
      try {
        const res = await api.post("auth/user", {
          username: VueCookies.get("login"),
        },
        {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token"),
          },
        });

        const response = await api.put("auth/updateUser/" + res.data._id, {
          name: this.name,
        },
        {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token"),
          },
        });
        this.$q.notify({
          type: "positive",
          message: "Имя пользователя изменено",
        });
        VueCookies.set("uname", this.name, "10h");
        window.location.reload();
      } catch (error) {
        this.name = VueCookies.get("uname");
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
    async changeUserPass() {
      if (this.password == "" || this.password < 4) {
        this.$q.notify({
          type: "negative",
          message: "Новый пароль должен быть более 3 символов",
        });
        return;
      }
      if (this.password_again == "") {
        this.$q.notify({
          type: "negative",
          message: "Введите подтверждение пароля",
        });
        return;
      }
      const passwordRegex = /^[a-zA-Z._0-9]+$/;
      if (!passwordRegex.test(this.password)) {
        this.$q.notify({
          type: "negative",
          message:
            "Пароль должен содержать только буквы a-z, A-Z, точку (.) и символ подчеркивания (_)",
        });
        return;
      }
      if (this.password_again != this.password) {
        this.$q.notify({
          type: "negative",
          message: "Пароли не совпадают",
        });
        return;
      }
      try {
        const res = await api.post("auth/user", {
          username: VueCookies.get("login"),
        },
        {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token"),
          },
        });

        await api.put("auth/updateUser/" + res.data._id, {
          password: this.password,
        },
        {
          headers: {
            Authorization: "Bearer " + VueCookies.get("token"),
          },
        });
        this.loaded = true;
        this.$q.notify({
          type: "positive",
          message: "Пароль изменен",
        });
      } catch (error) {
        this.onError(error);
      }
    },
  },
};
</script>
<style scoped>
.button {
  background-color: rgba(7, 7, 7, 0.05);
  width: 100%;
}
</style>
