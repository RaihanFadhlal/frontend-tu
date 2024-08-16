<template>
  <v-app class="body">
    <Navbar />
    <v-main>
      <v-container>
        <AccountMenu/>
        <v-card>
          <v-row class="d-flex">
            <v-col class="hidden-md-and-down" :lg="rail === false ? '3' : '1'">
              <AccountDrawer v-model="drawer" @update-rail="UpdateRail" />
            </v-col>
            <v-col cols="12" :lg="rail === false ? '9' : '11'">
              <v-col cols="12">
                <div
                  class="mb-3 rounded-ts-xl rounded-be-xl"
                  style="background-color: #e3f2fd"
                >
                  <v-icon class="ma-4" color="grey-darken-1"
                    >mdi-shield-account</v-icon
                  >
                  <span style="color: #212121">Takaful Safari</span>
                </div>
                <v-dialog v-model="dialog_claim" persistent max-width="700">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" prepend-icon="mdi-shield-search">
                      <span class="body">Cari Klaim</span>
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
                          >mdi-shield-search</v-icon
                        >
                        Cari Klaim
                      </div>
                      <v-form class="body">
                        <v-row justify="center">
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-select
                              variant="outlined"
                              v-model="form_data.product"
                              :items="products"
                              label="Produk"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-shield-edit"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-menu
                              v-model="date_menu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ props }">
                                <v-text-field
                                  variant="outlined"
                                  v-model="formatted_date"
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
                                v-model="selected_date"
                                :max="tomorrow"
                                @update:model-value="UpdateDate"
                                color="#001F48"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-btn
                            color="#F57C00"
                            @click="
                              GetClaims(
                                this.form_data.product,
                                this.form_data.date_report
                              )
                            "
                          >
                            <span class="body">Cari</span>
                          </v-btn>
                        </v-row>
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-0">
                      <v-spacer></v-spacer>
                      <v-btn color="#001F48" @click="dialog_claim = false">
                        <span class="body">Tutup</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-card flat class="mt-3">
                  <div v-if="claims.length === 0" class="text-center">
                    Belum ada klaim
                  </div>
                  <v-row>
                    <v-col
                      v-for="(claim, index) in paginated_claims"
                      :key="index"
                      cols="12"
                      class="pb-0"
                    >
                      <v-card elevation="1">
                        <v-card-text>
                          <v-row>
                            <v-col
                              class="hidden-xs-only"
                              cols="4"
                              sm="3"
                              md="2"
                            >
                              <v-img
                                class="my-auto rounded"
                                :src="claim.evidence"
                              >
                              </v-img>
                            </v-col>
                            <v-col cols="12" sm="9" md="10" class="pb-0">
                              <v-row class="d-flex">
                                <v-col cols="12" sm="7" class="pb-0">
                                  <div
                                    class="body mb-2"
                                    style="color: #001f48; font-size: large"
                                  >
                                    {{ claim.product_name }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="color: #23cac0; font-size: medium"
                                  >
                                    {{ claim.claim_id }}
                                  </div>
                                  <div class="body mb-2" style="color: black">
                                    {{ "Detail : " + claim.detail }}
                                  </div>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="5"
                                  class="text-sm-end pb-0 pt-0 pt-sm-3"
                                >
                                  <div
                                    class="body mb-2"
                                    style="color: black; font-size: medium"
                                  >
                                    {{
                                      "Tanggal Pengajuan : " +
                                      FormatDate(claim.date_report)
                                    }}
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col class="text-sm-end">
                              <v-btn
                                rounded
                                depressed
                                style="
                                  color: #f57c00;
                                  border: 1px solid;
                                  background-color: white;
                                "
                                @click="GetClaimDetail(claim.claim_id, 'safari')"
                                >{{ claim.status }}
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-pagination
                    v-model="current_page"
                    :length="pages"
                    @update:modelValue="UpdatePage"
                    color="blue lighten-5"
                    class="mx-auto mt-8 mb-5"
                  ></v-pagination>
                </v-card>
              </v-col>
              <v-col cols="12">
                <div
                  class="mb-3 rounded-ts-xl rounded-be-xl"
                  style="background-color: #e3f2fd"
                >
                  <v-icon class="ma-4" color="grey-darken-1"
                    >mdi-shield-account</v-icon
                  >
                  <span style="color: #212121">Takaful Abror</span>
                </div>
                <v-dialog
                  v-model="dialog_claim_abror"
                  persistent
                  max-width="700"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" prepend-icon="mdi-shield-search">
                      <span class="body">Cari Klaim</span>
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
                          >mdi-shield-search</v-icon
                        >
                        Cari Klaim
                      </div>
                      <v-form class="body">
                        <v-row justify="center">
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-select
                              variant="outlined"
                              v-model="form_data_abror.car_type"
                              :items="cars"
                              label="Mobil"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-shield-edit"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-menu
                              v-model="date_menu_abror"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ props }">
                                <v-text-field
                                  variant="outlined"
                                  v-model="formatted_date_abror"
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
                                v-model="selected_date_abror"
                                :max="tomorrow"
                                @update:model-value="UpdateDate2"
                                color="#001F48"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-btn
                            color="#F57C00"
                            @click="
                              GetClaimsAbror(
                                form_data_abror.car_type,
                                form_data_abror.date_report
                              )
                            "
                          >
                            <span class="body">Cari</span>
                          </v-btn>
                        </v-row>
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-0">
                      <v-spacer></v-spacer>
                      <v-btn
                        color="#001F48"
                        @click="dialog_claim_abror = false"
                      >
                        <span class="body">Tutup</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-card flat class="mt-3">
                  <div v-if="claims_abror.length === 0" class="text-center">
                    Belum Ada Klaim
                  </div>
                  <v-row>
                    <v-col
                      v-for="(claim, index) in paginated_claims_abror"
                      :key="index"
                      cols="12"
                      class="pb-0"
                    >
                      <v-card elevation="1">
                        <v-card-text>
                          <v-row>
                            <v-col
                              class="hidden-xs-only"
                              cols="4"
                              sm="3"
                              md="2"
                            >
                              <v-img
                                class="my-auto rounded"
                                :src="claim.evidence"
                              >
                              </v-img>
                            </v-col>
                            <v-col cols="12" sm="9" md="10" class="pb-0">
                              <v-row class="d-flex">
                                <v-col cols="12" sm="7" class="pb-0">
                                  <div
                                    class="body mb-2"
                                    style="color: #001f48; font-size: large"
                                  >
                                    {{ claim.product_name }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="color: #23cac0; font-size: medium"
                                  >
                                    {{ claim.claim_id }}
                                  </div>
                                  <div class="body mb-2" style="color: black">
                                    {{ "Detail : " + claim.detail }}
                                  </div>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="5"
                                  class="text-sm-end pb-0 pt-0 pt-sm-3"
                                >
                                  <div
                                    class="body mb-2"
                                    style="color: black; font-size: medium"
                                  >
                                    {{
                                      "Tanggal Pengajuan : " +
                                      FormatDate(claim.date_report)
                                    }}
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col class="text-sm-end">
                              <v-btn
                                rounded
                                depressed
                                style="
                                  color: #f57c00;
                                  border: 1px solid;
                                  background-color: white;
                                "
                                @click="GetClaimDetail(claim.claim_id, 'abror')"
                                >{{ claim.status }}
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-pagination
                    v-model="current_page_abror"
                    :length="pages_abror"
                    @update:modelValue="UpdatePageAbror"
                    color="blue lighten-5"
                    class="mx-auto mt-8 mb-5"
                  ></v-pagination>
                </v-card>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
        <!-- Dialog -->
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
        <v-dialog v-model="dialog_result" max-width="600px">
          <v-card class="body">
            <v-card-title class="font-weight-bold mt-2"
              ><v-icon class="mr-2 mb-1" left :color="dr_color"
                >mdi-alert-circle-outline</v-icon
              >{{ "Klaim " + dr_status }}</v-card-title
            >
            <v-card-text class="pt-1 ml-8" style="font-size: large">
              {{ "Pesan : " + dr_msg }}
            </v-card-text>
            <v-card-text class="pt-1 ml-8" style="font-size: large">
              {{ "Biaya tercover : " + dr_cover }}
            </v-card-text>
            <v-card-text class="pt-1 ml-8" style="font-size: large">
              <v-img :src="dr_img"> </v-img>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn @click="dialog_result = false">Tutup</v-btn>
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
import axios from "../../axios"
//   import moment from "moment"

export default {
  name: "ClaimApp",
  components: {
    Navbar,
    FooterApp,
    AccountDrawer,
    AccountMenu,
  },
  data: () => ({
    drawer: true,
    rail: false,
    claims: [],
    claims_abror: [],
    dialog_err: false,
    dialog_text: "",
    dialog_title: "",

    dialog_result: false,
    dr_status: "-",
    dr_msg: "-",
    dr_cover: "-",
    dr_color: "-",
    dr_img: null,

    dialog_claim: false,
    date_menu: false,
    selected_date: null,

    dialog_claim_abror: false,
    date_menu_abror: false,
    selected_date_abror: null,

    cars: [],
    products: [
      "Takaful Safari Umroh Afdhol",
      "Takaful Safari Umroh dan Haji Khusus",
      "Takaful Safari Multitrip",
    ],
    country: ["Saudi Arabia", "Turki", "Malaysia"],

    form_data: {
      product: null,
      date_report: null,
    },

    form_data_abror: {
      car_type: null,
      date_report: null,
    },

    current_page: 1,
    current_page_abror: 1,

    per_page: 3,
    tomorrow : null,
  }),

  methods: {
    async GetClaims(name, date) {
      try {
        const response = await axios.post("/get-claim", {
          product_name: name,
          date_report: date,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            if (name !== "" && date !== "") {
            this.DialogActive("Belum ada klaim yang terdaftar!");
            }
            this.dialog_claim = false;
          } else {
            this.claims = response.data.data;
            this.dialog_claim = false;
          }
        } else {
          console.error("Error :", response.data.message);
        }
      } catch (error) {
        console.error("Error :", error);
      }
    },
    async GetClaimsAbror(car, date) {
      try {
        const response = await axios.post("/get-claim-abror", {
          car_type: car,
          date_report: date,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            if (car !== "" && date !== "") {
            this.DialogActive("Belum ada klaim yang terdaftar!");
            }
            this.dialog_claim_abror = false;
          } else {
            this.claims_abror = response.data.data;
            this.dialog_claim_abror = false;
          }
        } else {
          console.error("Error :", response.data.message);
        }
      } catch (error) {
        this.dialog_claim_abror = false;
        this.DialogActive("Belum ada klaim yang terdaftar!");
        console.error("Error :", error);
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
    async GetClaimDetail(id, types) {
      try {
        const response = await axios.post("/get-claim-detail", {
          claim_id: id,
          type: types,
        });
        if (response.data.status) {
          this.DialogResult(response.data.data.status, response.data.data.message, response.data.data.cover_cost, response.data.data.pay_proof)
        } else {
          this.DialogActive("Gagal mendapat detail")
        }
      } catch (error) {
        console.error("Error :", error);
      }
    },
    Reload() {
      location.reload();
    },
    UpdateDate(value) {
      this.form_data.date_report = func.FormatDate(value);
      this.date_menu = false;
    },
    UpdateDate2(value) {
      this.form_data_abror.date_report = func.FormatDate(value);
      this.date_menu_abror = false;
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog_err = true;
    },
    DialogResult(title, msg, cover, img) {
      this.dr_status =  title
      this.dr_msg = msg
      this.dr_cover = cover
      this.dr_img = img
      this.dr_color = "green"
      this.dialog_result = true
    },
    UpdatePage(page) {
      this.current_page = page;
    },
    UpdatePageAbror(page) {
      this.current_page_abror = page;
    },
    UpdateRail(value) {
      this.rail = value;
    },
    FormatDate(date) {
      return func.FormatOutputDate(date, "simple", "api");
    },
  },
  async created() {
     await this.GetClaims("","")
     await this.GetClaimsAbror("","")
     await this.GetCars()
     this.tomorrow = func.Tomorrow()
  },
  computed: {
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, "simple")
        : "";
    },
    formatted_date_abror() {
      return this.selected_date_abror
        ? func.FormatOutputDate(this.selected_date_abror, "simple")
        : "";
    },
    paginated_claims() {
      const start = (this.current_page - 1) * this.per_page;
      const end = start + this.per_page;

      return this.claims.slice(start, end);
    },
    paginated_claims_abror() {
      const start = (this.current_page_abror - 1) * this.per_page;
      const end = start + this.per_page;

      return this.claims_abror.slice(start, end);
    },
    pages() {
      return Math.ceil(this.claims.length / this.per_page);
    },
    pages_abror() {
      return Math.ceil(this.claims_abror.length / this.per_page);
    },
  },
};
</script>
<style>
.theme--light.v-pagination .v-pagination__item--active {
  color: black;
}
</style>
