<template>
  <v-app>
    <v-main class="body">
      <NavBar />
      <v-row class="explore-row d-flex ml-15 mt-4">
        <v-col cols="5" sm="4" md="3" lg="2">
          <v-img :src="UploadIcon('../../assets/explore/', 'logo.png')"></v-img>
        </v-col>
        <v-col>
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
            <v-img
              :src="UploadIcon('../../assets/explore/', 'kabah1.png')"
            ></v-img>
            <v-dialog width="600" v-model="dialog_tnc">
              <template v-slot:activator="{ props: activatorProps }">
                <v-row justify="center">
                  <v-btn
                    color="#3EC2D1"
                    dark
                    v-bind="activatorProps"
                    class="hidden-xs-only mt-5 rounded-lg text-white"
                  >
                    Syarat dan Ketentuan
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
                  <v-card-text
                    v-html="terms"
                    class="mt-2 grey--text text--darken-3"
                    style="font-size: medium"
                  ></v-card-text>
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
            <div class="product-detail ml-3 mb-1">{{ detail }}</div>
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
                <template v-slot:[`item.min-max`]="{ item }">
                  {{ `${item.min} - ${item.max} hari` }}
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
                    >Daftar
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
            <!-- Dialog -->
            <v-dialog persistent v-model="dialog_login" max-width="400px">
              <v-card class="body">
                <v-card-title class="font-weight-bold mt-2"
                  ><v-icon class="mr-2 mb-1" left color="red">mdi-alert-circle-outline</v-icon
                  >Belum Login</v-card-title
                >
                <v-card-text class="pt-1 ml-4" style="font-size: large;"
                  >Login untuk mendaftar produk!
                </v-card-text>
                <v-card-actions class="justify-end">
                  <router-link to="/login"
                    ><v-btn  class="mr-2">Login</v-btn></router-link
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
                <v-expansion-panel-title class="text-blue">
                  {{ item.name }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-table class="body">
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
                        <td>{{ item.type }}</td>
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
                    Syarat dan Ketentuan
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
                  <v-card-text
                    v-html="terms"
                  ></v-card-text>
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
import func from "../../function";
import NavBar from "../../components/Navbar.vue";
import FooterApp from "../../components/FooterApp.vue";
import SearchProduct from "./SearchProduct.vue";

export default {
  name: "DetailApp",
  components: {
    NavBar,
    FooterApp,
    SearchProduct,
  },
  data: () => {
    return {
      check_login: null,
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
      contribution: ["Basic", "Gold", "Platinum", "Titanium"],
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
          key: "min-max",
          sortable: false,
        },
        {
          title: "Harga",
          key: "price",
          sortable: false,
        },
      ],
      tab: null,
      dialog_tnc: false,
      dialog_login: false,

      name: "Takaful Safari Umroh dan Haji Khusus",
      detail:
        "Memberikan santunan terhadap risiko pembatalan keberangkatan, meninggal dunia, cacat tetap dan biaya pengobatan Anda ketika Ibadah Umroh dan Haji Khusus",
      tab: null,
      table: {
        Basic: [
          {
            min: 1,
            max: 10,
            price: 60000,
          },
          {
            min: 11,
            max: 15,
            price: 65000,
          },
          {
            min: 16,
            max: 20,
            price: 70000,
          },
          {
            min: 21,
            max: 25,
            price: 75000,
          },
          {
            min: 26,
            max: 30,
            price: 85000,
          },
          {
            min: 31,
            max: 40,
            price: 100000,
          },
        ],
        Gold: [
          {
            min: 1,
            max: 10,
            price: 85000,
          },
          {
            min: 11,
            max: 15,
            price: 90000,
          },
          {
            min: 16,
            max: 20,
            price: 95000,
          },
          {
            min: 21,
            max: 25,
            price: 100000,
          },
          {
            min: 26,
            max: 30,
            price: 110000,
          },
          {
            min: 31,
            max: 40,
            price: 125000,
          },
        ],
        Platinum: [
          {
            min: 1,
            max: 10,
            price: 115000,
          },
          {
            min: 11,
            max: 15,
            price: 120000,
          },
          {
            min: 16,
            max: 20,
            price: 125000,
          },
          {
            min: 21,
            max: 25,
            price: 130000,
          },
          {
            min: 26,
            max: 30,
            price: 140000,
          },
          {
            min: 31,
            max: 40,
            price: 155000,
          },
        ],
        Titanium: [
          {
            min: 1,
            max: 10,
            price: 140000,
          },
          {
            min: 11,
            max: 15,
            price: 150000,
          },
          {
            min: 16,
            max: 20,
            price: 160000,
          },
          {
            min: 21,
            max: 25,
            price: 170000,
          },
          {
            min: 26,
            max: 30,
            price: 185000,
          },
          {
            min: 31,
            max: 40,
            price: 200000,
          },
        ],
      },
      selected_type: "Basic",
      benefits: [
        {
          name: "Biaya Perawatan Medis",
          detail: [
            {
              type: "Biaya perawatan medis di luar negeri (akibat sakit/kecelakaan) - reimburstment",
              basic: "Maksimum 100.000.000",
              gold: "Maksimum 100.000.000",
              platinum: "Maksimum 200.000.000",
              titanium: "Maksimum 300.000.000",
            },
            {
              type: "Biaya perawatan medis di luar negeri karena penyakit khusus (preexisting)- reimburstment",
              basic: "Maksimum 10.000.000",
              gold: "Maksimum 10.000.000",
              platinum: "Maksimum 10.000.000",
              titanium: "Maksimum 10.000.000",
            },
            {
              type: "Biaya perawatan medis lanjutan di Indonesia",
              basic: "Maksimum 2.000.000",
              gold: "Maksimum 2.000.000",
              platinum: "Maksimum 2.000.000",
              titanium: "Maksimum 2.000.000",
            },
          ],
        },
        {
          name: "Evakuasi / pemulangan medis dan jenazah",
          detail: [
            {
              type: "Evakuasi medis darurat",
              basic: "Maksimum 1.000.000.000",
              gold: "Maksimum 10.000.000.000",
              platinum: "Maksimum 10.000.000.000",
              titanium: "Maksimum 10.000.000.000",
            },
            {
              type: "Pemulangan medis darurat",
              basic: "Maksimum 1.000.000.000",
              gold: "Maksimum 10.000.000.000",
              platinum: "Maksimum 10.000.000.000",
              titanium: "Maksimum 10.000.000.000",
            },
            {
              type: "Pemulangan Jenazah",
              basic: "Maksimum 1.000.000.000",
              gold: "Maksimum 10.000.000.000",
              platinum: "Maksimum 10.000.000.000",
              titanium: "Maksimum 10.000.000.000",
            },
          ],
        },
        {
          name: "Kecelakaan",
          detail: [
            {
              type: "Santunan meninggal dunia karena kecelakaan",
              basic: "50.000.000",
              gold: "50.000.000",
              platinum: "100.000.000",
              titanium: "150.000.000",
            },
            {
              type: "Santunan cacat tetap karena kecelakaan",
              basic: "Maksimum 50.000.000",
              gold: "Maksimum 50.000.000",
              platinum: "Maksimum 100.000.000",
              titanium: "Maksimum 150.000.000",
            },
          ],
        },
      ],
      terms: [
        "<ul><li>Usia peserta tidak dibatasi dan tidak sedang dirawat inap di rumah sakit atau sejenisnya</li><li>Masa berlaku asuransi 1-40 hari sesuai dengan periode kontribusi yang dibayarkan. Dimulai sejak tanggal peserta direncanakan meninggalkan Indonesia.</li><li>Biaya Administrasi berupa Biaya Polis dan Materai Rp 50.000,-</li><li>Laporan klaim harus sudah pengelola terima selambat-lambatnya 30 hari kalender sejak kejadian</li></ul>",
      ],
    };
  },

  methods: {
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
      if (this.check_login) {
        const formdata = JSON.parse(localStorage.getItem("form_data")) || {};
        formdata.type = this.form_data.type;
        formdata.capacity = this.form_data.capacity;
        localStorage.setItem("form_data", JSON.stringify(formdata));
        localStorage.setItem("array_ctr", JSON.stringify(this.contribution));
        localStorage.setItem("array_dst", JSON.stringify(this.destination));
        this.$router.push("/request");
      } else {
        this.dialog_login = true;
      }
    },
    GetDetails(productid) {
      let formdata = {
        id: productid,
      };
      let param = func.ParamPOST(formdata);
      axios
        .post(func.UrlPOST("apiSafariProduct"), param, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let feedback = response.data;
          if (feedback.length > 0) {
            if (feedback[0].status === true) {
              this.name = feedback[0].data.name;
              this.detail = feedback[0].data.desc;
              this.image = feedback[0].data.image;
              this.terms = feedback[0].data.tnc;
              this.table = feedback[0].data.price;
              this.contribution = feedback[0].data.type;
              this.benefits = feedback[0].data.benefits;
              this.destination = feedback[0].data.destination;
            } else {
              this.DialogActive("Gagal memuat detail1 : ", feedback[0].message);
              console.log("1");
            }
          } else {
            this.DialogActive("Gagal memuat detail2");
          }
        })
        .catch((e) => {
          this.DialogActive("Gagal memuat detail3 : ", e);
          console.log(e);
        });
    },
  },

  created() {
    //   this.check_login = func.CheckLogin()
    //   const param = this.$route.query.prod
    //   this.GetDetails(param)
    //   if (!localStorage.getItem("form_data")) {
    //     localStorage.setItem("form_data", JSON.stringify(this.form_data))
    //   }
    //   const form = JSON.parse(localStorage.getItem("form_data")) || {}
    //   if (form.capacity >= 1) {
    //     this.form_data.capacity = form.capacity
    //     this.form_data.from = form.from
    //     this.form_data.destination = form.destination
    //     this.form_data.date_start = form.date_start
    //     this.form_data.date_end = form.date_end
    //   } else {
    //     this.form_data.capacity = 1
    //   }
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
.v-dialog > .v-overlay__content > .v-card > .v-card-text, .v-dialog > .v-overlay__content > form > .v-card > .v-card-text {
    padding: 12px 40px 20px;
}
</style>
