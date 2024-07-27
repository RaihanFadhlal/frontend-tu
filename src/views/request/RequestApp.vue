<template>
  <v-app>
    <v-stepper model="e1" class="body" :mobile="$vuetify.display.xs">
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
                :src="UploadIcon('../../assets/request/', 'coba3.png')"
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
                :src="UploadIcon('../../assets/request/', 'mobile.png')"
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
                      :items="country"
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
                      v-model="form_data.type"
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
                      v-model="form_data.birth_place"
                      label="Tempat Lahir"
                      prepend-inner-icon="mdi-map-marker"
                      :rules="[Required]"
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
                              'birth_date',
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
                      v-model="form_data.heir"
                      label="Ahli Waris"
                      prepend-inner-icon="mdi-account-switch"
                      :rules="[OnlyAlphabet, Required]"
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
                <v-btn color="orange" style="font-weight: 600" @click="enroll">
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
            <v-table class="hidden-xs-only">
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
                  <td>{{ form_data.product }}</td>
                  <td>{{ form_data.type }}</td>
                  <td>{{ form_data.destination }}</td>
                  <td>
                    {{ formatted_date + "  -  " + formatted_date2 }}
                  </td>
                  <td>{{ FormatCurrency(form_data.price) }}</td>
                </tr>
                <tr v-for="i in form_data.capacity - 1" :key="i">
                  <td>{{ others[i - 1].fullname }}</td>
                  <td>{{ product }}</td>
                  <td>{{ type }}</td>
                  <td>{{ destination }}</td>
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
                  <td>{{ FormatCurrency(price * capacity + 0) }}</td>
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
                  FormatCurrency(price) + " (x" + capacity + ")"
                }}</v-col>

                <v-col class="grey--text text--darken-1" cols="5"
                  >Biaya polis</v-col
                >
                <v-col cols="1">:</v-col>
                <v-col cols="6">{{ FormatCurrency(0) }}</v-col>

                <v-col cols="5" class="d-flex justify-end">Total</v-col>
                <v-col cols="1">:</v-col>
                <v-col cols="6" style="border-top: 1px solid">{{
                  FormatCurrency(price * capacity + 0)
                }}</v-col>
              </v-row>
            </div>
            <v-row class="my-2 ml-sm-1">
              <v-icon class="mr-2 ml-3" color="#001F48">mdi-bank</v-icon>
              <v-text class="blue-text">Metode Pembayaran</v-text>
            </v-row>
            <v-form>
              <v-col cols="12" sm="6">
                <v-text-field
                  readonly
                  outlined
                  v-model="form_data.bank"
                  prepend-inner-icon="mdi-bank-circle"
                  color="#001F48"
                ></v-text-field>
              </v-col>
            </v-form>

            <v-row class="ma-3">
              <v-btn class="mr-2" style="font-weight: 600" @click="e1 = 0">
                Kembali
              </v-btn>
              <v-dialog v-model="dialog" persistent max-width="360px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="orange"
                    style="font-weight: 600"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Bayar
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">
                    Konfirmasi Pembayaran
                  </v-card-title>
                  <v-card-text
                    >Pembayaran maksimal dilakukan dalam 1 hari
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog = false">
                      Batal
                    </v-btn>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="(e1 = 3), (dialog = false)"
                    >
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
  </v-app>
</template>

<script>
import func from "../../function";
import axios from "axios";

