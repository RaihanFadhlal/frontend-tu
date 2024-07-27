<template>
  <v-card color="white" class="body pt-5">
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
        <v-icon left class="mr-2 mb-1" color="#001F48">mdi-map-search</v-icon>
        Cari Asuransi
      </div>
      <v-form v-model="form" class="body">
        <v-row justify="center">
          <v-col cols="12" sm="4" class="py-0">
            <v-autocomplete
              variant="outlined"
              v-model="form_data.from"
              label="Keberangkatan"
              clearable
              prepend-inner-icon="mdi-map-marker"
              :rules="[OnlyAlphabet]"
              :items="formatted_prov"
              color="#001F48"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4" class="py-0">
            <v-select
              variant="outlined"
              v-model="form_data.destination"
              label="Destinasi"
              :items="countries"
              clearable
              prepend-inner-icon="mdi-map-marker"
              color="#001F48"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4" class="py-0">
            <v-text-field
              variant="outlined"
              v-model="form_data.capacity"
              label="Kapasitas"
              clearable
              prepend-inner-icon="mdi-account"
              :rules="[OnlyNumbers]"
              color="#001F48"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <v-menu
              v-model="date_menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  variant="outlined"
                  v-model="formatted_date"
                  label="Tanggal Berangkat"
                  prepend-inner-icon="mdi-calendar"
                  v-bind="props"
                  readonly
                  color="#001F48"
                ></v-text-field>
              </template>
              <v-date-picker
                class="body"
                v-model="selected_date"
                @update:model-value="UpdateDate"
                :min="today"
                color="#001F48"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" class="py-0">
            <v-menu
              v-model="date_menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  variant="outlined"
                  v-model="formatted_date2"
                  label="Tanggal Pulang"
                  prepend-inner-icon="mdi-calendar"
                  v-bind="props"
                  readonly
                  color="#001F48"
                  :rules="[ValidateDateEnd]"
                ></v-text-field>
              </template>
              <v-date-picker
                class="body"
                v-model="selected_date2"
                @update:model-value="UpdateDate2"
                :min="today"
                color="#001F48"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" class="py-0"> </v-col>
        </v-row>
        <v-row justify="center">
          <v-btn color="#F57C00" @click="GetData">
            <span class="body">Cek Disini</span>
          </v-btn>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-spacer></v-spacer>
      <v-btn color="#001F48" @click="Reload">
        <span class="body">Tutup</span>
      </v-btn>
    </v-card-actions>
    <!-- Dialog -->
    <v-dialog persistent v-model="dialog" max-width="400px">
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
          <v-btn @click="dialog = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "../../axios"
import func from "../../function";

export default {
  name: "SearchProduct",
  props: {
    color: String,
  },
  components: {},
  data() {
    return {
      countries: "",
      dialog: false,
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

      form_data: {
        from: null,
        destination: null,
        date_start: "",
        date_end: "",
        capacity: "",
      },

      date_menu: false,
      date_menu2: false,
      selected_date: null,
      selected_date2: null,

      //rules
      OnlyAlphabet: (v) =>
        /^[a-zA-Z\s]*$/.test(v) || "Tidak boleh ada simbol atau angka",
      today: new Date().toISOString().split("T")[0],
    };
  },
  computed: {
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
  },
  async created() {
    await this.GetCountries()
    const form = JSON.parse(localStorage.getItem("form_safari")) || {};
    this.form_data.capacity = form.capacity.toString();
    this.form_data.from = form.from;
    this.form_data.destination = form.destination;
    this.form_data.date_start = form.date_start;
    this.form_data.date_end = form.date_end;
    this.form_data.type = form.type;

    this.selected_date = new Date(this.form_data.date_start);
    this.selected_date2 = new Date(this.form_data.date_end);
  },
  methods: {
    async GetCountries() {
      try {
        const response = await axios.get("/countries")
        if (response.data.status) {
          this.countries = response.data.data.countries.split(',').map(country => country.trim());
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    UpdateDate(value) {
      this.form_data.date_start = func.FormatDate(value);
      this.date_menu = false;
    },
    UpdateDate2(value) {
      this.form_data.date_end = func.FormatDate(value);
      this.date_menu2 = false;
    },
    ValidateDateEnd(value) {
      if (new Date(value) > new Date(this.form_data.date_start) || !value) {
        return true;
      } else {
        return "Input tanggal setelah keberangkatan!";
      }
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog = true;
    },
    OnlyNumbers(value) {
      const isnumber = /^[+\d]+$/.test(value);
      const iszero = value !== "0";
      return (isnumber && iszero) || "Input data salah";
    },
    GetData() {
      if (!this.form) {
        this.DialogActive("Input Data Salah", "Mohon isi form dengan benar!");
      } else {
        localStorage.setItem("form_safari", JSON.stringify(this.form_data));
        if (this.$route.path === "/safari") {
          location.reload();
        } else {
          this.$router.push("/safari");
        }
      }
    },
    Reload() {
      location.reload();
    },
  },
};
</script>

<style></style>
