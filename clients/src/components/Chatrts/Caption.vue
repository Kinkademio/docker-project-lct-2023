<template>
  <q-card-section>
    <div class="text-h5" style="display: inline-block; vertical-align: middle;">{{ title }}</div>
    <div style="display: inline-block;">
      <q-icon size="24px" color="grey-8" style="margin-left: 10px;" :name="iconName" />
    </div>
  </q-card-section>
</template>
<script>
export default {
  props: {
    title: String,
    iconName: String,
  },
  data() {
    return {

    };
  },
}
</script>