export default {
  name: "RequestApp",
  data: () => {
    return {
      isFormValid: true,
      valuee: null,
      label: "Field 1",
      e1: 0,
      id: "",
      dialog: false,
      country: ["Saudi Arabia", "Turki"],
      contribution: ["Basic", "Gold", "Platinum", "Titanium"],
      date_picker1: false,
      date_picker2: false,
      date_picker3: false,
      date_picker4: [],
      selected_date: null,
      selected_date2: null,
      selected_date3: null,
      selected_date4: [],
      product: "Takaful Safari Umroh dan Haji Khusus",
      product_id: "",

      capacity: 1,
      //data form
      form_data: {
        from: null,
        destination: null,
        date_start: "",
        date_end: "",
        type: null,
        capacity: 1,

        fullname: "",
        birth_date: "",
        birth_place: "",
        gender: null,
        heir: "",
        passport: "",
        price: null,
        bank: "Bank Muamalat Virtual Account / Bank Central Asia Virtual Account",

        others: [],
      },

      banks: "Virtual Account Bank Muamalat / Bank Central Asia",
      genders: ["Laki-laki", "Perempuan"],

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

      payment: {
        trx_id: "",
        no_va: "",
        limit: "",
        status: "",
      },

      //dialog
      dialog_trx: false,
      dialog_title: "",
      dialog_text: "",
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
      orderid: "TrxTsuhkb1-12345",
      grossamt: 30000,
      fname: "Raihan Aziz",
      email: "raihanfadhlal@gmail.com",
      phone: "081281132263",
      id: "TSUHKB1",
      price: 30000,
      qty: 1,
      name: "Takaful Safari Umroh dan Haji Khusus",

      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhaWhhbjIwMDA3QG1haWwudW5wYWQuYWMuaWQiLCJleHAiOjE3MjE5NjA1OTZ9.8_2oBzd88iqDkHFivx0PsKf-idUWd3ObmGkByWcxwyA",
      trx_id: "",
    };
  },
  computed: {
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date)
        : "Jumat, 26 Juli 2024";
    },
    formatted_date2() {
      return this.selected_date2
        ? func.FormatOutputDate(this.selected_date2)
        : "Rabu, 31 Juli 2024";
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
    async enroll() {
      try {
        const response = await axios.post(
          "http://localhost:9000/req-prod",
          {
            product_code: "TSUHKB1",
            product_name: "Takaful Safari Umroh dan Haji Khusus",
            capacity: 3,
            product_price: 60000,
            phone: "081281132263",
            from: "DKI Jakarta",
            destination: "Saudi Arabia",
            start_date: "2024-08-01",
            end_date: "2024-08-05",
            contribution: "Basic",
            fullname: "Raihan Aziz",
            birthdate: "2001-10-10",
            birthplace: "Bogor",
            gender: "M",
            passport: "A 1234567 ",
            heir: "Didi Iskandar",
            others: [
              {
                fullname: "Fulan bin Fulan",
                birthdate: "2000-10-10",
              },
              {
                fullname: "Harta Rama",
                birthdate: "2002-10-10",
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ` + this.token,
            },
          }
        );
        if (response.data.status) {
          this.trx_id = response.data.trx_id;
          this.pay();
        } else {
          console.log("Enrollment failed: ", response.data.message);
          alert("Enrollment failed");
        }
      } catch (error) {
        console.log("Error: ", error);
        alert("error 1");
      }
    },
    async pay() {
      try {
        const response = await axios.post(
          "http://localhost:9000/generate-trx",
          {
            trx_id: this.trx_id,
          },
          {
            headers: {
              Authorization: `Bearer ` + this.token,
            },
          }
        );

        const result = response.data;
        window.snap.pay(result.token, {
          onSuccess: function (result) {
            alert("Payment success!");
            console.log(result);
          },
          onPending: function (result) {
            alert("Waiting for your payment!");
            console.log(result);
          },
          onError: function (result) {
            alert("Payment failed!");
            console.log(result);
          },
          onClose: function () {
            alert("You closed the popup without finishing the payment");
          },
        });
      } catch (error) {
        console.log("Error: ", error);
        alert("Failed to initiate payment");
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
      this.form_data.others[index].birth_date = func.FormatDate(value);
      this.selected_date4[index] = value;
      this.date_picker4[index] = false;
    },
    SyncOthers() {
      const capacity = this.form_data.capacity - 1;
      this.form_data.others = [];
      for (let i = 0; i < capacity; i++) {
        this.form_data.others.push({
          fullname: "",
          birth_date: "",
        });
        this.selected_date4.push(null);
        this.date_picker4.push(false);
      }
    },
    ValidateDateEnd(value) {
      if (new Date(value) > new Date(this.form_data.date_start) || !value) {
        return true;
      } else {
        return "Input tanggal setelah keberangkatan!";
      }
    },
    async validate() {
      // if (this.form) {
      this.e1 = 1;
      // } else {
      //   this.snackbar = true;
      // }
    },
    CheckPrice() {
      this.$refs.bro.validate().then((success) => {
        if (!success) {
          this.snackbar = true;
        } else {
          window.scrollTo({
            top: 0,
          });
        }
      });

      // if (!this.$refs.form_req.validate()) {
      //   this.snackbar = true;
      // } else {
      //   this.e1 = 1;
      //   window.scrollTo({
      //     top: 0,
      //   });
      //   this.GetPrice();
      //   this.AddItem();
      // }
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
        { label: "Produk", value: this.form_data.product },
        { label: "Kontribusi", value: this.form_data.type },
        { label: "Destinasi", value: this.form_data.destination },
        { label: "Berangkat", value: this.formatted_date },
        { label: "Pulang", value: this.formatted_date2 },
      ];
      this.table.push(...items);
    },
  },
  created() {
    // this.email = func.UsersEmail();
    // this.id = func.UsersID();
    // this.GetDetails(this.id)
    if (!localStorage.getItem("form_data")) {
      localStorage.setItem("form_data", JSON.stringify(this.form_data));
    }
    const form = JSON.parse(localStorage.getItem("form_data")) || {};
    this.capacity = form.capacity.toString();
    this.form_data.from = form.from;
    this.form_data.destination = form.destination;
    this.form_data.date_start = form.date_start;
    this.form_data.date_end = form.date_end;
    this.form_data.type = form.type;

    // this.product = localStorage.getItem("local_product_name");
    // this.product_id = localStorage.getItem("local_product_id");
    // this.contribution = JSON.parse(localStorage.getItem("array_ctr"));
    // this.country = JSON.parse(localStorage.getItem("array_dst"));

    // this.GetProvinces()
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
