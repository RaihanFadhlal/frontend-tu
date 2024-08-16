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
                      <v-col
                        v-if="prod == 'safari'"
                        cols="12"
                        sm="6"
                        md="5"
                        class="py-0"
                      >
                        <v-select
                          variant="outlined"
                          v-model="form_search.product_name"
                          label="Produk"
                          clearable
                          :items="products"
                          color="#001F48"
                          prepend-inner-icon="mdi-map"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="5" class="py-0">
                        <v-select
                          v-if="prod == 'safari'"
                          variant="outlined"
                          v-model="form_search.destination"
                          label="Destinasi"
                          clearable
                          :items="countries"
                          color="#001F48"
                          prepend-inner-icon="mdi-map-marker"
                        ></v-select>
                        <v-select
                          v-else
                          variant="outlined"
                          v-model="form_search.car_type"
                          label="Mobil"
                          clearable
                          :items="cars"
                          color="#001F48"
                          prepend-inner-icon="mdi-map-marker"
                        ></v-select>
                      </v-col>
                      <v-col v-if="prod=='abror'" cols="12" sm="6" md="5" class="py-0">
                        <v-menu
                              v-model="date_menu_picker"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ props }">
                                <v-text-field
                                  variant="outlined"
                                  v-model="formatted_date_search"
                                  label="Tanggal Pengajuan"
                                  prepend-inner-icon="mdi-calendar"
                                  v-bind="props"
                                  readonly
                                  color="#001F48"
                                  clearable
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                class="body"
                                v-model="selected_date_search"
                                :max="tomorrow"
                                @update:model-value="UpdateDateSearch"
                                color="#001F48"
                              ></v-date-picker>
                            </v-menu>
                      </v-col>
                    </v-row>
                    <v-row justify="center">
                      <v-btn
                        v-if="prod == 'safari'"
                        color="#F57C00"
                        @click="
                          GetPolicies(
                            form_search.product_name,
                            form_search.destination
                          )
                        "
                      >
                        <v-text style="color: aliceblue">Cari</v-text>
                      </v-btn>
                      <v-btn
                        v-else
                        color="#F57C00"
                        @click="
                          GetPoliciesAbror(
                            form_search.car_type,
                            form_search.date_start
                          )
                        "
                      >
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
            <v-table>
              <thead>
                <tr>
                  <th>Nomor Polis</th>
                  <th>Produk</th>
                  <th v-if="prod == 'safari'" class="hidden-sm-and-down">
                    Destinasi
                  </th>
                  <th v-else class="hidden-sm-and-down">
                    Mobil
                  </th>
                  <th class="hidden-sm-and-down">Tanggal</th>
                  <th class="hidden-sm-and-down">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginated_policies" :key="item.policy_id">
                  <td>{{ item.policy_id }}</td>
                  <td>{{ item.product_name }}</td>
                  <td v-if="prod == 'safari'" class="hidden-sm-and-down">
                    {{ item.destination }}
                  </td>
                  <td v-else class="hidden-sm-and-down">
                    {{ item.car_type }}
                  </td>
                  <td v-if="prod == 'safari'" class="hidden-sm-and-down">
                    {{
                      FormatDate(item.sdate) + " - " + FormatDate(item.edate)
                    }}
                  </td>
                  <td v-else class="hidden-sm-and-down">
                    {{
                      FormatDate(item.date_start) + " - " + FormatDate(item.date_end)
                    }}
                  </td>
                  <td>
                    <v-btn
                      class="ma-1 orange font-weight-bold"
                      @click="GetPdf(item.policy_id)"
                      >Unduh</v-btn
                    >
                    <v-btn
                      v-if="prod == 'safari'"
                      class="ma-1 white--text font-weight-bold"
                      color="#001F48"
                      @click="
                        SelectPolicy(
                          item.policy_id,
                          item.product_name,
                          item.destination,
                          item.sdate,
                          item.edate
                        )
                      "
                      >Pilih</v-btn
                    >
                    <v-btn
                      v-else
                      class="ma-1 white--text font-weight-bold"
                      color="#001F48"
                      @click="
                        SelectPolicy(
                          item.policy_id,
                          item.product_name,
                          '',
                          item.date_start,
                          item.date_end,
                          item.car_type,
                        )
                      "
                      >Pilih</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-pagination
              v-model="current_page"
              :length="pages"
              @update:modelValue="UpdatePage"
              color="blue lighten-5"
              class="mx-auto mt-8"
            ></v-pagination>
            <v-chip class="ml-3 mb-3" color="#001F48">
              <v-icon left> mdi-book </v-icon>
              {{ "Polis : " + selected_policy }}
            </v-chip>
            <div class="ml-3 mt-3">
              <router-link to="/">
                <v-btn class="mr-2"> Batal </v-btn>
              </router-link>
              <v-btn color="orange" @click="CheckPolicy"> Selanjutnya </v-btn>
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
              <v-form v-model="form_req" class="body">
                <v-row>
                  <v-col cols="12" md="6">
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
                        :max="tomorrow"
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
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="date_rep_value"
                      label="Tanggal Laporan"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
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
                  <v-col cols="12" md="6">
                    <v-file-input
                      variant="outlined"
                      label="Bukti Foto"
                      chips
                      prepend-inner-icon="mdi-camera"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="UploadImg"
                      :rules="[Required]"
                    ></v-file-input
                  ></v-col>
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
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="date_acc_value"
                      label="Tanggal Kejadian"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      variant="outlined"
                      v-model="date_rep_value"
                      label="Tanggal Laporan"
                      readonly
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.location"
                      label="Lokasi"
                      readonly
                      prepend-inner-icon="mdi-map-marker"
                      color="#001F48"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      variant="outlined"
                      v-model="file_name"
                      label="Bukti Foto"
                      readonly
                      prepend-inner-icon="mdi-camera"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
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
                      v-model="selected_policy"
                      label="Nomor Polis"
                      prepend-inner-icon="mdi-book-information-variant"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      variant="outlined"
                      v-model="product_name"
                      label="Produk"
                      prepend-inner-icon="mdi-map"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-if="prod == 'safari'"
                      variant="outlined"
                      v-model="destination"
                      label="Destinasi"
                      prepend-inner-icon="mdi-map-marker"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                    <v-text-field
                      v-if="prod == 'abror'"
                      variant="outlined"
                      v-model="car_type"
                      label="Mobil"
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
                      label="Tanggal Pulang"
                      prepend-inner-icon="mdi-calendar"
                      color="#001F48"
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
              <v-row class="ma-3">
                <v-btn class="mr-2" style="font-weight: 600" @click="e1 = 1">
                  Batal
                </v-btn>
                <v-btn color="orange" @click="ReqClaim"> Selanjutnya </v-btn>
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
          ><v-icon class="mr-2 mb-1" left color="black"
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
import axios from "../../axios";

