<template>
  <v-app class="body">
    <Navbar />
    <v-main>
      <v-container class="acc-container">
        <AccountMenu />
        <v-card>
          <v-row class="d-flex">
            <v-col class="hidden-md-and-down" :lg="rail === false ? '3' : '1'">
              <AccountDrawer v-model="drawer" @update-rail="UpdateRail" />
            </v-col>
            <v-col cols="12" :lg="rail === false ? '9' : '11'">
              <v-col cols="12">
                <v-card class="mb-5 mr-3" flat>
                  <div
                    class="mb-3 rounded-ts-xl rounded-be-xl"
                    style="background-color: #e3f2fd"
                  >
                    <v-icon class="ma-4" color="grey-darken-1">mdi-lock</v-icon>
                    <span style="color: #212121">Ganti Password</span>
                  </div>
                  <v-form ref="form">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="old_pass"
                          label="Kata Sandi Sebelumnya"
                          prepend-inner-icon="mdi-lock-question"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[Rules.Required]"
                          :type="show1 ? 'text' : 'password'"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="new_pass"
                          label="Kata Sandi Baru"
                          prepend-inner-icon="mdi-lock-alert"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[Rules.Required, Rules.Min]"
                          :type="show1 ? 'text' : 'password'"
                          hint="Minimal 8 karakter"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="conf_pass"
                          label="Konfirmasi Kata Sandi Baru"
                          prepend-inner-icon="mdi-lock-check"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[Rules.Required, Rules.Min]"
                          :type="show1 ? 'text' : 'password'"
                          hint="Minimal 8 karakter"
                          counter
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center mb-5">
                      <v-btn
                        prepend-icon="mdi-lock-reset"
                        color="orange-lighten-2"
                        @click="SubmitChange"
                      >
                        <span class="body">Ubah Kata Sandi</span>
                      </v-btn>
                    </v-row>
                  </v-form>
                </v-card>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
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
              <v-btn @click="Reload">Tutup</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
    <FooterApp />
  </v-app>
</template>

<script>
import Navbar from "../../components/Navbar.vue";
import FooterApp from "../../components/FooterApp.vue";
import AccountDrawer from "./AccountDrawer.vue";
import AccountMenu from "./AccountMenu.vue";
import func from "../../function";
import axios from "../../axios";

export default {
  name: "AccountApp",
  components: {
    Navbar,
    FooterApp,
    AccountDrawer,
    AccountMenu,
  },
  data: () => ({
    id: "",
    new_pass: "",
    old_pass: "",
    conf_pass: "",

    //dialog
    dialog: false,
    dialog_title: "",
    dialog_text: "",
    drawer: true,
    items: [
      { title: "Profil Saya", icon: "mdi-account-details", route: "profile" },
      { title: "Ganti Password", icon: "mdi-lock", route: "account" },
      {
        title: "Riwayat Polis",
        icon: "mdi-book-account",
        route: "policy-history",
      },
      {
        title: "Riwayat Claim",
        icon: "mdi-shield-airplane",
        route: "claim-history",
      },
      {
        title: "Riwayat Transaksi",
        icon: "mdi-cash-multiple",
        route: "transaction",
      },
    ],
    rail: false,
    show1: false,
    Rules: {
      Required: (value) => !!value || "Harus Diisi",
      Min: (v) => v.length >= 8 || "Min 8 karakter",
    },
  }),

  methods: {
    async ChangePass() {
      let formdata = {
        old_password: this.old_pass,
        new_password: this.new_pass,
      };
      try {
        const response = await axios.post("/change-pass", {
          ...formdata,
        });
        if (response.data.status) {
          this.DialogActive("Berhasil!", "Password Berhasil Diganti");
          setTimeout(() => {
            location.Reload();
          }, 2000);
        } else {
          this.DialogActive("Gagal Ganti Password");
        }
      } catch (error) {
        this.DialogActive("Gagal Ganti Password", error);
      }
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      if (title == "Berhasil!") {
        this.dialog_icon = "mdi-check-circle-outline";
        this.icon_color = "green";
      } else {
        this.dialog_icon = "mdi-alert-circle-outline";
        this.icon_color = "red";
      }
      this.dialog = true;
    },
    SubmitChange() {
      if (!this.$refs.form.validate()) {
        this.DialogActive("Input Data Salah", "Mohon input data sesuai format");
      } else if (this.new_pass != this.conf_pass) {
        this.DialogActive(
          "Input Data Salah",
          "Konfirmasi Kata Sandi tidak cocok"
        );
      } else {
        this.ChangePass();
      }
    },
    UpdateRail(value) {
      this.rail = value;
    },
    Reload() {
      location.reload();
    },
  },
};
</script>
