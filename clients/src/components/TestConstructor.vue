<template>
  <div class="app">
    <q-card>
      <div class="row">
        <q-card-section class="col-0.8 q-pr-none">
          <div class="main-card">
            <q-input v-model="text" label="Название" />
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />
            <q-input v-model="text" label="Ссылка на изображение" />
            <q-input v-model="text" label="Описание курса" />
          </div>
        </q-card-section>
        <q-card-section class="col">
          <q-card-section>
            <div class="row">
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
            </div>
            <div class="row">
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
              <q-card-section class="col-0.5">
                <div class="add-card">
                  <q-input v-model="text" label="Название" />
                  <iframe src="" frameborder="0"></iframe>
                  <q-input v-model="text" label="Ссылка на изображение" />
                  <q-input v-model="text" label="Описание курса" /></div
              ></q-card-section>
            </div>
          </q-card-section>
        </q-card-section>
      </div>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      text: ref(""),
    };
  },
};
</script>

<style>
.main-card {
  width: 500px;
}

.add-card {
  width: 200px;
}
</style>
