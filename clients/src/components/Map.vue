<template>
  <div>
    <div id="map"></div>
    <q-dialog v-model="toolbar">
      <q-card class="map-card">
        <q-toolbar>
          <q-toolbar-title>
            <q-img :src="img" class="img q-mt-lg"></q-img>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <p>{{ nameSchool }}</p>
          <p>{{ addressStr }}</p>
          <p>Телефон школы : {{ phone }}</p>
          <p>Електронный адресс: {{ email }}</p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
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
      const marker = new mapglAPI.Marker(map, {
        coordinates: [37.62199313139937, 55.754172570006155],
      });
      // const clusterer = new Clusterer(map, {
      //   radius: 60,
      // });
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
        this.markers[i] = new mapglAPI.Marker(map, {
          coordinates: [
            this.rows[i].address.mapPos.x,
            this.rows[i].address.mapPos.y,
          ],
        });
        this.markers[i].on("click", (e) => {
          this.toolbar = true;
          this.nameSchool = this.rows[i].name;
          this.addressStr = this.rows[i].address.address_str;
          this.phone = this.rows[i].contacts.phone.value;
          this.email = this.rows[i].contacts.mail;
          this.img = this.rows[i].image_url;
        });
        // const clusterer = new Clusterer(map, {
        //   clusterStyle: {
        //     icon: "https://docs.2gis.com/img/mapgl/cluster.svg",
        //     hoverIcon: "https://docs.2gis.com/img/mapgl/clusterHover.svg",
        //     labelColor: "#ffffff",
        //     labelFontSize: 16,
        //   },
        // });
        // clusterer.load(this.markers[i]);
        // clusterer.load(this.markers);
      }
    },
  },
};
</script>

<style>
#map {
  width: 1920px;
  height: 1080px;
}

.map-card {
  position: relative;
  width: 312px;
  height: 437px;
}

.img {
  width: 312px;
  height: 198px;
  top: 0px;
}
</style>
