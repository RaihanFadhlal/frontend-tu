<template>
  <v-app class="body">
    <Navbar />
    <v-main>
      <v-container class="container-profile">
        <AccountMenu />
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
                  <span style="color: #212121">Riwayat Klaim</span>
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
                            <v-text-field
                              variant="outlined"
                              v-model="form_data.claim_no"
                              label="Nomor Klaim"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-book-information-variant"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-text-field
                              variant="outlined"
                              v-model="form_data.category"
                              label="Kategori"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-map-marker"
                            ></v-text-field>
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
                                @update:model-value="UpdateDate"
                                color="#001F48"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-btn color="#F57C00" @click="">
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
                    <v-progress-circular
                      indeterminate
                      color="#3EC2D1"
                    ></v-progress-circular>
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
                              <v-img class="my-auto rounded" :src="claim.image">
                              </v-img>
                            </v-col>
                            <v-col cols="12" sm="9" md="10" class="pb-0">
                              <v-row class="d-flex">
                                <v-col cols="12" sm="7" class="pb-0">
                                  <div
                                    class="body mb-2"
                                    style="color: #001f48; font-size: large"
                                  >
                                    {{ claim.product }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="color: #23cac0; font-size: medium"
                                  >
                                    {{ claim.claim_no }}
                                  </div>
                                  <div class="body mb-2" style="color: black">
                                    {{ "Kategori : " + claim.category }}
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
                                      FormatDate(claim.req_date)
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
                                >{{ claim.status }}
                              </v-btn>
                              <v-btn
                              class="ml-1"
                                rounded
                                depressed
                                color="#F57C00"
                                style="color: white"
                                @click=""
                                >Lihat Klaim
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-pagination
                      v-model="current_page"
                      :length="pages"
                      @update:modelValue="UpdatePage"
                      color="blue lighten-5"
                      class="mx-auto mt-2"
                    ></v-pagination>
                  </v-row>
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
//   import axios from "axios"
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
    dialog_claim: false,
    claims: [
      {
        status: "Diproses",
        claim_no: "CTSUHK001",
        product: "Takaful Safari Haji dan Umroh",
        category: "Sakit Keras",
        req_date: "2024-03-10",
        image:
          "https://www.madaninews.id/wp-content/uploads/2019/01/photo_post_181_0.jpg",
      },
    ],
    dialog_err: false,
    dialog_text: "",
    dialog_title: "",

    products: [
      "Takaful Safari Umroh Plus Covid New Normal",
      "Takaful Safari Umroh Afdhol",
      "Takaful Safari Umroh dan Haji Khusus",
      "Takaful Safari Multitrip",
      "Takaful Safari Umroh Non Covid (50 Ribu)",
      "Takaful Safari Umroh Non Covid (Plus Zam Zam)",
    ],
    country: ["Saudi Arabia", "Turki"],

    form_data: {
      claim_no: "",
      product: "",
      category: "",
      req_date: "",
    },

    date_menu: false,
    selected_date: null,

    current_page: 1,
    per_page: 5,
  }),

  methods: {
    Reload() {
      location.reload();
    },

    UpdateDate(value) {
      this.form_data.req_date = func.FormatDate(value);
      this.date_menu = false;
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog_err = true;
    },

    UpdatePage(page) {
      this.current_page = page;
    },
    UpdateRail(value) {
      this.rail = value;
    },
    FormatDate(date) {
      return func.FormatOutputDate(date, "simple", "api");
    },
  },
  created() {
    // this.GetPolicy("", "", "")
  },
  computed: {
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, "simple")
        : "";
    },
    paginated_claims() {
      const start = (this.current_page - 1) * this.per_page;
      const end = start + this.per_page;

      return this.claims.slice(start, end);
    },
    pages() {
      return Math.ceil(this.claims.length / this.per_page);
    },
  },
};
</script>
<style>
.theme--light.v-pagination .v-pagination__item--active {
  color: black;
}
</style>
