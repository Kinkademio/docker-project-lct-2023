<template>
  <Bar></Bar>
</template>

<script>

import Bar from '../components/BarChart.vue';
export default {
  components: {
    Bar,
  },
  data() {
    return {
      username: "",
      text: "",
      regis: false,
    };
  },
  methods: {},
};
</script>
