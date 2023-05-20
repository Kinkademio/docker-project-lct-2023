<template>
  <q-card>
    <q-card-section v-if="!sendProcessStart">
      <q-form class="q-px-md q-py-md my-card">
        <q-input v-model="username" label="Имя пользователя" />
        <q-input v-model="theme" label="Тема обращения" />
        <q-input v-model="text" type="textarea" label="Ваши вопросы и предложения" />
        <div class="row q-pt-lg justify-end">
          <q-btn flat class="button" @click="sendMail" label="Отправить" />
        </div>
      </q-form>
    </q-card-section>

    <q-card-section v-if="sendProcessStart && showSpinner">
      <div class="text-center">
        <q-spinner-gears size="100px" color="primary"></q-spinner-gears>
        <div>Идет отправка сообщения</div>
      </div>
    </q-card-section>
    <q-card-section v-if="sendProcessStart && !showSpinner">
      <div class="text-center">
        <img class="img" src="../resources/Доставкаписемv2.svg">
        <div class="text-h4 " style="opacity: 0.5">{{ this.sendResult }}</div>
        <q-btn class="text-h6 button" style="opacity: 0.5" unelevated @click="semdMore"
          label="Отправить еще одно обращение" no-caps />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { api } from "../boot/axios";

export default {
  data() {
    return {
      sendProcessStart: false,
      theme: "",
      username: "",
      text: "",
      show: false,
      showSpinner: false,
      sendResult: "",
      auth: '12GradMapAdmin345SRscx:23pdmtF334slkRDcS5EREc2',
    };
  },
  methods: {
    clearForm() {
      this.theme = "";
      this.text = "";
      this.username = "";
    },
    semdMore() {
      this.sendProcessStart = false;
      this.clearForm();
    },
    showModal() {
      this.show = true;
      this.showSpinner = true;
      setTimeout(() => {
        this.showSpinner = false;
        this.message = "Ваше сообщение успешно отпправлено!";
        setTimeout(() => {
          this.show = false;
          this.message = "";
        }, 2000);
      }, 3000);
    },
    async sendMail() {

      if (this.username == "") {
        this.$q.notify({
          type: 'negative',
          message: 'Вы не ввели свою контактрую информацию'
        })
        return;
      }
      if (this.theme == "") {
        this.$q.notify({
          type: 'negative',
          message: 'Вы не ввели тему обращения'
        })
        return;
      }
      if (this.message == "") {
        this.$q.notify({
          type: 'negative',
          message: 'Вы не текст сообщения'
        })
        return;
      }
      try {
        this.showSpinner = true;
        this.sendProcessStart = true;
        const res = await api.post("api/mail/send", {
          email: this.username,
          subject: this.theme,
          message: this.text
        },
          {
            headers: {
              'Authorization': 'Basic ' + btoa(this.auth),
              'x-requested-with': '*'
            }
          }
        );
        this.showSpinner = false;
        this.sendResult = 'Доставкой вашего письма занимается наш самый ответственный сотрудик!';
      } catch (error) {
        this.showSpinner = false;
        this.sendResult = 'При отправке сообщения возникла ошибка.'
      }
    }
  },

};
</script>
<style scoped>
.button {
  background-color: rgba(7, 7, 7, 0.050);
}

.img {
  height: 70vh;
}
</style>
