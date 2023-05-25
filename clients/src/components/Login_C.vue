<template>
  <q-card style="background-color: #fafafa" flat>
    <q-card-section>
      <q-input filled v-model="username" label="Адрес эл.почты" />
      <q-separator></q-separator>
      <q-input
        filled
        v-model="password"
        :type="isPwd ? 'password' : 'text'"
        label="Пароль"
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
      <q-btn flat label="Войти" @click="login" class="button" />
    </q-card-section>
  </q-card>
</template>
<script>
import { api } from "../boot/axios.js";
import VueCookies from "vue-cookies";
import { ref } from "vue";
export default {
  data() {
    return {
      username: "",
      password: "",
      isPwd: ref(true),
    };
  },
  methods: {
    onError(error) {
      if (!error.response || !error.response.status) {
        this.$q.notify({
          type: "negative",
          message: "Нет соединения с сервером",
        });
        return;
      }
      this.$q.notify({
        type: "negative",
        message: error.response.data.message ?? "Ошибка сервера",
      });
    },
    async login() {
      if (this.username == "") {
        this.$q.notify({
          type: "negative",
          message: "Введите адресс эл.почты",
        });
        return;
      }
      if (this.password == "") {
        this.$q.notify({
          type: "negative",
          message: "Введите пароль",
        });
        return;
      }
      try {
        const response = await api.post("auth/login", {
          username: this.username,
          password: this.password,
        });
        const token = response.data.token;
        const username = this.username;
        const name = response.data.name;
        VueCookies.set("token", token, "10h");
        VueCookies.set("uname", name, "10h");
        VueCookies.set("login", username, "10h");
        this.$q.notify({
          type: "positive",
          message: "Пользователь успешно авторизован.",
        });
        this.$router.replace({name:"statistic"});
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
