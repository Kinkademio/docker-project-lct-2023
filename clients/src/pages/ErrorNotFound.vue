<template>
  <particles></particles>
  <div class="text-white text-center">
    <div class="absolute-center">
      <img class="image" src="../resources/404безошибкиcпузырями.svg" />
      <div class="text-h2 transparent-text">
        Станица, которую вы ищете <br />
        не существует.
      </div>
      <q-btn
        class="q-mt-sm text-h6 transparent-text"
        text-color="white"
        unelevated
        to="/"
        label="Вернуться на главную"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import Particles from "src/components/Particles.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
  components: { Particles },
});
</script>
<style scoped>
.errorText {
  font-size: 50vh;
  z-index: -1;
}

.image {
  height: 50vh;
  width: 50vh;
}

.transparent-text {
  opacity: 0.6;
}
</style>
