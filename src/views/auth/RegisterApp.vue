<template>
  <v-app class="body">
    <v-img :src="UploadIcon('../../assets/auth/', 'bg.png')" cover>
      <div class="d-flex justify-center" ref="logo">
        <v-card flat>
          <v-img
            :src="UploadIcon('../../assets/auth/', 'logo.png')"
            width="220px"
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
      <div class="d-flex justify-center" style="margin-top: -50px">
        <v-card
          class="form-regis d-flex flex-column align-center opacity-90"
          flat
          color="#E0E0E0"
        >
          <v-card-title style="font-size: x-large; font-weight: 600"
            >Register</v-card-title
          >
          <v-col cols="10">
            <v-form class="mb-5" v-model="form">
              <v-text-field
                v-model="form_data.name"
                :rules="[Required, RulesName]"
                label="Nama Panjang"
                flat
                variant="solo"
                density="comfortable"
              ></v-text-field>
              <v-text-field
                v-model="form_data.email"
                :rules="[Required, RulesEmail]"
                label="E-mail"
                flat
                variant="solo"
                density="comfortable"
              ></v-text-field>
              <v-text-field
                v-model="form_data.password"
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[Required, RulesPass]"
                :type="show1 ? 'text' : 'password'"
                label="Password"
                hint="Minimal 8 karakter"
                counter
                @click:append-inner="show1 = !show1"
                flat
                variant="solo"
                density="comfortable"
              ></v-text-field>
              <v-text-field
                v-model="form_data.conf_pass"
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[Required, RulesPass]"
                :type="show1 ? 'text' : 'password'"
                label="Konfirmasi Password"
                hint="Minimal 8 karakter"
                counter
                @click:append-inner="show1 = !show1"
                flat
                variant="solo"
                density="comfortable"
              ></v-text-field>
              <div class="text-center mt-1">
                <span class="mr-1" style="font-size: 14px; margin-top: 1px"
                  >Sudah Punya Akun?</span
                >
                <router-link to="/login">
                  <a href="#" style="font-size: 14px">Login</a>
                </router-link>
              </div>
              <div class="text-center">
                <v-btn
                  rounded
                  color="#F57C00"
                  class="mt-5"
                  @click="ValidateForm"
                >
                  <span style="color: aliceblue; font-weight: 600"
                    >Register</span
                  >
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
import axios from "axios";
// import func from "../function";

export default {
  name: "RegisterApp",
  data() {
    return {
      show1: false,
      recaptcha: null,
      check_register: false,

      //dialog
      dialog: false,
      dialog_title: "",
      dialog_text: "",
      dialog_icon: "",
      icon_color: "",

      //form data
      form_data: {
        name: "",
        email: "",
        password: "",
        conf_pass: "",
      },

      clouds: [
        { top: "-30px", left: "300px" },
        { top: "50px", left: "0px" },
        { top: "100px", left: "600px" },
      ],

      //form rules
      Required: (v) => !!v || "Harus Diisi",
      RulesName: (v) =>
        /^[a-zA-Z\s]*$/.test(v) || "Tidak boleh ada simbol atau angka",
      RulesEmail: (v) => /.+@.+\..+/.test(v) || "Format email tidak valid",
      RulesPass: (v) => v.length >= 8 || "Min 8 karakter",
    };
  },

  methods: {
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
    MxVerify(response) {
      this.recaptcha = response;
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      if (title == "Register Berhasil") {
        this.dialog_icon = "mdi-check-circle-outline";
        this.icon_color = "green";
      } else {
        this.dialog_icon = "mdi-alert-circle-outline";
        this.icon_color = "red";
      }
      this.dialog = true;
    },
    ValidateForm() {
      if (!this.form) {
        this.DialogActive("Gagal Login", "Input Data Salah");
      } else if (this.form_data.conf_pass != this.form_data.password) {
        this.DialogActive("Gagal Login", "Password Belum Sesuai");
      } else {
        this.ProcessRegister(
          this.form_data.name,
          this.form_data.email,
          this.form_data.password
        );
      }
    },
    CloseDialog() {
      if (this.check_register) {
        this.$router.push("/login");
      } else {
        this.dialog = false;
      }
    },

    //Register
    async ProcessRegister(usersname, usersemail, userspassword) {
      let formdata = {
        name: usersname,
        email: usersemail,
        password: userspassword,
      };
      try {
        const response = await axios.post(
          "http://localhost:9000/register",
          formdata,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let feedback = response.data;
        if (feedback.status === true) {
          this.DialogActive(
            "Register Berhasil",
            "Cek Email Untuk Verifikasi Akun!"
          );
        } else {
          this.DialogActive("Register Gagal", feedback.message);
        }
      } catch (e) {
        this.DialogActive("Register Gagal", e);
        console.log(e);
      }
    },
  },

  mounted() {
    const cloud = this.$refs.cloud;
    const screenwidth = window.innerWidth;
    gsap.to(cloud, {
      x: screenwidth,
      ease: Power0.easeNone,
      duration: 10,
      onComplete: () => {
        gsap.set(cloud, { x: "-700px" });
        gsap.to(cloud, {
          x: screenwidth,
          ease: Power0.easeNone,
          duration: 12,
          repeat: -1,
        });
      },
    });

    //logo animation
    gsap.fromTo(this.$refs.logo, { y: "-100%" }, { y: "0%", duration: 2 });
  },
};
</script>

<style scoped>
.form-regis {
  width: 400px;
  min-height: 380px;
  margin-top: 50px;
}

@media screen and (max-width: 600px) {
  .form-regis {
    width: 325px;
  }
}
</style>
