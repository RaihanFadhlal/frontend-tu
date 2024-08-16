<template>
  <v-app>
    <v-stepper v-model="e1" class="body" :mobile="$vuetify.display.xs">
      <v-stepper-header>
        <v-stepper-item
          title="Form Peserta"
          value="1"
          color="001F48"
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          title="Hasil dan Pembayaran"
          value="2"
          color="001F48"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item value="1">
          <v-card class="d-flex">
            <v-col class="fixed-img pa-0 mt-11 hidden-xs" cols="4">
              <v-img
                :src="UploadIcon('/assets/request/', 'coba3.png')"
                cover
                height="625"
              >
              </v-img>
            </v-col>
            <v-col class="hidden-xs" cols="4"></v-col>
            <v-col>
              <v-img
                class="mt-10 hidden-sm-and-up rounded-lg"
                contain
                :src="UploadIcon('/assets/request/', 'mobile.png')"
              ></v-img>
              <v-row class="mt-14 mb-4 justify-center">
                <v-icon class="hidden-xs mr-2 ml-3" color="#001F48"
                  >mdi-book</v-icon
                >
                <span class="blue-text">{{ product }}</span>
              </v-row>
              <v-row class="mt-7 mb-3">
                <v-icon class="mr-2 mb-2 ml-3" color="#001F48"
                  >mdi-airplane</v-icon
                >
                <span class="blue-text">Data Perjalanan</span>
              </v-row>
              <v-form v-model="form" class="body">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      variant="outlined"
                      v-model="form_data.from"
                      label="Keberangkatan"
                      :items="formatted_prov"
                      clearable
                      prepend-inner-icon="mdi-map-marker"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      variant="outlined"
                      v-model="form_data.destination"
                      label="Destinasi"
                      clearable
                      :items="countries"
                      prepend-inner-icon="mdi-map-marker"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-autocomplete>
                  </v-col>
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
                          v-model="formatted_date"
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
                        v-model="selected_date"
                        :min="todaydate"
                        @update:model-value="
                          (value) =>
                            UpdateDate(
                              'form_data',
                              'date_start',
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
                    <v-menu
                      v-model="date_picker2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-model="formatted_date2"
                          label="Tanggal Pulang"
                          prepend-inner-icon="mdi-calendar"
                          v-bind="props"
                          variant="outlined"
                          readonly
                          :rules="[ValidateDateEnd, Required]"
                          color="#001F48"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="selected_date2"
                        :min="todaydate"
                        @update:model-value="
                          (value) =>
                            UpdateDate(
                              'form_data',
                              'date_end',
                              'date_picker2',
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
                      v-model="form_data.capacity"
                      label="Jumlah Peserta"
                      clearable
                      prepend-inner-icon="mdi-account"
                      :rules="[OnlyNumbers, Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      variant="outlined"
                      v-model="form_data.contribution"
                      label="Jenis Kontribusi"
                      clearable
                      :items="contribution"
                      prepend-inner-icon="mdi-format-list-bulleted-type"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-select>
                  </v-col>
                </v-row>

                <!-- Profil Peserta -->
                <v-row>
                  <v-col>
                    <v-row class="mb-1">
                      <v-icon class="mr-2 ml-3" color="#001F48"
                        >mdi-account</v-icon
                      >
                      <span class="blue-text">Profil Peserta</span>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.fullname"
                      label="Nama Lengkap"
                      prepend-inner-icon="mdi-badge-account"
                      :rules="[OnlyAlphabet, Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.birthplace"
                      label="Tempat Lahir"
                      prepend-inner-icon="mdi-map-marker"
                      :rules="[Required, OnlyAlphabet]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="date_picker3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          variant="outlined"
                          v-model="formatted_date3"
                          label="Tanggal Lahir"
                          prepend-inner-icon="mdi-calendar"
                          v-bind="props"
                          readonly
                          :rules="[Required]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :max="todaydate"
                        v-model="selected_date3"
                        @update:model-value="
                          (value) =>
                            UpdateDate(
                              'form_data',
                              'birthdate',
                              'date_picker3',
                              value
                            )
                        "
                        class="body"
                        color="#001F48"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      variant="outlined"
                      v-model="form_data.gender"
                      label="Jenis Kelamin"
                      prepend-inner-icon="mdi-gender-male-female"
                      :items="genders"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.phone"
                      label="No Handphone"
                      prepend-inner-icon="mdi-cellphone"
                      :rules="[OnlyNumbers, Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.passport"
                      label="Passport"
                      prepend-inner-icon="mdi-passport"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row v-if="form_data.capacity > 1" class="mt-1 mb-5">
                  <v-icon class="mr-2 ml-3" color="#001F48"
                    >mdi-account-group</v-icon
                  >
                  <span class="blue-text">Profil Peserta Lain</span>
                </v-row>
                <!-- Peserta Tambahan -->
                <div v-for="(other, index) in form_data.others" :key="index">
                  <v-row class="mt-1">
                    <v-icon small class="mr-2 ml-3" color="#001F48"
                      >mdi-account</v-icon
                    >
                    <div class="small-blue-text">Peserta {{ index + 1 }}</div>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        variant="outlined"
                        v-model="other.fullname"
                        label="Nama Lengkap"
                        prepend-inner-icon="mdi-badge-account"
                        :rules="[OnlyAlphabet, Required]"
                        color="#001F48"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-menu
                        v-model="date_picker4[index]"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="formatted_date4[index]"
                            label="Tanggal Lahir"
                            prepend-inner-icon="mdi-calendar"
                            v-bind="props"
                            variant="outlined"
                            readonly
                            :rules="[Required]"
                            color="#001F48"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="selected_date4[index]"
                          @update:model-value="
                            (value) => UpdateFormatDate(index, value)
                          "
                          color="#001F48"
                          class="body"
                          :max="todaydate"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </div>
              </v-form>
              <v-row class="ma-3">
                <v-btn
                  class="mr-2"
                  style="font-weight: 600"
                  @click="CancelRequest"
                >
                  Batal
                </v-btn>
                <v-btn
                  color="orange"
                  style="font-weight: 600"
                  @click="CheckPrice"
                >
                  Selanjutnya
                </v-btn>
              </v-row>
            </v-col>
          </v-card>
        </v-stepper-window-item>
        <v-stepper-window-item value="2">
          <v-card class="full-height mt-15" flat>
            <v-row class="mb-4 mb-sm-2 ml-sm-1">
              <v-icon class="mt-5 mr-2 ml-3" color="#001F48"
                >mdi-receipt-text</v-icon
              >
              <span class="blue-text mt-5">Rincian Pembayaran</span>
            </v-row>
            <v-table class="hidden-xs">
              <thead>
                <tr>
                  <th>Nama Peserta</th>
                  <th>Produk</th>
                  <th>Jenis Kontribusi</th>
                  <th>Destinasi</th>
                  <th>Tanggal</th>
                  <th>Harga per Peserta</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ form_data.fullname }}</td>
                  <td>{{ form_data.product_name }}</td>
                  <td>{{ form_data.contribution }}</td>
                  <td>{{ form_data.destination }}</td>
                  <td>
                    {{ formatted_date + "  -  " + formatted_date2 }}
                  </td>
                  <td>{{ FormatCurrency(form_data.product_price) }}</td>
                </tr>
                <tr v-for="i in form_data.capacity - 1" :key="i">
                  <td>{{ form_data.others[i - 1].fullname }}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{{ FormatCurrency(form_data.product_price) }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Biaya Pembuatan Polis :</td>
                  <td>{{ FormatCurrency(0) }}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Total :</td>
                  <td>
                    {{
                      FormatCurrency(
                        form_data.product_price * form_data.capacity
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div class="hidden-sm-and-up ml-2 mb-5">
              <v-row v-for="(item, index) in table" :key="index">
                <v-col class="pb-0 grey--text text--darken-1" cols="5">{{
                  item.label
                }}</v-col>
                <v-col class="pb-0" cols="1">:</v-col>
                <v-col class="pb-0" cols="6">{{ item.value }}</v-col>
              </v-row>

              <v-row class="mt-8">
                <v-col
                  class="pb-0 grey--text text--darken-1"
                  cols="5"
                  style="border-top: 1px solid black"
                  >Harga / peserta</v-col
                >
                <v-col cols="1" style="border-top: 1px solid">:</v-col>
                <v-col cols="6" style="border-top: 1px solid">{{
                  FormatCurrency(form_data.product_price) +
                  " (x" +
                  form_data.capacity +
                  ")"
                }}</v-col>

                <v-col class="grey--text text--darken-1" cols="5"
                  >Biaya polis</v-col
                >
                <v-col cols="1">:</v-col>
                <v-col cols="6">{{ FormatCurrency(0) }}</v-col>

                <v-col cols="5" class="d-flex justify-end">Total</v-col>
                <v-col cols="1">:</v-col>
                <v-col cols="6" style="border-top: 1px solid">{{
                  FormatCurrency(form_data.product_price * form_data.capacity)
                }}</v-col>
              </v-row>
            </div>

            <v-row class="ma-3 mt-2">
              <v-btn class="mr-2" style="font-weight: 600" @click="e1 = 0">
                Kembali
              </v-btn>
              <v-dialog v-model="confirm_dialog" persistent max-width="360px">
                <template v-slot:activator="{ props }">
                  <v-btn color="orange" style="font-weight: 600" v-bind="props">
                    Bayar
                  </v-btn>
                </template>
                <v-card class="body">
                  <v-card-title class="text-h5"
                    ><v-icon class="mr-2 mb-1" left style="color: yellow"
                      >mdi-alert-circle-outline</v-icon
                    >

                    Konfirmasi Pembayaran
                  </v-card-title>
                  <v-card-text>
                    <div>
                      Waktu pembayaran 15 menit setelah memilih metode
                      pembayaran.
                    </div>
                    <div>Jangan tutup dialog pembayaran sebelum selesai</div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="red darken-1"
                      text
                      @click="confirm_dialog = false"
                    >
                      Batal
                    </v-btn>
                    <v-btn color="green darken-1" text @click="Enroll">
                      Bayar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
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
    <v-dialog v-model="dialog" max-width="400px">
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
          <v-btn @click="dialog = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import func from "../../function";
import axios from "../../axios";
import { mapGetters } from "vuex";

export default {
  name: "RequestApp",
  data: () => {
    return {
      isFormValid: true,
      valuee: null,
      label: "Field 1",
      e1: 0,
      id: "",
      confirm_dialog: false,
      countries: [],
      contribution: [],
      date_picker1: false,
      date_picker2: false,
      date_picker3: false,
      date_picker4: [],
      selected_date: null,
      selected_date2: null,
      selected_date3: null,
      selected_date4: [],
      product: "",
      product_id: "",

      capacity: 1,
      //data form
      form_data: {
        product_code: "",
        product_name: "",
        product_price: null,

        from: null,
        destination: null,
        date_start: "",
        date_end: "",
        contribution: null,
        capacity: 1,

        fullname: "",
        birthdate: "",
        birthplace: "",
        gender: null,
        phone: "",
        passport: "",

        others: [],
      },
      day_max: null,

      banks: "Virtual Account Bank Muamalat / Bank Central Asia",
      genders: ["Laki-laki", "Perempuan"],

      //rules
      OnlyAlphabet: (v) =>
        /^[a-zA-Z\s]*$/.test(v) || "Tidak boleh ada simbol atau angka",
      Required: (v) => !!v || "Harus Diisi",
      todaydate: new Date().toISOString().split("T")[0],

      //snackbar
      snackbar: false,
      text: "",
      timeout: 2000,

      payment: {
        trx_id: "",
        no_va: "",
        limit: "",
        status: "",
      },

      //dialog
      dialog: false,
      dialog_title: "",
      dialog_text: "",
      dialog_icon: "",
      icon_color: "",
      city: [],

      //mobile
      table: [],
      formatted_prov: [
        "Aceh",
        "Sumatera Utara",
        "Sumatera Selatan",
        "Sumatera Barat",
        "Bengkulu",
        "Riau",
        "Kepulauan Riau",
        "Jambi",
        "Lampung",
        "Bangka Belitung",
        "Kalimantan Barat",
        "Kalimantan Timur",
        "Kalimantan Selatan",
        "Kalimantan Tengah",
        "Kalimantan Utara",
        "Banten",
        "DKI Jakarta",
        "Jawa Barat",
        "Jawa Tengah",
        "Daerah Istimewa Yogyakarta",
        "Jawa Timur",
        "Bali",
        "Nusa Tenggara Timur",
        "Nusa Tenggara Barat",
        "Gorontalo",
        "Sulawesi Barat",
        "Sulawesi Tengah",
        "Sulawesi Utara",
        "Sulawesi Tenggara",
        "Sulawesi Selatan",
        "Maluku Utara",
        "Maluku",
        "Papua Barat",
        "Papua",
        "Papua Tengah",
        "Papua Pegunungan",
        "Papua Selatan",
        "Papua Barat Daya",
      ],
      trx_id: "",
    };
  },
  computed: {
    ...mapGetters(["productCode", "productName"]),
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date)
        : "";
    },
    formatted_date2() {
      return this.selected_date2
        ? func.FormatOutputDate(this.selected_date2)
        : "";
    },
    formatted_date3() {
      return this.selected_date3
        ? func.FormatOutputDate(this.selected_date3)
        : "";
    },
    formatted_date4() {
      return this.selected_date4.map((date) =>
        date ? func.FormatOutputDate(date) : ""
      );
    },
  },
  watch: {
    "form_data.capacity"(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.SyncOthers();
      }
    },
  },
  methods: {
    async Enroll() {
      this.confirm_dialog = false;
      try {
        this.form_data.capacity = parseInt(this.form_data.capacity, 10);
        this.form_data.gender = func.GenderFormat(this.form_data.gender);
        const response = await axios.post("/req-prod", {
          ...this.form_data,
        });
        if (response.data.status) {
          this.trx_id = response.data.trx_id;
          this.Pay();
        } else {
          this.DialogActive("Pendaftaran Gagal : ", response.data.message);
        }
      } catch (error) {
        this.DialogActive("Pendaftaran Gagal : ", response.data.message);
      }
    },
    async Pay() {
      try {
        const response = await axios.post("/generate-trx", {
          trx_id: this.trx_id,
        });
        const result = response.data;
        window.snap.pay(result.token, {
          onSuccess: (result) => {
            console.log("Payment successful", result);
            this.UpdateEnrollStatus(this.trx_id)
          },
          onPending: (result) => {
            console.log("Payment pending", result);
            this.UpdateEnrollStatus(this.trx_id)
          },
          onError: (result) => {
            console.log("Payment error", result);
            this.UpdateEnrollStatus(this.trx_id)
          },
          onClose: (result) => {
            console.log("Payment closed", result);
            this.UpdateEnrollStatus(this.trx_id)
          },
        });
      } catch (error) {
        this.DialogActive("Pembayaran Gagal", error);
      }
    },
    async GetPrice(code, period, type) {
      try {
        const response = await axios.post("/get-price", {
          group_code: code,
          period: period,
          type: type,
        });
        if (response.data.status) {
          this.form_data.product_price = response.data.data.price;
          this.form_data.product_code = response.data.data.code;
          this.form_data.product_name = response.data.data.name;
        } else {
          console.error("Error retrieving details:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving details:", error);
      }
    },
    async DayMax(code) {
      try {
        const response = await axios.post("/prod-daymax", {
          group_code: code,
        });
        if (response.data.status) {
          this.day_max = response.data.data.day_max;
        } else {
          console.error("Error retrieving details:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving details:", error);
      }
    },
    async UpdateEnrollStatus(trx_id) {
      try {
        const response = await axios.post("/enroll-status", {
          trx_id: trx_id,
        });
        if (response.data.status) {
          if (response.data.message == "Pembayaran Berhasil") {
            setTimeout(() => {
              this.$router.push("/policy-history");
            }, 1000);
          } else {
            this.DialogActive(response.data.message);
            setTimeout(() => {
              this.$router.push("/transaction");
            }, 1000);
          } 
        } else {
          console.error("Error Update Enroll Status:", response.data.message);
          this.DialogActive("Pendaftaran Gagal : ", response.data.message);
        }
      } catch (error) {
        console.error("Error Server:", error);
      }
    },
    CancelRequest() {
      this.$router.go(-1);
    },
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
    OnlyNumbers(value) {
      const isnumber = /^[+\d]+$/.test(value);
      const iszero = value !== "0";

      return (isnumber && iszero) || "Input data salah";
    },
    UpdateDate(formKey, dateKey, menuKey, value) {
      this[formKey][dateKey] = func.FormatDate(value);
      this[menuKey] = false;
    },
    UpdateFormatDate(index, value) {
      this.form_data.others[index].birthdate = func.FormatDate(value);
      this.selected_date4[index] = value;
      this.date_picker4[index] = false;
    },
    SyncOthers() {
      const capacity = this.form_data.capacity - 1;
      this.form_data.others = [];
      for (let i = 0; i < capacity; i++) {
        this.form_data.others.push({
          fullname: "",
          birthdate: "",
        });
        this.selected_date4.push(null);
        this.date_picker4.push(false);
      }
    },
    ValidateDateEnd(value) {
      if (
        new Date(this.form_data.date_end) >
          new Date(this.form_data.date_start) ||
        !value
      ) {
        return true;
      } else {
        return "Input tanggal setelah keberangkatan!";
      }
    },
    CheckPrice() {
      if (!this.form) {
        this.snackbar = true;
        this.text = "Isi form sesuai dengan aturan";
      } else {
        const startdate = new Date(this.form_data.date_start);
        const enddate = new Date(this.form_data.date_end);
        const timediff = enddate - startdate;
        const totaldays = Math.ceil(timediff / (1000 * 60 * 60 * 24));
        if (totaldays < 1) {
          this.snackbar = true;
          this.text = "Tanggal berangkat harus lebih awal dari tanggal pulang";
        } else {
          if (totaldays > this.day_max) {
            window.scrollTo({
              top: 0,
            });
            this.DialogActive(
              "Periode melebihi maksimal produk",
              "Produk ini memiliki periode maksimal " +
                this.day_max.toString() +
                " hari",
              "mdi-alert-circle-outline",
              "red"
            );
          } else {
            this.GetPrice(
              this.product_id,
              totaldays,
              this.form_data.contribution
            );
            this.AddItem();
            this.e1 = 1;
            window.scrollTo({
              top: 0,
            });
          }
        }
      }
    },
    FormatCurrency(amount) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        fraction: 2,
      });
      return formatter.format(amount);
    },
    AddItem() {
      this.table.splice(0, this.table.length);
      const items = [
        { label: "Nama Pendaftar", value: this.form_data.fullname },
        { label: "Jumlah Peserta", value: this.form_data.capacity },
        { label: "Produk", value: this.product },
        { label: "Kontribusi", value: this.form_data.contribution },
        { label: "Destinasi", value: this.form_data.destination },
        { label: "Berangkat", value: this.formatted_date },
        { label: "Pulang", value: this.formatted_date2 },
      ];
      this.table.push(...items);
    },
    DialogActive(title, msg, icon, color) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog_icon = icon;
      this.icon_color = color;
      this.dialog = true;
    },
  },
  created() {
    const form = JSON.parse(localStorage.getItem("form_safari")) || {};
    this.capacity = form.capacity.toString();

    if (form.from !== "") {
      this.form_data.from = form.from;
    }
    if (form.destination !== "") {
      this.form_data.destination = form.destination;
    }
    this.form_data.date_start = form.date_start;
    this.form_data.date_end = form.date_end;
    this.form_data.contribution = form.type;

    if (
      this.form_data.date_start !== undefined &&
      this.form_data.date_start !== ""
    ) {
      this.selected_date = new Date(this.form_data.date_start);
    }
    if (
      this.form_data.date_end !== undefined &&
      this.form_data.date_end !== ""
    ) {
      this.selected_date2 = new Date(this.form_data.date_end);
    }

    this.countries = JSON.parse(localStorage.getItem("countries"));
    this.contribution = JSON.parse(localStorage.getItem("contribution"));
  },

  mounted() {
    this.product = this.productName;
    this.product_id = this.productCode;
    this.DayMax(this.productCode);
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
