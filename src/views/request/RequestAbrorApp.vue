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
            <v-col>
              <v-row class="mt-14 mb-4 justify-center">
                <v-icon class="hidden-xs mr-2 ml-3" color="#001F48"
                  >mdi-book</v-icon
                >
                <span class="blue-text">{{ "Takaful Abror" }}</span>
              </v-row>
              <v-row class="mt-7 mb-3">
                <v-icon class="mr-2 mb-2 ml-3" color="#001F48"
                  >mdi-car-info</v-icon
                >
                <span class="blue-text">Data Kendaraan</span>
              </v-row>
              <v-form v-model="form" class="body">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="form_data.car_brand"
                      flat
                      variant="outlined"
                      label="Brand Mobil"
                      :items="car_brand"
                      color="#001F48"
                      prepend-inner-icon="mdi-car"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="form_data.car_type"
                      flat
                      variant="outlined"
                      label="Tipe Mobil"
                      :items="filteredTypes"
                      color="#001F48"
                      prepend-inner-icon="mdi-car"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="form_data.contribution"
                      flat
                      variant="outlined"
                      label="Jenis Kontribusi"
                      :items="['Standard', 'Premium']"
                      color="#001F48"
                      prepend-inner-icon="mdi-car"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.plat"
                      label="Plat Nomor"
                      clearable
                      prepend-inner-icon="mdi-car-back"
                      :rules="[Required, Capital]"
                      color="#001F48"
                      hint="Gunakan Kapital"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="form_data.year"
                      flat
                      variant="outlined"
                      label="Tahun Keluaran"
                      :rules="[Required]"
                      :items="years"
                      color="#001F48"
                      prepend-inner-icon="mdi-calendar"
                    >
                    </v-select>
                  </v-col>
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
                          v-model="formatted_date"
                          label="Tanggal Mulai"
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
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formatted_date2"
                      label="Tanggal Selesai"
                      prepend-inner-icon="mdi-calendar"
                      variant="outlined"
                      readonly
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.chassis"
                      label="Nomor Rangka"
                      clearable
                      prepend-inner-icon="mdi-car-door"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.engine"
                      label="Nomor Mesin"
                      clearable
                      prepend-inner-icon="mdi-engine"
                      :rules="[Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <div class="d-flex align-center mt-5">
                  <v-btn color="orange" @click="CheckPremi">
                    <span class="body">Cek Premi</span>
                  </v-btn>
                  <span v-if="premi !== null" class="ml-3">{{ Premi }}</span>
                </div>
                <v-row class="mt-7 mb-3">
                  <v-icon class="mr-2 ml-3" color="#001F48">mdi-camera</v-icon>
                  <span class="blue-text">Foto Kendaraan</span>
                </v-row>
                <v-row>
                  <v-col cols="6" md="3">
                    <v-file-input
                      variant="outlined"
                      label="Foto depan"
                      chips
                      prepend-inner-icon="mdi-car"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="(event) => UploadImg(event, 'image1')"
                      :rules="[Required]"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-file-input
                      variant="outlined"
                      label="Foto kanan"
                      chips
                      prepend-inner-icon="mdi-car-side"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="(event) => UploadImg(event, 'image2')"
                      :rules="[Required]"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-file-input
                      variant="outlined"
                      label="Foto kiri"
                      chips
                      prepend-inner-icon="mdi-car-side"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="(event) => UploadImg(event, 'image3')"
                      :rules="[Required]"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-file-input
                      variant="outlined"
                      label="Foto Belakang"
                      chips
                      prepend-inner-icon="mdi-car-back"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="(event) => UploadImg(event, 'image4')"
                      :rules="[Required]"
                    ></v-file-input>
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
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.fullname"
                      label="Nama Lengkap"
                      prepend-inner-icon="mdi-badge-account"
                      :rules="[OnlyAlphabet, Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
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
                  <v-col cols="12" md="4">
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
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="outlined"
                      v-model="form_data.phone"
                      label="No Handphone"
                      prepend-inner-icon="mdi-cellphone"
                      :rules="[OnlyNumbers, Required]"
                      color="#001F48"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-file-input
                      variant="outlined"
                      label="Foto KTP"
                      chips
                      prepend-inner-icon="mdi-card-account-details"
                      accept="image/png, image/jpeg, image/jpg"
                      @change="(event) => UploadImg(event, 'image5')"
                      :rules="[Required]"
                    ></v-file-input>
                  </v-col>
                </v-row>
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
                  <th>Mobil</th>
                  <th>Jenis Kontribusi</th>
                  <th>Tanggal</th>
                  <th>Harga Premi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ form_data.fullname }}</td>
                  <td>{{ form_data.product_name }}</td>
                  <td>{{ form_data.car_brand + " " + form_data.car_type }}</td>
                  <td>{{ form_data.contribution }}</td>
                  <td>
                    {{ formatted_date + "  -  " + formatted_date2 }}
                  </td>
                  <td>{{ FormatCurrency(form_data.price) }}</td>
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
                    {{ FormatCurrency(form_data.price) }}
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
                  >Harga premi</v-col
                >
                <v-col cols="1" style="border-top: 1px solid">:</v-col>
                <v-col cols="6" style="border-top: 1px solid">{{
                  FormatCurrency(form_data.price)
                }}</v-col>

                <v-col class="grey--text text--darken-1" cols="5"
                  >Biaya polis</v-col
                >
                <v-col cols="1">:</v-col>
                <v-col cols="6">{{ FormatCurrency(0) }}</v-col>

                <v-col cols="5" class="d-flex justify-end">Total</v-col>
                <v-col cols="1">:</v-col>
                <v-col cols="6" style="border-top: 1px solid">{{
                  FormatCurrency(form_data.price)
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
  name: "RequestAbrorApp",
  data: () => {
    return {
      e1: 0,
      id: "",
      confirm_dialog: false,
      contribution: "",
      date_picker1: false,
      date_picker3: false,
      selected_date: null,
      selected_date3: null,
      product: "",
      product_id: "",
      car_brand: [],
      years: ["2019", "2020", "2021", "2022", "2023", "2024"],

      capacity: 1,
      //data form
      form_data: {
        contribution: null,
        product_code: null,
        product_name: "Takaful Abror",
        car_brand: null,
        car_type: null,
        year: null,
        date_start: "",
        date_end: "",
        price: null,
        plat: null,
        chassis: null,
        engine: null,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        fullname: "",
        birthdate: "",
        gender: null,
        phone: "",
        id_user: null,
      },
      genders: ["Laki-laki", "Perempuan"],

      //rules
      OnlyAlphabet: (v) =>
        /^[a-zA-Z\s]*$/.test(v) || "Tidak boleh ada simbol atau angka",
      Required: (v) => !!v || "Harus Diisi",
      Capital: (value) => {
        const regex = /^[A-Z0-9\s-]+$/;
        return regex.test(value) || "Gunakan kapital";
      },
      todaydate: new Date().toISOString().split("T")[0],

      //snackbar
      snackbar: false,
      text: "",
      timeout: 2000,

      //dialog
      dialog: false,
      dialog_title: "",
      dialog_text: "",
      dialog_icon: "",
      icon_color: "",

      //mobile
      table: [],

      trx_id: "",
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      select: [],
      vehicle_price: null,
      percentage: null,
      premi: null,
    };
  },
  computed: {
    ...mapGetters(["carBrand", "carType", "abrorCont", "cars", "brands"]),
    formatted_date() {
      if (this.selected_date) {
        return func.FormatOutputDate(this.selected_date, "simple");
      }
      return "";
    },
    formatted_date2() {
      if (!this.selected_date) return "";
      const date = new Date(this.selected_date);
      date.setFullYear(date.getFullYear() + 1);
      const newDate = date.toISOString().split("T")[0];
      return func.FormatOutputDate(newDate, "simple", "api");
    },
    formatted_date3() {
      return this.selected_date3
        ? func.FormatOutputDate(this.selected_date3)
        : "";
    },
    filteredTypes() {
      const selectedBrand = this.form_data.car_brand;
      const car = this.select.find((c) => c.brand === selectedBrand);
      return car ? car.type : [];
    },
    isFormValid() {
      return (
        this.form_data.car_type &&
        this.form_data.contribution &&
        this.form_data.plat &&
        /^[A-Z0-9\s-]+$/.test(this.form_data.plat)
      );
    },
    Premi() {
      return `Harga Premi : ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(this.vehicle_price)} (Harga Kendaraan) x ${
        this.percentage
      }% = ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(this.premi)} /tahun`;
    },
  },
  watch: {
    "form_data.car_brand": function (newBrand) {
      if (newBrand) {
        this.form_data.car_type = null;
      }
    },
  },
  methods: {
    async Enroll() {
      this.confirm_dialog = false;
      try {
        this.form_data.gender = func.GenderFormat(this.form_data.gender);
        this.form_data.image1 = this.image1.replace(/^.+?base64,/, "");
        this.form_data.image2 = this.image2.replace(/^.+?base64,/, "");
        this.form_data.image3 = this.image3.replace(/^.+?base64,/, "");
        this.form_data.image4 = this.image4.replace(/^.+?base64,/, "");
        this.form_data.id_user = this.image5.replace(/^.+?base64,/, "");
        const date = new Date(this.selected_date);
        date.setFullYear(date.getFullYear() + 1);
        const newDate = date.toISOString().split("T")[0];
        this.form_data.date_end = newDate
        const response = await axios.post("/req-abror", {
          ...this.form_data,
        });
        if (response.data.status) {
          this.trx_id = response.data.trx_id;
          this.Pay();
        } else {
          this.DialogActive("Pendaftaran Gagal : ", response.data.message);
        }
      } catch (error) {
        this.DialogActive("Pendaftaran Gagal : ", error.message);
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
            this.UpdateEnrollStatus(this.trx_id);
          },
          onPending: (result) => {
            console.log("Payment pending", result);
            this.UpdateEnrollStatus(this.trx_id);
          },
          onError: (result) => {
            console.log("Payment error", result);
            this.UpdateEnrollStatus(this.trx_id);
          },
          onClose: (result) => {
            console.log("Payment closed", result);
            this.UpdateEnrollStatus(this.trx_id);
          },
        });
      } catch (error) {
        this.DialogActive("Pembayaran Gagal", error);
      }
    },
    async UpdateEnrollStatus(trx_id) {
      try {
        const response = await axios.post("/enroll-status-abror", {
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
    CheckPrice() {
      if (!this.form) {
        this.snackbar = true;
        this.text = "Isi form sesuai dengan aturan";
      } else {
        this.CheckPremi();
        this.AddItem();
        this.e1 = 1;
        window.scrollTo({
          top: 0,
        });
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
        { label: "Produk", value: this.product_name },
        { label: "Kontribusi", value: this.form_data.contribution },
        {
          label: "Mobil",
          value: this.form_data.car_brand + " " + this.form_data.car_type,
        },
        {
          label: "Periode",
          value: this.formatted_date + " - " + this.formatted_date2,
        },
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
    UploadImg(event, target) {
      const input = event.target;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this[target] = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    UpdateDate(formKey, dateKey, menuKey, value) {
      this[formKey][dateKey] = func.FormatDate(value);
      this[menuKey] = false;
    },
    async CheckPremi() {
      if (this.isFormValid) {
        try {
          const response = await axios.post("/get-price-abror", {
            plat_code: this.form_data.plat,
            contribution: this.form_data.contribution,
            type: this.form_data.car_type,
          });
          if (response.data.status) {
            this.form_data.product_code = response.data.data.product_code;
            this.form_data.price = response.data.data.price;
            this.percentage = response.data.data.percentage;
            this.vehicle_price = response.data.data.vehicle_price;
            this.premi = response.data.data.price;
          } else {
            console.error("Error retrieving details:", response.data.message);
          }
        } catch (error) {
          console.error("Error retrieving details:", error);
        }
      } else {
        this.DialogActive(
          "isi form dengan benar",
          "Isi data brand, tipe, dan plat nomor terlebih dahulu",
          "mdi-alert-circle-outline",
          "red"
        );
      }
    },
  },
  mounted() {
    this.contribution = this.abrorCont;
    this.form_data.contribution = this.abrorCont;
    this.form_data.car_brand = this.carBrand;
    this.form_data.car_type = this.carType;
    this.select = this.cars;
    this.car_brand = this.brands;
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
.v-messages__message {
  font-size: medium;
  font-weight: 600;
}
</style>
