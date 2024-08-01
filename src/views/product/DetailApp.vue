<template>
  <v-app>
    <v-main class="body">
      <Navbar />
      <v-row class="explore-row d-flex ml-2 ml-sm-15 mt-4">
        <v-col cols="6" sm="4" md="3" lg="2">
          <v-img :src="UploadIcon('../../assets/explore/', 'logo.png')"></v-img>
        </v-col>
        <v-col cols="6">
          <v-dialog max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                class="body explore-button font-weight-bold"
                rounded
                v-bind="activatorProps"
              >
                <v-icon left class="mr-2">mdi-map-search</v-icon>
                Cari Asuransi
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <SearchProduct />
            </template>
          </v-dialog>
        </v-col>
      </v-row>
      <div>
        <v-breadcrumbs class="bc mt-2" :items="path">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </div>
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
                    class="hidden-sm-and-down mt-5 rounded-lg text-white"
                  >
                    <span class="body"> Syarat dan Ketentuan</span>
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
                          UploadIcon(
                            '../../assets/request/',
                            'logotransparan.png'
                          )
                        "
                      ></v-img
                    ></v-col>

                    Syarat dan Ketentuan
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
                <template v-slot:[`item.day_min-day_max`]="{ item }">
                  {{ `${item.day_min} - ${item.day_max} hari` }}
                </template>
                <template v-slot:[`item.price`]="{ item }">
                  {{
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.price)
                  }}
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
                    v-model="form_data.type"
                    flat
                    variant="solo"
                    density="comfortable"
                    rounded
                  >
                  </v-select>
                </div>
                <div class="font-weight-bold mb-2 text-grey-darken-1">
                  Jumlah Peserta
                  <v-text-field
                    class="font-weight-bold"
                    number
                    v-model="form_data.capacity"
                    flat
                    variant="solo"
                    density="comfortable"
                    rounded
                    :rules="[OnlyNumbers]"
                  >
                  </v-text-field>
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
        <v-row justify-center>
          <v-col class="hidden-xs-only" cols="0" lg="3"> </v-col>
          <v-col cols="12" lg="9">
            <div class="cost mt-2 mb-2 ml-3">Manfaat</div>
            <v-expansion-panels focusable class="ml-3">
              <v-expansion-panel v-for="(item, i) in benefits" :key="i">
                <v-expansion-panel-title
                  class="text-blue"
                  style="font-weight: 550"
                >
                  {{ item.desc }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-table>
                    <thead>
                      <tr>
                        <th style="font-size: small">Jenis Manfaat</th>
                        <th style="font-size: small">Basic</th>
                        <th style="font-size: small">Gold</th>
                        <th style="font-size: small">Platinum</th>
                        <th style="font-size: small">Titanium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in item.detail" :key="item.type">
                        <td>{{ item.detail }}</td>
                        <td>{{ item.basic }}</td>
                        <td>{{ item.gold }}</td>
                        <td>{{ item.platinum }}</td>
                        <td>{{ item.titanium }}</td>
                      </tr>
                    </tbody>
                  </v-table></v-expansion-panel-text
                >
              </v-expansion-panel>
            </v-expansion-panels>
            <v-dialog width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-row justify="center">
                  <v-btn
                    color="#3EC2D1"
                    dark
                    v-bind="activatorProps"
                    class="hidden-sm-and-up mt-10 rounded-lg"
                  >
                    <span class="body"> Syarat dan Ketentuan</span>
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
                    Syarat dan Ketentuan
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
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FooterApp />
    <!-- Dialog -->
    <v-dialog persistent v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title
          ><v-icon left color="red">mdi-logout</v-icon
          >{{ dialog_title }}</v-card-title
        >
        <v-card-text>
          {{ dialog_text }}
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="CloseDialog">Tutup</v-btn>
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
  name: "DetailApp",
  components: {
    Navbar,
    FooterApp,
    SearchProduct,
  },
  data: () => {
    return {
      check_login: true,
      dialog_search: false,
      dialog_tnc: false,
      form_data: {
        from: "",
        destination: "",
        date_start: "",
        date_end: "",
        capacity: "1",
        type: "Basic",
      },
      contribution: [],
      path: [
        {
          title: "Beranda",
          disabled: false,
          href: "/",
        },
        {
          title: "Pencarian",
          disabled: false,
          href: "/safari",
        },
        {
          title: "Detail",
          disabled: true,
          href: "/detail",
        },
      ],
      table_headers: [
        {
          title: "Periode",
          key: "day_min-day_max",
          sortable: false,
        },
        {
          title: "Harga",
          key: "price",
          sortable: false,
        },
      ],
      tab: null,
      dialog_login: false,

      name: "",
      desc: "",
      image: "",
      tab: null,
      table: {},
      selected_type: "Basic",
      benefits: [],
      terms: [],
      countries: [],
    };
  },

  methods: {
    ...mapMutations(["setProduct"]),
    async GetDetails(id) {
      try {
        const response = await axios.get("/detail", {
          params: { id: id },
        });
        if (response.data.status) {
          this.name = response.data.data.name;
          this.desc = response.data.data.desc;
          this.image = response.data.data.image;
          this.table = this.ConvertTableKeys(response.data.data.price);
          this.contribution = response.data.data.type;
          this.benefits = response.data.data.benefits;
          this.countries = response.data.data.countries.split(" , ");
          this.terms = response.data.data.tnc
            .split("*")
            .map((term) => term.trim())
            .filter((term) => term);
          this.setProduct({
            code: id.slice(0, -2),
            name: response.data.data.name,
          });
        } else {
          console.error("Error retrieving details:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving details:", error);
      }
    },
    ConvertTableKeys(priceData) {
      const convertedTable = {};
      Object.keys(priceData).forEach((key) => {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        convertedTable[capitalizedKey] = priceData[key];
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
      if (this.isAuthenticated) {
        const formdata = JSON.parse(localStorage.getItem("form_safari")) || {};
        formdata.type = this.form_data.type;
        formdata.capacity = this.form_data.capacity;
        localStorage.setItem("form_safari", JSON.stringify(formdata));
        localStorage.setItem("contribution", JSON.stringify(this.contribution));
        localStorage.setItem("countries", JSON.stringify(this.countries));
        this.$router.push("/request");
      } else {
        this.dialog_login = true;
      }
    },
  },

  computed: {
    ...mapGetters(["isAuthenticated"]),
  },

  async created() {
    const param = this.$route.query.id;
    await this.GetDetails(param);
    if (!localStorage.getItem("form_safari")) {
      localStorage.setItem("form_safari", JSON.stringify(this.form_data));
    }
    const form = JSON.parse(localStorage.getItem("form_safari")) || {};
    if (form.capacity >= 1) {
      this.form_data.capacity = form.capacity;
      this.form_data.from = form.from;
      this.form_data.destination = form.destination;
      this.form_data.date_start = form.date_start;
      this.form_data.date_end = form.date_end;
    } else {
      this.form_data.capacity = 1;
    }
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