export default {
  name: "RequestApp",
  components: {
    ClaimStep,
  },
  data: () => {
    return {
      e1: 0 ,
      policy_id: "",
      product_name: "",
      destination: "",
      date_start: "",
      date_end: "",

      policy: [],

      selected_policy: "",

      date_picker1: false,
      date_search: false,
      selected_date: null,
      selected_date_search: null,

      product: "Takaful Safari Umroh dan Haji Khusus",
      product_id: "",
      products: [
        "Takaful Safari Umroh Afdhol",
        "Takaful Safari Umroh dan Haji Khusus",
        "Takaful Safari Multitrip",
      ],

      form_search: {
        product_name: null,
        destination: null,
        car_type: null,
        date_start: null,
      },
      //data form
      form_data: {
        policy_id: "",
        product_name: "",
        date_acc: "",
        location: "",
        detail: "",
        date_report: new Date().toISOString().split("T")[0],
        evidence: "",
      },

      //rules
      OnlyAlphabet: (v) =>
        /^[a-zA-Z\s]*$/.test(v) || "Tidak boleh ada simbol atau angka",
      Required: (v) => !!v || "Harus Diisi",
      // tomorrowdate: func.GetTomorrowDate(),
      todaydate: new Date().toISOString().split("T")[0],
      tomorrow: "",

      //snackbar
      snackbar: false,
      text: "Isi form sesuai dengan aturan",
      timeout: 2000,

      //dialog
      dialog_policy: false,
      dialog_err: false,
      dialog_title: "",
      dialog_text: "",

      current_page: 1,
      per_page: 3,
      file_name: "",
      prod: "",
      countries: [],

      date_menu_picker: false,
      image: null,
      cars: [],

    };
  },

  async created() {
    const id = this.$route.query.id;
    if (id === "safari") {
      await this.GetPolicies("", "");
      await this.GetCountries();
      this.prod = "safari";
    } else if (id === "abror") {
     await this.GetPoliciesAbror("", "");
     await this.GetCars();
      this.prod = "abror";
    } else {
      this.$router.push("/");
      return;
    }
    this.tomorrow = func.Tomorrow()
  },

  computed: {
    paginated_policies() {
      const start = (this.current_page - 1) * this.per_page;
      const end = start + this.per_page;
      return this.policy.slice(start, end);
    },
    pages() {
      return Math.ceil(this.policy.length / this.per_page);
    },
    formatted_date_search() {
      return this.selected_date_search
        ? func.FormatOutputDate(this.selected_date_search,'simple')
        : "";
    },
    date_acc_value() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, "simple")
        : "";
    },
    date_rep_value() {
      return this.todaydate
        ? func.FormatOutputDate(this.todaydate, "simple", "api")
        : "";
    },
    date_start_value() {
      return this.date_start
        ? func.FormatOutputDate(this.date_start, "simple", "api")
        : "";
    },
    date_end_value() {
      return this.date_end
        ? func.FormatOutputDate(this.date_end, "simple", "api")
        : "";
    },
  },

  methods: {
    async GetPolicies(name, dest) {
      try {
        const response = await axios.post("/get-policies", {
          product_name: name,
          destination: dest,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            this.DialogActive("Belum ada polis yang terdaftar!");
            this.dialog_policy = false;
          } else {
            this.policy = response.data.data;
            this.dialog_policy = false;
          }
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    async GetPoliciesAbror(car, sdate) {
      try {
        const response = await axios.post("/get-policies-abror", {
          car_type: car,
          date_start: sdate,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            this.DialogActive("Belum ada polis yang terdaftar!");
            this.dialog_policy = false;
          } else {
            this.policy = response.data.data;
            this.dialog_policy = false;
          }
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    async GetCountries() {
      try {
        const response = await axios.get("/countries");
        if (response.data.status) {
          this.countries = response.data.data.countries
            .split(",")
            .map((country) => country.trim());
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    GetPdf(policyId) {
      axios
        .post(
          "/download-pdf",
          { policy_id: policyId },
          { responseType: "blob" }
        )
        .then((response) => {
          if (response.status === 200) {
            const url = window.URL.createObjectURL(
              new Blob([response.data], { type: "application/pdf" })
            );
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", policyId + ".pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            console.error("Error retrieving PDF:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error retrieving PDF:", error);
        });
    },
    async ReqClaim() {
      this.form_data.evidence = this.image.replace(/^.+?base64,/, "");
      var link
      if(this.prod == 'safari'){
        link = '/req-claim'
      } else {
        link = '/req-claim-abror'
      }
      try {
        const response = await axios.post(link, {
          ...this.form_data,
        });
        if (response.data.status) {
          window.scrollTo({
            top: 0,
          });
          this.DialogActive("Pengajuan Berhasil : ");
          setTimeout(() => {
            this.$router.push("/claim-history");
          }, 2000);
        } else {
          window.scrollTo({
            top: 0,
          });
          this.DialogActive("Pengajuan Gagal : ", response.data.message);
        }
      } catch (error) {
        window.scrollTo({
          top: 0,
        });
        this.DialogActive("Pengajuan Gagal : ", response.data.message);
      }
    },
    async GetCars(){
      try {
        const response = await axios.get("/get-cars");
        if (response.data.status) {
          this.cars = response.data.data
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    UploadImg(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        this.file_name = input.files[0].name;
        var reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    UpdatePage(page) {
      this.current_page = page;
    },
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
    CheckForm() {
      if (!this.form_req) {
        this.dialog_title = "Form belum sesuai";
        this.dialog_text = "Isi form sesuai dengan aturan!";
        this.dialog_err = true;
      } else {
        this.e1 = 2;
      }
    },
    CheckPolicy() {
      if (this.selected_policy !== "") {
       this.e1 = 1;
      } else {
        this.dialog_title = "Polis Belum Dipilih";
        this.dialog_text = "Pilih polis terlebih dahulu pada kolom aksi";
        this.dialog_err = true;
      }
    },
    SelectPolicy(policy, product, destination, sdate, edate, car) {
      this.selected_policy = policy;
      this.product_name = product;
      this.destination = destination;
      this.date_start = sdate;
      this.date_end = edate;
      this.car_type = car;

      this.form_data.product_name = product;
      this.form_data.policy_id = policy;
    },
    FormatDate(date) {
      return func.FormatOutputDate(date, "simple", "api");
    },
    UpdateDate(formKey, dateKey, menuKey, value) {
      this[formKey][dateKey] = func.FormatDate(value);
      this[menuKey] = false;
    },
    UpdateDateSearch(value) {
        this.form_search.date_start = func.FormatDate(value);
        this.date_menu_picker = false;
      },
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

.v-input--center-affix .v-input__prepend,
.v-input--center-affix .v-input__append {
  display: none !important;
}
</style>
