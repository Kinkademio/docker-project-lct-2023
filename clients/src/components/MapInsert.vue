<template>
  <q-card style="  position: absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  margin-bottom: 24px;">

<Map class="mapframe" :key="Date.now()"></Map>
</q-card>

</template>
<script>
import Map from '../components/Map.vue'
export default {
  components:{
    Map,
  }
}
</script>
<style scoped>
.mapframe{
  height: 90vh;
  position: relative;
  width: 100%;
}
</style>


