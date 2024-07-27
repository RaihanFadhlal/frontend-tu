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
                    >mdi-book-clock</v-icon
                  >
                  <span style="color: #212121">Riwayat Polis</span>
                </div>
                <v-dialog v-model="dialog_policy" persistent max-width="700">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" prepend-icon="mdi-book-search">
                      <span class="body">Cari Polis</span>
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
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-text-field
                              variant="outlined"
                              v-model="form_data.policy_no"
                              label="Nomor Polis"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-book-information-variant"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-select
                              variant="outlined"
                              v-model="form_data.product"
                              label="Produk"
                              clearable
                              :items="products"
                              color="#001F48"
                              prepend-inner-icon="mdi-map"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-select
                              variant="outlined"
                              v-model="form_data.destination"
                              label="Destinasi"
                              clearable
                              :items="country"
                              color="#001F48"
                              prepend-inner-icon="mdi-map-marker"
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
                                  label="Berangkat"
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
                          <v-btn
                            color="#F57C00"
                            @click="
                              GetPolicy(
                                form_data.policy_no,
                                form_data.product,
                                form_data.destination,
                                form_data.date_start
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
                      <v-btn color="#001F48" @click="dialog_policy = false">
                        <span class="body">Tutup</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-card flat class="mt-3">
                  <div v-if="policies.length === 0" class="text-center">
                    <v-progress-circular
                      indeterminate
                      color="#3EC2D1"
                    ></v-progress-circular>
                  </div>
                  <v-row>
                    <v-col
                      v-for="(policy, index) in paginated_transactions"
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
                              <v-img class="my-auto rounded" :src="policy.image">
                              </v-img>
                            </v-col>
                            <v-col cols="12" sm="9" md="10" class="pb-0">
                              <v-row class="d-flex">
                                <v-col cols="12" sm="7" class="pb-0">
                                  <div
                                    class="body mb-2"
                                    style="color: #001f48; font-size: large"
                                  >
                                    {{ policy.product }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="color: #23cac0; font-size: medium"
                                  >
                                    {{ policy.no_policy }}
                                  </div>
                                  <div class="body mb-2" style="color: black">
                                    {{ policy.destination }}
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
                                    {{ FormatDate(policy.sdate) + " - " + FormatDate(policy.edate) }}
                                  </div>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col class="text-sm-end">
                              <v-btn
                                rounded
                                depressed
                                color="#F57C00"
                                style="color: white"
                                @click="GetPdf(policy.no_policy)"
                                >Lihat Polis
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
  name: "PolicyApp",
  components: {
    Navbar,
    FooterApp,
    AccountDrawer,
    AccountMenu,
  },
  data: () => ({
    drawer: true,
    rail: false,
    dialog_policy: false,
    policies: [
      {
        no_policy: "PTSUHK001",
        product: "Takaful Safari Haji dan Umroh",
        destination: "Saudi Arabia",
        sdate: "2024-03-10",
        edate: "2024-03-15",
        image: "https://www.madaninews.id/wp-content/uploads/2019/01/photo_post_181_0.jpg"
      },
    ],
    dialog_err: false,

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
      policy_no: "",
      product: "",
      destination: "",
      date_start: "",
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
    GetPolicy(no, name, dest, sdate) {
      let formdata = {
        id: func.UsersID(),
        no_policy: no,
        product: name,
        destination: dest,
        date_start: sdate,
      };
      let param = func.ParamPOST(formdata);
      axios
        .post(func.UrlPOST("apiSearchPolicy"), param, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let feedback = response.data;
          if (feedback.length > 0) {
            if (feedback[0].status === true) {
              this.policies = feedback.map((item) => ({
                ...item.data,
                sdate: func.FormatCustomBirthDate(moment(item.data.sdate)),
                edate: func.FormatCustomBirthDate(moment(item.data.edate)),
              }));
            } else {
              this.DialogActive("Failed (1) :  ", feedback[0].message);
            }
          } else {
            this.DialogActive("Belum ada polis yang terdaftar!");
          }
        })
        .catch((e) => {
          this.DialogActive("Failed (3) :", e);
        });
      this.dialog_policy = false;
    },
    UpdateDate(value) {
      this.form_data.date_start = func.FormatDate(value);
      this.date_menu = false;
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog_err = true;
    },
    GetPdf(policy) {
      let formdata = {
        id: func.UsersID(),
        refid: policy,
      };
      let param = func.ParamPOST(formdata);
      axios
        .post(func.UrlPOST("apiSafariGetPdf"), param, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let feedback = response.data;
          if (feedback.length > 0) {
            if (feedback[0].status === true) {
              window.open(feedback[0].data.policy_url, "_blank");
            } else {
              this.DialogActive("Failed (1) : ", feedback[0].message);
            }
          } else {
            this.DialogActive("Failed (2)");
          }
        })
        .catch((e) => {
          this.DialogActive("Failed (3) : ", e);
        });
    },
    OpenPolicyUrl(url) {
      window.open(url, "_blank");
    },

    UpdatePage(page) {
      this.current_page = page;
    },
    UpdateRail(value) {
      this.rail = value;
    },
    FormatDate(date){
      return func.FormatOutputDate(date, 'simple', 'api')
    }
  },
  created() {
    // this.GetPolicy("", "", "")
  },
  computed: {
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, 'simple')
        : "";
    },
    paginated_transactions() {
      const start = (this.current_page - 1) * this.per_page;
      const end = start + this.per_page;

      return this.policies.slice(start, end);
    },
    pages() {
      return Math.ceil(this.policies.length / this.per_page);
    },
  },
};
</script>
<style>
.theme--light.v-pagination .v-pagination__item--active {
  color: black
}
</style>