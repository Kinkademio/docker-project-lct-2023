<template>
  <q-card>
    <q-card-section>
      <q-select v-model="selectedTable" :options="getOptions"
        label="Выберите таблицу, которую хотите отредактировать" />
    </q-card-section>
    <q-card-section>
      <roles v-if="selectedTable === 'Роли'" />
      <users v-if="selectedTable === 'Пользователи'" />
      <facts v-if="selectedTable === 'Факты'" />
      <event v-if="selectedTable === 'Мероприятия'" />
      <school v-if="selectedTable === 'Школы'" />
      <news v-if = "selectedTable === 'Новости'" />
      <direction v-if = "selectedTable === 'Направления(теги)'"></direction>
    </q-card-section>
  </q-card>
</template>

<script>
import Users from "../components/Users.vue";
import Roles from "../components/Roles.vue";
import Facts from "../components/Facts.vue";
import Event from "../components/Event.vue";
import School from "../components/School.vue";
import News from "../components/News.vue";
import Direction from "../components/Direction.vue";
import VueCookies from "vue-cookies";
export default {
  components: {
    Roles,
    Users,
    Facts,
    Event,
    School,
    News,
    Direction
  },
  data() {
    return {
      selectedTable: "",
    };
  },
  computed:{
    getOptions(){
      let roles = VueCookies.get('roles');
      if(roles.includes("ADMIN")){
        return ["Пользователи", "Факты", "Мероприятия", "Школы", "Новости", "Направления(теги)"];
      }
      if(roles.includes("MODERATOR")){
        return ["Факты", "Мероприятия", "Школы", "Новости", "Направления(теги)"];
      }
      return [];
    }
  }
};
</script>
<style scoped>
.block {
  margin-bottom: 24px;
}
</style>
