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
            <v-col
              class="form-profile"
              cols="12"
              :lg="rail === false ? '9' : '11'"
            >
              <v-col cols="12" sm="3">
                <div
                  class="mb-3 rounded-ts-xl rounded-be-xl"
                  style="background-color: #e3f2fd"
                >
                  <v-icon class="ma-4" color="grey-darken-1"
                    >mdi-account-circle</v-icon
                  >
                  <span style="color: #212121">Foto Profil</span>
                </div>
                <input
                  type="file"
                  ref="avatar"
                  @change="UploadAvatar"
                  accept="image/*"
                  style="display: none"
                />
                <div class="d-flex flex-column align-center mb-3">
                  <v-hover>
                    <template v-slot="{ isHovering, props }">
                      <v-avatar
                        v-bind="props"
                        size="150"
                        @click="Upload"
                        :color="isHovering ? '#E0E0E0' : '#EEEEEE'"
                        :class="isHovering ? 'opacity-90' : ''"
                      >
                        <v-img
                          :src="profile.avatar_url"
                          v-if="profile.avatar !== ''"
                          :class="isHovering ? 'opacity-90' : ''"
                        ></v-img>
                        <span v-if="profile.avatar === ''"
                          >Unggah Foto Profil</span
                        >
                      </v-avatar>
                    </template>
                  </v-hover>
                  <v-chip
                    class="mt-2"
                    v-if="profile.avatar !== ''"
                    @click="
                      (chip1 = false),
                        (profile.avatar = ''),
                        (profile.avatar_url = 'delete')
                    "
                    >Hapus Foto
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12" sm="9">
                <v-card class="mb-5 mr-3" flat>
                  <div
                    class="mb-3 rounded-ts-xl rounded-be-xl"
                    style="background-color: #e3f2fd"
                  >
                    <v-icon class="ma-4" color="grey-darken-1"
                      >mdi-account</v-icon
                    >
                    <span style="color: #212121">Data Diri</span>
                  </div>
                  <v-form ref="form">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="profile.fullname"
                          label="Nama Lengkap"
                          prepend-inner-icon="mdi-badge-account"
                          :rules="[OnlyAlphabet]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="profile.birthplace"
                          label="Tempat Lahir"
                          prepend-inner-icon="mdi-map-marker"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-menu
                          v-model="date_picker"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ props }">
                            <v-text-field
                              v-model="formatted_date"
                              label="Tanggal Lahir"
                              prepend-inner-icon="mdi-calendar"
                              v-bind="props"
                              readonly
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :max="todaydate"
                            v-model="selected_date"
                            @update:model-value="
                              (value) =>
                                UpdateDate(
                                  'profile',
                                  'birthdate',
                                  'date_picker',
                                  value
                                )
                            "
                            class="body"
                            color="#001F48"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          :items="genders"
                          v-model="profile.gender"
                          label="Jenis Kelamin"
                          prepend-inner-icon="mdi-gender-male-female"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="profile.phone"
                          label="Nomor Telepon"
                          prepend-inner-icon="mdi-cellphone"
                          :rules="[OnlyNumbers]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          readonly
                          v-model="email"
                          label="Email"
                          prepend-inner-icon="mdi-email"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="profile.address"
                          label="Alamat Lengkap"
                          prepend-inner-icon="mdi-map-marker"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row justify="center mb-5">
                      <v-btn
                        prepend-icon="mdi-pen"
                        color="orange-lighten-2"
                        @click="UpdateProfile"
                      >
                        <span class="body">Ubah Data Diri</span>
                      </v-btn></v-row
                    >
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
              <v-btn @click="CloseDialog">Tutup</v-btn>
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
  name: "ProfileApp",
  components: {
    Navbar,
    FooterApp,
    AccountDrawer,
    AccountMenu,
  },
  data: () => ({
    chip1: true,

    //dialog
    dialog: false,
    dialog_title: "",
    dialog_text: "",

    //form rules
    OnlyAlphabet: (v) =>
      /^[a-zA-Z\s]*$/.test(v) || "Tidak boleh ada simbol atau angka",
    OnlyNumbers: (v) =>
      /^[+\d]+$/.test(v) || "Tidak boleh ada simbol atau alfabet",
    todaydate: new Date().toISOString().split("T")[0],

    //form data
    profile: {
      name: "",
      birthplace: "",
      birthdate: "",
      gender: null,
      phone: "",
      address: "",
      avatar_url: "",
      avatar: "",
    },
    avatar: "",
    email: "",
    genders: ["Laki-laki", "Perempuan"],
    date_picker: false,
    selected_date: null,

    //Navbar
    drawer: true,
    rail: false,
  }),

  created() {
    this.GetProfile();
  },

  computed: {
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, "simple")
        : "";
    },
  },
  methods: {
    async GetProfile() {
      try {
        const response = await axios.get("/profile");
        if (response.data.status) {
          this.profile.fullname = response.data.data.name;
          this.profile.gender = func.GenderFormat(response.data.data.gender);
          this.profile.phone = response.data.data.phone;
          this.email = response.data.data.email;
          this.profile.birthplace = response.data.data.birthplace;
          this.profile.birthdate = response.data.data.birthdate;
          this.profile.avatar_url = response.data.data.image;
          this.profile.avatar = response.data.data.image_name;
          this.profile.address = response.data.data.address;

          if (
            response.data.data.birthdate !== undefined &&
            response.data.data.birthdate !== ""
          )
            this.selected_date = new Date(response.data.data.birthdate);
        } else {
          this.DialogActive("Gagal Mendapat Data Dirii");
        }
      } catch (error) {
        this.DialogActive("Gagal Mendapat Data Diri", error);
      }
    },
    async UpdateProfile() {
      const gender = func.GenderFormat(this.profile.gender);
      var avatarurl;
      if (this.profile.avatar instanceof File) {
        avatarurl = this.profile.avatar_url.replace(/^.+?base64,/, "");
      } else if (this.profile.avatar_url == "delete") {
        avatarurl = "delete";
      } else {
        avatarurl = "";
      }
      let formdata = {
        name: this.profile.fullname,
        gender: gender,
        phone: this.profile.phone,
        birthplace: this.profile.birthplace,
        birthdate: this.profile.birthdate,
        address: this.profile.address,
        image: avatarurl,
      };
      try {
        const response = await axios.put("/profile", {
          ...formdata,
        });
        if (response.data.status) {
          this.DialogActive("Berhasil!", "Data Diri Berhasil Diupdate");
          setTimeout(() => {
            location.Reload();
          }, 2000);
        } else {
          this.DialogActive("Gagal Update Data");
        }
      } catch (error) {
        this.DialogActive("Gagal Update Data", error);
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
    CloseDialog() {
      if (!this.$refs.form.validate()) {
        this.dialog = false;
      } else {
        location.reload();
      }
    },
    SubmitUpdate() {
      if (!this.$refs.form.validate()) {
        this.DialogActive("Input Data Salah", "Mohon input data sesuai format");
      } else {
        this.UpdateProfile();
      }
    },
    Upload() {
      this.$refs.avatar.click();
    },
    UploadAvatar() {
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.profile.avatar_url = e.target.result;
        };
        this.profile.avatar = input.files[0];
        reader.readAsDataURL(input.files[0]);
        this.chip1 = true;
      }
    },
    UpdateDate(formKey, dateKey, menuKey, value) {
      this[formKey][dateKey] = func.FormatDate(value);
      this[menuKey] = false;
    },
    UpdateRail(value) {
      this.rail = value;
    },
    FormatDate(date) {
      return func.FormatOutputDate(date, "simple", "api");
    },
  },
};
</script>

<style>
.form-profile {
  display: flex;
}

@media screen and (max-width: 600px) {
  .form-profile {
    display: block;
  }
}

.acc-container {
  margin-top: 15px !important;
}
</style>
