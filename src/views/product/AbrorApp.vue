<template>
  <v-app>
    <v-main class="body">
      <Navbar />
      <v-row class="explore-row d-flex ml-2 ml-sm-15 mt-4">
        <v-col cols="6" sm="4" md="3" lg="2">
          <v-img
            :src="UploadIcon('../../assets/explore/', 'logo_abor.png')"
          ></v-img>
        </v-col>
      </v-row>
      <v-container class="ml-sm-10">
        <v-row>
          <v-col cols="12" md="6" lg="3">
            <v-img :src="image"></v-img>
            <v-dialog width="600" v-model="dialog_tnc">
              <template v-slot:activator="{ props: activatorProps }">
                <v-row justify="center">
                  <v-btn
                    color="#3EC2D1"
                    dark
                    v-bind="activatorProps"
                    class="hidden-sm-and-down mt-7 rounded-lg text-white"
                  >
                    <span class="body"> Syarat Kendaraan</span>
                  </v-btn>
                </v-row>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card class="body">
                  <v-card-title
                    class="d-flex justify-start align-center"
                    style="font-weight: 600; background-color: #bbdefb"
                  >
                    <v-col class="col-1-5">
                      <v-img
                        :src="
                          UploadIcon('../../assets/landing/', 'logo_abror.png')
                        "
                      ></v-img
                    ></v-col>

                    Syarat Kendaraan
                  </v-card-title>
                  <v-card-text>
                    <v-row
                      v-for="(term, index) in terms"
                      :key="index"
                      class="d-flex"
                    >
                      <v-col cols="1"> - </v-col>
                      <v-col cols="10"> {{ term }} </v-col>
                    </v-row></v-card-text
                  >

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog_tnc = false">
                      Tutup
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
            <v-dialog width="600" v-model="dialog_detail">
              <template v-slot:activator="{ props: activatorProps }">
                <v-row justify="center">
                  <v-btn
                    color="#3EC2D1"
                    dark
                    v-bind="activatorProps"
                    class="hidden-sm-and-down mt-2 rounded-lg text-white"
                  >
                    <span class="body"> Keterangan Lainnya</span>
                  </v-btn>
                </v-row>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card class="body">
                  <v-card-title
                    class="d-flex justify-start align-center"
                    style="font-weight: 600; background-color: #bbdefb"
                  >
                    <v-col class="col-1-5">
                      <v-img
                        :src="
                          UploadIcon('../../assets/landing/', 'logo_abror.png')
                        "
                      ></v-img
                    ></v-col>

                    Keterangan Lainnya
                  </v-card-title>
                  <v-card-text>
                    <v-row
                      v-for="(term, index) in details"
                      :key="index"
                      class="d-flex"
                    >
                      <v-col cols="1"> - </v-col>
                      <v-col cols="10"> {{ term }} </v-col>
                    </v-row></v-card-text
                  >

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog_detail = false">
                      Tutup
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
          <v-col cols="12" md="6">
            <div class="product-name ml-2 mt-2 mt-sm-0">{{ name }}</div>
            <div class="product-detail ml-3 mb-1">{{ desc }}</div>
            <div class="cost mt-5 mb-1 ml-2">Biaya</div>
            <v-card class="ml-2">
              <v-select
                class="specific"
                :items="contribution"
                v-model="selected_type"
                label="Pilih Jenis Kontribusi"
                hide-details
              >
              </v-select>
              <v-data-table-virtual
                hide-default-footer
                :items="table[selected_type]"
                :headers="table_headers"
              >
                <template v-slot:[`item.c`]="{ item }">
                  {{ item.c }}
                </template>
                <template v-slot:[`item.range_price`]="{ item }">
                  {{ FormatPriceRange(item.range_price) }}
                </template>
                <template v-slot:[`item.a1`]="{ item }">
                  {{ FormatPercent(item.a1) }}
                </template>
                <template v-slot:[`item.a2`]="{ item }">
                  {{ FormatPercent(item.a2) }}
                </template>
                <template v-slot:[`item.a3`]="{ item }">
                  {{ FormatPercent(item.a3) }}
                </template>
              </v-data-table-virtual>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card class="ml-3" color="#F7F7F7">
              <v-card-text>
                <div
                  class="text-center font-weight-bold text-orange mb-3"
                  style="font-size: large"
                >
                  Ajukan Pendaftaran
                </div>
                <div class="font-weight-bold text-grey-darken-1">
                  Jenis Kontribusi
                  <v-select
                    class="font-weight-bold"
                    :items="contribution"
                    v-model="form_data.contribution"
                    flat
                    variant="solo"
                    density="comfortable"
                    rounded
                  >
                  </v-select>
                </div>
                <div class="font-weight-bold text-grey-darken-1">
                  Brand Mobil
                  <v-select
                    class="font-weight-bold"
                    :items="brands"
                    v-model="form_data.brand"
                    flat
                    variant="solo"
                    density="comfortable"
                    rounded
                  >
                  </v-select>
                </div>
                <div class="font-weight-bold mb-2 text-grey-darken-1">
                  Tipe Mobil
                  <v-select
                    class="font-weight-bold"
                    :items="filteredTypes"
                    v-model="form_data.type"
                    flat
                    variant="solo"
                    density="comfortable"
                    rounded
                    :label="
                      form_data.brand == '' ? 'pilih brand terlebih dahulu' : ''
                    "
                  >
                  </v-select>
                </div>
                <v-row justify="center">
                  <v-btn
                    class="my-4"
                    rounded
                    color="#F57C00"
                    @click="RequestProduct"
                  >
                    <span class="body"> Daftar</span>
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Dialog -->
            <v-dialog persistent v-model="dialog_login" max-width="400px">
              <v-card class="body">
                <v-card-title class="font-weight-bold mt-2"
                  ><v-icon class="mr-2 mb-1" left color="red"
                    >mdi-alert-circle-outline</v-icon
                  >Belum Login</v-card-title
                >
                <v-card-text class="pt-1 ml-4" style="font-size: large"
                  >Login untuk mendaftar produk!
                </v-card-text>
                <v-card-actions class="justify-end">
                  <router-link to="/login"
                    ><v-btn class="mr-2">Login</v-btn></router-link
                  >
                  <v-btn @click="dialog_login = false">Batal</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(type, i) in br" :key="i" cols="12" md="6">
            <div class="cost mt-2 mb-2 ml-3">
              {{ type.title }}
            </div>
            <v-expansion-panels focusable class="ml-3">
              <v-expansion-panel v-for="(item, i) in benefits" :key="i">
                <v-expansion-panel-title
                  v-if="item.type == type.title"
                  class="text-blue"
                  style="font-weight: 550"
                >
                  {{ item.desc }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-table>
                    <thead>
                      <tr>
                        <th style="font-size: small">Standard</th>
                        <th style="font-size: small">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in item.detail" :key="item.type">
                        <td>{{ item.standard }}</td>
                        <td>{{ item.premium }}</td>
                      </tr>
                    </tbody>
                  </v-table></v-expansion-panel-text
                >
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-dialog width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-row justify="center">
                <v-btn
                  color="#3EC2D1"
                  dark
                  v-bind="activatorProps"
                  class="hidden-sm-and-up mt-10 rounded-lg"
                >
                  <span class="body"> Syarat Kendaraan</span>
                </v-btn>
              </v-row>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card class="body">
                <v-card-title class="blue lighten-4" style="font-weight: 600">
                  <v-sheet class="transparent">
                    <v-img
                      src="../assets/request/logotransparan.png"
                      width="60px"
                      class="mr-2"
                    ></v-img>
                  </v-sheet>
                  Syarat Kendaraan
                </v-card-title>
                <v-card-text v-html="terms"></v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog_tnc = false">
                    Tutup
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-row>
      </v-container>
    </v-main>
    <FooterApp />
    <!-- Dialog -->
    <v-dialog persistent v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="mt-1"
          ><v-icon class="mr-3" left color="red">mdi-alert-circle</v-icon
          >{{ dialog_title }}</v-card-title
        >
        <v-card-text>
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
import Navbar from "../../components/Navbar.vue";
import FooterApp from "../../components/FooterApp.vue";
import SearchProduct from "./SearchProduct.vue";
import axios from "../../axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "AbrorApp",
  components: {
    Navbar,
    FooterApp,
    SearchProduct,
  },
  data: () => {
    return {
      dialog: false,
      dialog_title: "",
      dialog_text: "",

      check_login: true,
      dialog_tnc: false,
      form_data: {
        brand: "",
        type: "",
        contribution: "Standard",
      },
      contribution: ["Standard", "Premium"],
      path: [
        {
          title: "Beranda",
          disabled: false,
          href: "/",
        },
        {
          title: "Detail",
          disabled: true,
          href: "/abror",
        },
      ],
      table_headers: [
        {
          title: "Tipe",
          key: "c",
          sortable: false,
        },
        {
          title: "Harga Pasar Mobil",
          key: "range_price",
          sortable: false,
        },
        {
          title: "Wilayah 1",
          key: "a1",
          sortable: false,
        },
        {
          title: "Wilayah 2",
          key: "a2",
          sortable: false,
        },
        {
          title: "Wilayah 3",
          key: "a3",
          sortable: false,
        },
      ],
      tab: null,
      dialog_login: false,
      dialog_detail: false,

      name: "",
      desc: "",
      image: "",
      cars: [],
      tab: null,
      table: {},
      selected_type: "Standard",
      benefits: [],
      terms: [
        "Penggunaan KBM : Pribadi, Dinas, Pribadi & Dinas",
        "Jenis KBM : Sedan, Jeep, Station Wagon dan Minibus",
        "Usia Kendaraan : 0 - 5 Tahun",
      ],
      countries: [],
      br: [{ title: "Manfaat" }, { title: "Resiko Sendiri" }],
      brands: [],
      types: [],
      details: [
        "Wilayah 1 : Sumatera dan sekitarnya",
        "Wilayah 2 : DKI Jakarta, Jawa Barat, dan Banten",
        "Wilayah 3 : Area lainnya",
        "Partial Loss: Kerusakan terjadi hanya di sebagian tempat pada kendaraan",
        "TLO : Kehilangan/ kerusakan diatas 75% dari nilai pertanggungan",
        "RSCC : Kerusakan yang diakibatkan oleh Aksi Masa Pemogokan Kerja, Penghalangan Kerja dan Perbuatan Jahat",
        "T&S : Kerusakan yang diakibatkan oleh aksi Terorisme dan Sabotase",
        "ETVE : Kerusakan yang diakibatkan oleh Gunung Meletus, Tsunami, Gempa, Abu Vulkanik",
        "FW : Kerugian akibat Banjir, Angin Topan, Angin Puting Beliung",
        "TJH : Kerugian yang melibatkan kerusakan kendaraan Pihak lain",
      ],
    };
  },

  methods: {
    ...mapMutations(["setAbror"]),
    async GetDetails() {
      try {
        const response = await axios.get("/get-abror");
        if (response.data.status) {
          this.name = response.data.data.name;
          this.desc = response.data.data.desc;
          this.image = response.data.data.image;
          this.table = this.ConvertTableKeys(response.data.data.price);
          this.cars = response.data.data.cars;
          this.benefits = response.data.data.benefits;
          this.brands = this.cars.map((car) => car.brand);
        } else {
          console.error("Error retrieving details:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving details:", error);
      }
    },
    ConvertTableKeys(data) {
      const convertedTable = {};
      Object.keys(data).forEach((key) => {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        convertedTable[capitalizedKey] = data[key];
      });
      return convertedTable;
    },
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
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
    RequestProduct() {
      if (this.form_data.brand == "" || this.form_data.type == "") {
        this.DialogActive("Isi Form Terlebih Dahulu");
      } else {
        if (this.isAuthenticated) {
          this.setAbror({
            cont: this.form_data.contribution,
            brand: this.form_data.brand,
            type: this.form_data.type,
            cars: this.cars,
            brands: this.brands
          });
          this.$router.push("/request-abror");
        } else {
          this.dialog_login = true;
        }
      }
    },
    FormatPriceRange(priceRange) {
      const cleanedPriceRange = priceRange.replace(/[()]/g, "").trim();
      const [minPrice, maxPrice] = cleanedPriceRange.split("-").map(Number);

      const formatNumber = (number) => {
        if (number >= 1_000_000_000) {
          return `${(number / 1_000_000_000).toFixed(0)} Miliar`;
        } else if (number >= 1_000_000) {
          return `${(number / 1_000_000).toFixed(0)} Juta`;
        } else {
          return number.toFixed(0);
        }
      };
      const minFormatted = formatNumber(minPrice);
      const maxFormatted = formatNumber(maxPrice);

      return `Rp ${minFormatted} - Rp ${maxFormatted}`;
    },
    FormatPercent(value) {
      return `${value.toFixed(2)}%`;
    },
  },

  computed: {
    ...mapGetters(["isAuthenticated"]),
    filteredTypes() {
      const selectedBrand = this.form_data.brand;
      const car = this.cars.find((c) => c.brand === selectedBrand);
      return car ? car.type : [];
    },
  },
  watch: {
    "form_data.brand": function (newBrand) {
      if (!newBrand) {
        this.form_data.type = null;
      }
    },
  },

  async created() {
    await this.GetDetails();
  },
};
</script>

<style scoped>
.product-name {
  color: #001f48;
  font-size: x-large;
}
.cost {
  color: #001f48;
  font-size: large;
}
.text-exp {
  color: #008493;
}
.search {
  margin-top: 20px;
  width: 300px;
}

@media screen and (max-width: 600px) {
  .search {
    margin-top: 10px;
    width: 200px;
  }
}
.v-slide-group__prev.v-slide-group__prev--disabled {
  display: none !important;
}
::v-deep(th) {
  font-weight: bold !important;
}
::v-deep(.mdi-chevron-down::before) {
  color: orange;
}
::v-deep(.mdi-chevron-up::before) {
  color: orange;
}
.col-1-5 {
  flex: 0 0 12.5%;
  max-width: 12.5%;
}
.v-dialog > .v-overlay__content > .v-card > .v-card-text,
.v-dialog > .v-overlay__content > form > .v-card > .v-card-text {
  padding: 12px 40px 20px;
}
</style>
