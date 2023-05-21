<template>
  <q-layout class="#particles-js" view="lHh Lpr lFf">

    <particles :key="this.$route.name"> </particles>
    <q-header reveal class="background">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-h5">Личный кабинет</q-toolbar-title>
        <p class="q-pt-md q-pr-md text-h6">{{ name }}</p>
        <q-btn @click="logout()" flat round icon="logout" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250" :breakpoint="600">

      <q-list>
        <q-img class="q-ma-lg" style="width: 200px;" src="../resources/LogoInside.svg"></q-img>
        <q-separator></q-separator>
        <div v-for="nav, key in navigation" :key="key">
          <q-item exact clickable v-ripple @click="navugate(nav.route)" :active="currentRoute == nav.route">
            <q-item-section avatar>
              <q-icon :name="nav.iconName" />
            </q-item-section>
            <q-item-section class="text-h7">{{ nav.label }}</q-item-section>
          </q-item>

        </div>

      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page style="margin: 0px 24px 0px 24px;">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

import Particles from "../components/Particles.vue";
import { api } from "../boot/axios";
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import Login from "../pages/Authorization.vue";
import VueCookies from "vue-cookies";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
    Login,
    Particles
  },
  data() {
    return {
      currentRoute: "",
      navigation: [
        {
          label: "Статистика",
          route: "statistic",
          iconName: "query_stats",
          base: true,
        },
        {
          label: "Редактирование данных ",
          route: "dataedit",
          iconName: "storage",
        },
        {
          label: "Профиль",
          route: "profile",
          iconName: "account_circle",

        },
        {
          label: "Техническая поддержка",
          route: "techsupport",
          iconName: "help_outline",
        }
      ],
      name: VueCookies.get("uname"),
      token: VueCookies.get("token"),
    };
  },
  setup() {
    const leftDrawerOpen = ref(false);
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {
    logout() {
      VueCookies.remove("token");
      VueCookies.remove("uname");
      window.location.reload();
    },
    navugate(route) {
      this.currentRoute = route;
      this.$router.push({ name: this.currentRoute });
    },
    reroute() {
      if (!VueCookies.get('token')) {
        this.$router.replace("/auth");
      }
    }
  },
  beforeMount() {
    this.reroute();
    this.currentRoute = this.navigation[0].route;
    if (this.$router.currentRoute.value.fullPath == '/') {
      this.$router.push({ name: this.currentRoute });
    }
  },
  beforeUpdate() {
    this.reroute();
    this.$router.push({ name: this.currentRoute });
  }
});
</script>
<style scoped>
.background {
  background: linear-gradient(0deg, #00000000 0%, #090249 99%);
}
</style>
