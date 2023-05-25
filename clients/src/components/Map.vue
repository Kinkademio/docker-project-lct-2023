<template>
    <div id="map"></div>
    <q-dialog v-model="toolbar">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-img :src="img"></q-img>

        <q-card-section>
          <div class="row no-wrap items-center">
            <div v-if="nameSchool" class="col text-h6 ellipsis">
              {{ nameSchool }}
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div v-if="addressStr" >
            {{ addressStr }}
          </div>
          <div v-if="phone" >
            Телефон школы :  <div v-for="one in phone">{{ one.value }}</div>
          </div>
          <div v-if="email" >
            E-mail: {{ email }}
          </div>
        </q-card-section>
        <q-expansion-item  dence label="Описание">
          <q-card>
            <q-card-section>
              {{ description }}
            </q-card-section>
          </q-card>
        </q-expansion-item>

      </q-card>
    </q-dialog>
</template>

<script>
import { load } from "@2gis/mapgl";
import { api } from "../boot/axios";
import { ref } from "vue";
import { Clusterer } from "@2gis/mapgl-clusterer";

export default {
  setup() {
    return {
      toolbar: ref(false),
    };
  },
  data() {
    return {
      auth: "12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2",
      rows: [],
      nameSchool: "",
      addressStr: "",
      phone: "",
      email: "",
      img: "",
      description: "",
      markers: [],
    };
  },
  mounted() {
    this.mapOpen();
  },
  methods: {
    async mapOpen() {
      const mapglAPI = await load();

      // container — id of the div element in your html
      const map = new mapglAPI.Map("map", {
        center: [37.62199313139937, 55.754172570006155],
        zoom: 18,
        key: "042b5b75-f847-4f2a-b695-b5f58adc9dfd",
      });
      const clusterer = new Clusterer(map, {
        clusterStyle: {
             icon: "https://docs.2gis.com/img/mapgl/cluster.svg",
            hoverIcon: "https://docs.2gis.com/img/mapgl/clusterHover.svg",
            labelColor: "#ffffff",
           labelFontSize: 16,
           },
      });
      try {
        const res = await api.get("api/school", {
          headers: {
            Authorization: "Basic " + btoa(this.auth),
            "x-requested-with": "*",
          },
        });
        this.rows = res.data;
      } catch (error) {
        console.log(error);
      }
      for (let i = 0; i < this.rows.length; i++) {
        this.markers[i] = {
          coordinates: [
            this.rows[i].address.mapPos.x,
            this.rows[i].address.mapPos.y,
          ],
          id: i,
        };
      }
      clusterer.load(this.markers);
      clusterer.on('click', (event) => {

        console.log(event)
        if(event.target.type=="marker"){
          console.log(event)
          let i = event.target.data.id;
          this.toolbar = true;
          this.nameSchool = this.rows[i].name;
          this.addressStr = this.rows[i].address.address_str;
          this.phone = this.rows[i].contacts.phone.value;
          this.email = this.rows[i].contacts.mail;
          this.img = this.rows[i].image_url;
          this.description = this.rows[i].description;
        }else{
          map.setCenter(event.lngLat);
          map.setZoom(map.getZoom() + 2);
        }
      });
    },
  },
};
</script>

<style scoped>

#q-app{
  position: relative;
  height: 100%;
  width: 100%;
}
#map {
position: relative;
height: 100%;
width: 100%;
min-height: 100%;
}

</style>
