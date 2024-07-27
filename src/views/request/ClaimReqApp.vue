<template>
  <v-app>
    <v-stepper v-model="e1" class="body" :mobile="$vuetify.display.xs">
      <v-stepper-header>
        <v-stepper-item
          title="Pilih Polis"
          value="1"
          color="001F48"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          title="Form Klaim"
          value="2"
          color="001F48"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          title="Konfirmasi"
          value="3"
          color="001F48"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="1">
          <v-card class="full-height mt-15" flat>
            <v-row class="mb-4 mb-sm-2 ml-sm-1">
              <v-icon class="mt-5 mr-2 ml-3" color="#001F48"
                >mdi-book-clock</v-icon
              >
              <span class="blue-text mt-5">Riwayat Polis</span>
            </v-row>
            <v-dialog v-model="dialog_policy" persistent max-width="700">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="my-2 ml-2"
                  v-bind="props"
                  style="font-weight: 600"
                >
                  <v-icon left class="mr-2">mdi-book-search</v-icon>
                  Cari Polis
                </v-btn>
              </template>
              <v-card class="body pt-5">
                <v-card-text>
                  <div
                    style="
                      font-weight: bold;
                      font-size: large;
                      text-align: center;
                      margin-bottom: 30px;
                      color: #001f48;
                    "
                  >
                    <v-icon left class="mr-2 mb-1" color="#001F48"
                      >mdi-book-search</v-icon
                    >
                    Cari Polis
                  </div>
                  <v-form class="body">
                    <v-row justify="center">
                      <v-col cols="12" sm="6" md="5" class="py-0">
                        <v-text-field
                          variant="outlined"
                          v-model="form_search.policy_no"
                          label="Nomor Polis"
                          clearable
                          color="#001F48"
                          prepend-inner-icon="mdi-book-information-variant"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="5" class="py-0">
                        <v-select
                          variant="outlined"
                          v-model="form_search.product"
                          label="Produk"
                          clearable
                          :items="products"
                          color="#001F48"
                          prepend-inner-icon="mdi-map"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="5" class="py-0">
                        <v-select
                          variant="outlined"
                          v-model="form_search.destination"
                          label="Destinasi"
                          clearable
                          :items="country"
                          color="#001F48"
                          prepend-inner-icon="mdi-map-marker"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="5" class="py-0">
                        <v-menu
                          v-model="date_search"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ props }">
                            <v-text-field
                              v-model="formatted_date_search"
                              label="Tanggal Berangkat"
                              prepend-inner-icon="mdi-calendar"
                              v-bind="props"
                              variant="outlined"
                              readonly
                              :rules="[Required]"
                              color="#001F48"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="selected_date_search"
                            :max="todaydate"
                            @update:model-value="
                              (value) =>
                                UpdateDate(
                                  'form_search',
                                  'date_start',
                                  'date_search',
                                  value
                                )
                            "
                            class="body"
                            color="#001F48"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-btn color="#F57C00" @click="">
                        <v-text style="color: aliceblue">Cari</v-text>
                      </v-btn>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions class="pt-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    class="font-weight-bold"
                    color="#001F48"
                    text
                    @click="dialog_policy = false"
                  >
                    Tutup
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-table class="hidden-xs-only">
              <thead>
                <tr>
                  <th class="hidden-xs-only">Nomor Polis</th>
                  <th>Produk</th>
                  <th class="hidden-sm-and-down">Jenis Kontribusi</th>
                  <th class="hidden-sm-and-down">Destinasi</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in policies" :key="item.policy_no">
                  <td>{{ item.policy_no }}</td>
                  <td>{{ item.product }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.destination }}</td>
                  <td>
                    {{
                      FormatDate(item.sdate) + " - " + FormatDate(item.edate)
                    }}
                  </td>
                  <td>
                    <v-btn class="ma-1 orange font-weight-bold" @click=""
                      >Detail</v-btn
                    >
                    <v-btn
                      class="ma-1 white--text font-weight-bold"
                      color="#001F48"
                      @click="
                        SelectPolicy(
                          item.policy_no,
                          item.product,
                          item.type,
                          item.destination,
                          item.sdate,
                          item.edate
                        )
                      "
                      >Pilih</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-chip class="ma-3" color="#001F48" text-color="white">
              <v-icon left> mdi-book </v-icon>
              {{ "Polis : " + policy }}
            </v-chip>
            <div class="ml-3 mt-3">
              <router-link to="/">
                <v-btn class="mr-2"> Batal </v-btn>
              </router-link>
              <v-btn color="orange" @click="e1 = 1"> Selanjutnya </v-btn>
            </div>
          </v-card>
        </v-stepper-window-item>
        <v-stepper-window-item value="2">
          <v-card class="d-flex">
            <ClaimStep />
            <v-col cols="12" sm="9">
              <v-row class="mt-14 mb-3">
                <v-icon class="mr-2 mb-2 ml-3" color="#001F48"
                  >mdi-shield-edit</v-icon
                >
                <span class="blue-text">Detail Klaim</span>
              </v-row>
              <v-form ref="form" class="body">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-menu
                      v-model="date_picker1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-model="date_acc_value"
                          label="Tanggal Kejadian"
                          prepend-inner-icon="mdi-calendar"
                          v-bind="props"
                          variant="outlined"
                          readonly
                          :rules="[Required]"
                          color="#001F48"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="selected_date"
                        :min="todaydate"
                        @update:model-value="
                          (value) =>
                            UpdateDate(
                              'form_data',
                              'date_acc',
                              'date_picker1',
                              value
                            )
                        "
                        class="body"
                        color="#001F48"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="date_rep_value"
                      label="Tanggal Laporan"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.location"
                      label="Lokasi"
                      clearable
                      prepend-inner-icon="mdi-map-marker"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-textarea
                      variant="outlined"
                      v-model="form_data.detail"
                      label="Kronologi"
                      prepend-inner-icon="mdi-playlist-edit"
                      color="#001F48"
                      :rules="[Required]"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row class="ma-3">
                  <v-btn class="mr-2" @click="e1 = 0"> Batal </v-btn>
                  <v-btn color="orange" @click="CheckForm"> Selanjutnya </v-btn>
                </v-row>
              </v-form>
            </v-col>
          </v-card>
        </v-stepper-window-item>

        <v-stepper-window-item value="3">
          <v-card class="d-flex">
            <ClaimStep />
            <v-col cols="12" sm="9">
              <v-row class="mt-14 mb-3" justify="center">
                <v-icon class="mr-2 mb-2 ml-3" color="#001F48"
                  >mdi-book-check</v-icon
                >
                <span class="blue-text">Konfirmasi Data Pengajuan Klaim</span>
              </v-row>
              <v-row class="mt-7 mb-3">
                <v-icon class="mr-2 mb-2 ml-3" color="#001F48"
                  >mdi-shield-edit</v-icon
                >
                <span class="blue-text">Detail Klaim</span>
              </v-row>
              <v-form class="body">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="date_acc_value"
                      label="Tanggal Kejadian"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="date_rep_value"
                      label="Tanggal Laporan"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.location"
                      label="Lokasi"
                      readonly
                      prepend-inner-icon="mdi-map-marker"
                      color="#001F48"
                    ></v-text-field
                  ></v-col>
                  <v-col>
                    <v-textarea
                      variant="outlined"
                      v-model="form_data.detail"
                      label="Kronologi"
                      readonly
                      prepend-inner-icon="mdi-playlist-edit"
                      color="#001F48"
                    ></v-textarea
                  ></v-col>
                </v-row>
                <v-row class="mt-7 mb-3">
                  <v-icon class="mr-2 mb-2 ml-3" color="#001F48"
                    >mdi-book-edit</v-icon
                  >
                  <span class="blue-text">Detail Polis</span>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="policy"
                      label="Nomor Polis"
                      prepend-inner-icon="mdi-book-information-variant"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="product"
                      label="Produk"
                      prepend-inner-icon="mdi-map"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="contribution"
                      label="Kontribusi"
                      prepend-inner-icon="mdi-map-marker"
                      color="#001F48"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="destination"
                      label="Destinasi"
                      prepend-inner-icon="mdi-map-marker"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="date_start_value"
                      label="Tanggal Berangkat"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="date_end_value"
                      label="Tanggal Berangkat"
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
              <v-row class="ma-3">
                  <v-btn class="mr-2" style="font-weight: 600" @click="e1 = 1"> Batal </v-btn>
                  <v-btn color="orange" @click="CheckForm"> Selanjutnya </v-btn>
                </v-row>
            </v-col>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      class="body"
      color="#FFFFFF"
    >
      {{ text }}
      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog persistent v-model="dialog_err" max-width="400px">
      <v-card class="body">
        <v-card-title class="font-weight-bold mt-2"
          ><v-icon class="mr-2 mb-1" left color="red"
            >mdi-alert-circle-outline</v-icon
          >{{ dialog_title }}</v-card-title
        >
        <v-card-text class="pt-1 ml-4" style="font-size: large">
          {{ dialog_text }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="dialog_err = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import func from "../../function";
import ClaimStep from "./ClaimStep.vue";

export default {
  name: "RequestApp",
  components: {
    ClaimStep,
  },
  data: () => {
    return {
      e1: 0,
      policy: "",
      product: "",
      contribution: "",
      destination: "",
      sdate: "",
      edate: "",

      date_picker1: false,
      date_search: false,
      selected_date: null,
      selected_date_search: null,

      product: "Takaful Safari Umroh dan Haji Khusus",
      product_id: "",
      products: [
        "Takaful Safari Umroh Plus Covid New Normal",
        "Takaful Safari Umroh Afdhol",
        "Takaful Safari Umroh dan Haji Khusus",
        "Takaful Safari Multitrip",
        "Takaful Safari Umroh Non Covid (50 Ribu)",
        "Takaful Safari Umroh Non Covid (Plus Zam Zam)",
      ],

      form_search: {
        policy_no: "",
        product: "",
        destination: "",
        date_start: "",
      },

      //data form
      form_data: {
        date_acc: "",
        location: "",
        detail: "",
        date_rep: new Date().toISOString().split("T")[0],
      },

      //rules
      OnlyAlphabet: (v) =>
        /^[a-zA-Z\s]*$/.test(v) || "Tidak boleh ada simbol atau angka",
      Required: (v) => !!v || "Harus Diisi",
      // tomorrowdate: func.GetTomorrowDate(),
      todaydate: new Date().toISOString().split("T")[0],

      //snackbar
      snackbar: false,
      text: "Isi form sesuai dengan aturan",
      timeout: 2000,

      //dialog
      dialog_policy: false,
      dialog_err: false,
      dialog_title: "",
      dialog_text: "",
    };
  },

  created() {
    // this.GetPolicy("", "", "")
  },

  computed: {
    formatted_date_search() {
      return this.selected_date_search
        ? func.FormatOutputDate(this.selected_date_search)
        : "";
    },
    date_acc_value() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date)
        : "";
    },
    date_rep_value() {
      return this.todaydate
        ? func.FormatOutputDate(this.todaydate, "simple", "api")
        : "";
    },
    date_start_value() {
      return this.sdate
        ? func.FormatOutputDate(this.sdate, "simple", "api")
        : "";
    },
    date_end_value() {
      return this.edate
        ? func.FormatOutputDate(this.edate, "simple", "api")
        : "";
    },
  },

  methods: {
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
    CheckForm() {
      if (!this.$refs.form.validate()) {
        this.dialog_title = "Form belum sesuai";
        this.dialog_text = "Isi form sesuai dengan aturan!";
        this.dialog_err = true;
      } else {
        this.e1 = 2;
      }
    },
    CheckPolicy() {
      if (this.policy !== "") {
        this.e1 = 2;
      } else {
        this.dialog_title = "Polis Belum Dipilih";
        this.dialog_text = "Pilih polis terlebih dahulu pada kolom aksi";
        this.dialog_err = true;
      }
    },
    SelectPolicy(policy, product, contribution, destination, sdate, edate) {
      this.policy = policy;
      this.product = product;
      this.contribution = contribution;
      this.destination = destination;
      this.sdate = sdate;
      this.edate = edate;
    },
    FormatDate(date) {
      return func.FormatOutputDate(date, "simple", "api");
    },
    UpdateDate(formKey, dateKey, menuKey, value) {
      this[formKey][dateKey] = func.FormatDate(value);
      this[menuKey] = false;
    },

    // GetPolicy(no, name, dest, sdate) {
    //   let formdata = {
    //     id: func.UsersID(),
    //     no_policy: no,
    //     product: name,
    //     destination: dest,
    //     date_start: sdate,
    //   };
    //   let param = func.ParamPOST(formdata);
    //   axios
    //     .post(func.UrlPOST("apiSearchPolicy"), param, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then((response) => {
    //       let feedback = response.data;
    //       if (feedback.length > 0) {
    //         if (feedback[0].status === true) {
    //           this.policies = feedback.map((item) => ({
    //             ...item.data,
    //           }));
    //         } else {
    //           this.DialogActive("Failed (1) :  ", feedback[0].message);
    //         }
    //       } else {
    //         this.DialogActive("Belum ada polis yang terdaftar!");
    //       }
    //     })
    //     .catch((e) => {
    //       this.DialogActive("Failed (3) :", e);
    //     });
    //   this.dialog_policy = false;
    // },
    // GetPdf(policy) {
    //   let formdata = {
    //     id: func.UsersID(),
    //     refid: policy,
    //   };
    //   let param = func.ParamPOST(formdata);
    //   axios
    //     .post(func.UrlPOST("apiSafariGetPdf"), param, {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     })
    //     .then((response) => {
    //       let feedback = response.data;
    //       if (feedback.length > 0) {
    //         if (feedback[0].status === true) {
    //           window.open(feedback[0].data.policy_url, "_blank");
    //         } else {
    //           this.DialogActive("Failed (1) : ", feedback[0].message);
    //         }
    //       } else {
    //         this.DialogActive("Failed (2)");
    //       }
    //     })
    //     .catch((e) => {
    //       this.DialogActive("Failed (3) : ", e);
    //     });
    // },

    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog_err = true;
    },
  },
};
</script>
<style>
.blue-text {
  color: #001f48;
  font-size: large;
}
.small-blue-text {
  color: #001f48;
}
.v-stepper-header {
  position: fixed !important;
  width: 100%;
  background-color: #ffffff;
}
.fixed-img {
  position: fixed;
  left: 0;
}
.full-height {
  height: 100vh;
}
</style>
