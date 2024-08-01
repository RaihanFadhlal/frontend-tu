<template>
  <v-app class="body">
    <v-img :src="UploadIcon('../../assets/auth/', 'bg.png')" cover>
      <div ref="alert">
        <v-alert
          v-if="show_alert"
          class="alert mt-3 ml-3"
          shaped
          type="success"
          width="300"
          style="position: absolute"
        >
          Email berhasil diverifikasi!
        </v-alert>
      </div>
      <div ref="logo" class="d-flex justify-center mt-5">
        <v-card flat>
          <v-img
            :src="UploadIcon('../../assets/auth/', 'logo.png')"
            width="250px"
          ></v-img>
        </v-card>
      </div>
      <div ref="cloud" class="position-absolute">
        <v-img
          v-for="(cloud, i) in clouds"
          :key="i"
          :src="UploadIcon('../../assets/auth/', 'cloud.png')"
          :style="{
            top: cloud.top,
            left: cloud.left,
            width: '120px',
          }"
        ></v-img>
      </div>
      <div class="d-flex justify-center">
        <v-card
          class="form-login d-flex flex-column align-center opacity-90"
          flat
          rounded
          color="#E0E0E0"
        >
          <v-card-title style="font-size: x-large; font-weight: 600"
            >Login</v-card-title
          >
          <v-col cols="10">
            <v-form class="mb-5" v-model="form">
              <v-text-field
                class="mb-2"
                v-model="form_data.email"
                :rules="[Required]"
                label="ID"
                flat
                variant="solo"
                density="comfortable"
              ></v-text-field>
              <v-text-field
                v-model="form_data.password"
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[Required]"
                :type="show1 ? 'text' : 'password'"
                label="Password"
                hint="Minimal 8 karakter"
                counter
                @click:append-inner="show1 = !show1"
                flat
                variant="solo"
                density="comfortable"
              ></v-text-field>
              <div class="mt-2 text-center">
                <span class="mr-1" style="font-size: 14px; margin-top: 1px"
                  >Belum Punya Akun?</span
                >
                <router-link to="/register">
                  <a style="font-size: 14px" href="#">Register</a>
                </router-link>
              </div>
              <div class="text-center">
                <v-btn
                  rounded
                  color="#F57C00"
                  class="mt-5"
                  @click="ValidateForm"
                >
                  <span style="color: aliceblue; font-weight: 600">Login</span>
                </v-btn>
              </div>
            </v-form>
          </v-col>
        </v-card>
      </div>
      <!-- Dialog -->
      <v-dialog persistent v-model="dialog" max-width="400px">
        <v-card class="body">
          <v-card-title class="font-weight-bold mt-2"
            ><v-icon class="mr-2 mb-1" left :style="{ color: icon_color }">{{
              dialog_icon
            }}</v-icon
            >{{ dialog_title }}</v-card-title
          >
          <v-card-text class="pt-1 ml-4" style="font-size: large">
            {{ dialog_text }}
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn @click="CloseDialog">Tutup</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-img>
  </v-app>
</template>

<script>
import { gsap, Power0 } from "gsap";
import { mapActions } from "vuex";
// import func from "../function";

export default {
  name: "LoginApp",
  data() {
    return {
      show1: false,
      recaptcha: null,

      //dialog
      dialog: false,
      dialog_title: "",
      dialog_text: "",
      dialog_icon: "",
      icon_color: "red",

      show_alert: false,

      //form login
      form_data: {
        email: "",
        password: "",
      },

      Required: (value) => !!value || "Harus Diisi",
      clouds: [
        { top: "-30px", left: "300px" },
        { top: "50px", left: "0px" },
        { top: "100px", left: "600px" },
      ],
    };
  },

  methods: {
    ...mapActions(["login"]),
    async ProcessLogin(email, pass) {
      let formdata = {
        email: email,
        password: pass,
      };
      try {
        const response = await this.$store.dispatch("login", formdata);
        if (response.status) {
          this.DialogActive("Login Berhasil");
          setTimeout(() => {
            this.$router.push("/");
          }, 1000);
        } else {
          this.DialogActive("Login Gagal", response.message);
        }
      } catch (e) {
        this.DialogActive(
          "Login Gagal",
          "Kredensial salah atau server bermasalah"
        );
      }
    },
    ValidateForm() {
      if (!this.form) {
        this.DialogActive("Input Data Salah", "Mohon isi form dengan benar!");
      } else {
        this.ProcessLogin(this.form_data.email, this.form_data.password);
      }
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      if (title == "Login Berhasil") {
        this.dialog_icon = "mdi-check-circle-outline";
        this.icon_color = "green";
      } else {
        this.dialog_icon = "mdi-alert-circle-outline";
        this.icon_color = "red";
      }
      this.dialog = true;
    },
    CloseDialog() {
      if (this.check_login) {
        this.$router.push("/");
      } else {
        this.dialog = false;
      }
    },
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
  },

  created() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("verified") && urlParams.get("verified") === "true") {
      this.show_alert = true;
      setTimeout(() => {
        this.show_alert = false;
      }, 5000);
    }
  },
  mounted() {
    const cloud = this.$refs.cloud;
    const screenwidth = window.innerWidth;

    gsap.to(cloud, {
      x: screenwidth,
      ease: Power0.easeNone,
      duration: 10,
      onComplete: () => {
        gsap.set(cloud, { x: '-700px' });
        gsap.to(cloud, {
          x: screenwidth,
          ease: Power0.easeNone,
          duration: 12,
          repeat: -1,
        });
      },
    });

    gsap.fromTo(this.$refs.logo, { y: "-100%" }, { y: "0%", duration: 2 });

    if (this.show_alert) {
      gsap.fromTo(this.$refs.alert, { x: -300 }, { x: 0, duration: 2 });
      setTimeout(() => {
        gsap.to(this.$refs.alert, { x: 300, duration: 1 });
        setTimeout(() => {
          this.show_alert = false;
        }, 1000);
      }, 5000);
    }
  },
};
</script>

<style scoped>
.form-login {
  width: 400px;
}

@media screen and (max-width: 600px) {
  .form-login {
    width: 325px;
  }
}
</style>
