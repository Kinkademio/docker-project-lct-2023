<template>
  <particles></particles>
  <authorization class="absolute-center"></authorization>
</template>

<script>
import Particles from "src/components/Particles.vue";
import Authorization from "../pages/Authorization.vue";

export default {
  components: {
    Authorization,
    Particles,
  },
};
</script>
<style scoped></style>
