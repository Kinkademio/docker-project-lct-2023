<template>
  <div class="app">
    <q-card>
      <div class="row">
        <q-card-section class="col-5">
          <div class="main-card">
            <q-input v-model="text" label="Название" />
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />
            <q-input v-model="text" label="Ссылка на изображение" />
            <q-input v-model="text" label="Описание курса" />
          </div>
        </q-card-section>

        <q-card-section class="col">
          <div class="container">
            <q-card-section
              class="item"
              v-for="card in newCard"
              :key="card.name"
            >
              <div>
                <q-input readonly v-model="card.name" label="Название" />
                <iframe
                  width="270px"
                  height="200px"
                  :src="card.iframe"
                  frameborder="0"
                  >Ваш браузер не поддерживает плавающие фреймы!</iframe
                >
                <q-input
                  readonly
                  v-model="card.linkIframe"
                  label="Ссылка на iframe"
                />
                <q-input
                  readonly
                  v-model="card.descripthion"
                  label="Описание курса"
                />
              </div>
            </q-card-section>
            <q-card-section class="item">
              <q-btn icon="add" @click="icon = true" />
            </q-card-section>
          </div>
        </q-card-section>
      </div>
      <q-dialog v-model="icon">
        <div class="add-modal">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Добавление нового события</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <q-input v-model="newName" label="Название" />
              <q-input v-model="newIframe" label="iframe" />
              <q-input v-model="newlLnkIFrame" label="Ссылка на iframe" />
              <q-input v-model="newDescripthion" label="Описание" />
              <q-btn
                class="q-mt-md"
                label="Добавить"
                style="width: 100%; background-color: rgba(7, 7, 7, 0.05)"
                @click="addNewCard(), (icon = false)"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-dialog>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      text: ref(""),
      newCard: [
        {
          name: "",
          iframe: "",
          linkIframe: "",
          descripthion: "",
        },
      ],
      icon: ref(false),
    };
  },
  data() {
    return {
      newName: "",
      newIframe: "",
      newlLnkIFrame: "",
      newDescripthion: "",
    };
  },
  methods: {
    addNewCard() {
      this.newCard.push({
        name: this.newName,
        iframe: this.newIframe,
        linkIframe: this.newlLnkIFrame,
        descripthion: this.newDescripthion,
      });
      this.newName = "";
      this.newIframe = "";
      this.newlLnkIFrame = "";
      this.newDescripthion = "";
    },
  },
};
</script>

<style>
.main-card {
  width: 600px;
}

.container {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-between; */
}

.item {
  width: 300px;
  position: relative;
  box-shadow: inset 0 0 0 2px #9e9e9e;
}

.add-modal {
  width: 400px;
  height: 500px;
}
</style>
