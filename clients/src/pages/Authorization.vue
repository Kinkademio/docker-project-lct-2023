<template>
  <q-card class="my-card" flat bordered>
    <q-card-section>
      <div class="text-h5 text-center caption-text">Вход в систему</div>
    </q-card-section>
    <q-tabs v-model="tab" active-color="white" class="text-teal ">
      <q-tab v-for="panel in tabPanels" :label="panel.lable" :name="panel.name" class="text" @click="changeTab()" />
    </q-tabs>
    <q-separator />
    <router-view></router-view>
  </q-card>
</template>

<script>
import Registr from "../components/Registr_C.vue";
import Login from "../components/Login_C.vue";
import { ref } from "vue";

export default {
  param: {
    page: {
      type: String,
      default: "login"
    }
  },
  components: {
    Registr,
    Login,
  },
  data() {
    return {
      tab: ref("login"),
      tabPanels: [{
        name: "login",
        lable: "Авторизация",
      },
      {
        name: "registr",
        lable: "Регистрация",
      }],
    };
  },

  methods: {
    changeTab() {
      this.$router.push({ name: this.tab });
    }
  },
  beforeMount() {
    this.$router.push({ name: this.tab });
  }
};
</script>

<style scoped>
.text {
  color: rgb(158, 156, 156);
  opacity: 0.8;
}

.caption-text {
  color: rgb(255, 255, 255);
  opacity: 0.8;
}

.my-card {
  width: 450px;
  height: 250px;
  background-color: rgba(7, 7, 7, 0.288);
}
</style>
