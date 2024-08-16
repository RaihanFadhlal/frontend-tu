<template>
  <v-app class="body">
    <Navbar />
    <v-main>
      <v-container >
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
                  <span style="color: #212121">Takaful Safari</span>
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
                              :items="countries"
                              color="#001F48"
                              prepend-inner-icon="mdi-map-marker"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-btn
                            color="#F57C00"
                            @click="
                              GetPolicies(
                                form_data.product,
                                form_data.destination
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
                  <div v-if="policy.length === 0" class="text-center">
                    Belum ada Polis
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
                              <v-img
                                class="my-auto rounded"
                                :src="policy.image"
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
                                    {{ policy.product_name }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="color: #23cac0; font-size: medium"
                                  >
                                    {{ "No Polis : " + policy.policy_id }}
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
                                    {{
                                      FormatDate(policy.sdate) +
                                      " - " +
                                      FormatDate(policy.edate)
                                    }}
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
                                @click="GetPdf(policy.policy_id)"
                                >Unduh Polis
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
                    >mdi-shield-car</v-icon
                  >
                  <span style="color: #212121">Takaful Abror</span>
                </div>
                <v-dialog
                  v-model="dialog_policy_abror"
                  persistent
                  max-width="700"
                >
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
                            <v-select
                              variant="outlined"
                              v-model="form_data.car_type"
                              label="Produk"
                              clearable
                              :items="cars"
                              color="#001F48"
                              prepend-inner-icon="mdi-car"
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
                              GetPoliciesAbror(
                                form_data.car_type,
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
                      <v-btn
                        color="#001F48"
                        @click="dialog_policy_abror = false"
                      >
                        <span class="body">Tutup</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-card flat class="mt-3">
                  <div v-if="policy_abror.length === 0" class="text-center">
                    Belum ada Polis
                  </div>
                  <v-row>
                    <v-col
                      v-for="(policy, index) in paginated_transactions2"
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
                                :src="policy.image"
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
                                    {{ policy.product_name }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="color: #23cac0; font-size: medium"
                                  >
                                    {{ "No Polis : " + policy.policy_id }}
                                  </div>
                                  <div class="body mb-2" style="color: black">
                                    {{ policy.car_type }}
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
                                      FormatDate(policy.date_start) +
                                      " - " +
                                      FormatDate(policy.date_end)
                                    }}
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
                                @click="GetPdf(policy.policy_id)"
                                >Unduh Polis
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-pagination
                    v-model="current_page"
                    :length="pages_abror"
                    @update:modelValue="UpdatePage"
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
import axios from "../../axios";

export default {
  name: "PolicyApp",
  components: {
    Navbar,
    FooterApp,
    AccountDrawer,
    AccountMenu,
  },
  data: () => ({
    date_menu: false,
    selected_date: null,
    drawer: true,
    rail: false,
    dialog_policy: false,
    policy: [],
    policy_abror: [],
    dialog_err: false,

    products: [
      "Takaful Safari Umroh Afdhol",
      "Takaful Safari Umroh dan Haji Khusus",
      "Takaful Safari Multitrip",
    ],
    cars: [
      "Avanza",
      "Vios",
      "Kijang Innova",
      "Alphard",
      "Brio",
      "Mobilio",
      "CRV",
      "HRV",
      "Xenia",
      "Terios",
      "GranMax Minibus",
      "CX-3",
      "Mazda MX-5RF",
      "Mazda2 Sedan",
      "Pajero Sport",
      "Xpander",
      "Triton",
      "X-Trail",
      "Livina",
      "Leaf",
    ],
    countries: [],
    dialog_policy_abror: false,

    form_data: {
      product: null,
      destination: null,
    },

    current_page: 1,
    current_page_abror: 1,
    per_page: 3,
  }),

  methods: {
    async GetPolicies(name, dest) {
      try {
        const response = await axios.post("/get-policies", {
          product_name: name,
          destination: dest,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            if (name !== "" && dest !== "") {
              this.DialogActive("Belum ada polis yang terdaftar!");
            }
            this.dialog_policy = false;
          } else {
            this.policy = response.data.data;
            this.dialog_policy = false;
          }
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    async GetPoliciesAbror(car, sdate) {
      try {
        const response = await axios.post("/get-policies-abror", {
          car_type: car,
          date_start: sdate,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            if (car !== "" && sdate !== "") {
              this.DialogActive("Belum ada polis yang terdaftar!");
            }
            this.dialog_policy_abror = false;
          } else {
            this.policy_abror = response.data.data;
            this.dialog_policy_abror = false;
          }
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    GetPdf(policyId) {
      axios
        .post(
          "/download-pdf",
          { policy_id: policyId },
          { responseType: "blob" }
        )
        .then((response) => {
          if (response.status === 200) {
            const url = window.URL.createObjectURL(
              new Blob([response.data], { type: "application/pdf" })
            );
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", policyId + ".pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            console.error("Error retrieving PDF:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error retrieving PDF:", error);
        });
    },
    async GetCountries() {
      try {
        const response = await axios.get("/countries");
        if (response.data.status) {
          this.countries = response.data.data.countries
            .split(",")
            .map((country) => country.trim());
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    Reload() {
      location.reload();
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
    OpenPolicyUrl(url) {
      window.open(url, "_blank");
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
  async created() {
    await this.GetPolicies("", "");
    await this.GetPoliciesAbror("", "");
    await this.GetCountries();
  },
  computed: {
    paginated_transactions() {
      const start = (this.current_page - 1) * this.per_page;
      const end = start + this.per_page;

      return this.policy.slice(start, end);
    },
    paginated_transactions2() {
      const start = (this.current_page_abror - 1) * this.per_page;
      const end = start + this.per_page;

      return this.policy_abror.slice(start, end);
    },
    pages() {
      return Math.ceil(this.policy.length / this.per_page);
    },
    pages_abror() {
      return Math.ceil(this.policy_abror.length / this.per_page);
    },
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, "simple")
        : "";
    },
  },
};
</script>
<style>
.theme--light.v-pagination .v-pagination__item--active {
  color: black;
}
</style>
