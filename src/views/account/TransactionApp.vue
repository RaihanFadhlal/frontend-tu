<template>
  <v-app class="body">
    <Navbar />
    <v-main>
      <v-container>
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
                    >mdi-cash-clock</v-icon
                  >
                  <span style="color: #212121">Riwayat Transaksi</span>
                </div>
                <v-dialog v-model="dialog_trx" persistent max-width="700">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" prepend-icon="mdi-text-box-search">
                      <span class="body">Cari Transaksi</span>
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
                          >mdi-text-box-search</v-icon
                        >
                        Cari Transaksi
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
                              v-model="form_data.status"
                              label="Status Pembayaran"
                              clearable
                              :items="pay_status"
                              color="#001F48"
                              prepend-inner-icon="mdi-invoice-text-clock"
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-btn
                            color="#F57C00"
                            @click="GetTrx(form_data.product, form_data.status)"
                          >
                            <span class="body">Cari</span>
                          </v-btn>
                        </v-row>
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-0">
                      <v-spacer></v-spacer>
                      <v-btn color="#001F48" @click="dialog_trx = false">
                        <span class="body">Tutup</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-card flat class="mt-3">
                  <div v-if="transactions.length === 0" class="text-center">
                    Belum ada transaksi
                  </div>
                  <v-row>
                    <v-col
                      v-for="(trx, index) in paginated_transactions"
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
                              <v-img class="my-auto rounded" :src="trx.image">
                              </v-img>
                            </v-col>
                            <v-col cols="12" sm="9" md="10" class="pb-0">
                              <v-row class="d-flex">
                                <v-col cols="12" sm="7" class="pb-0">
                                  <div
                                    class="body mb-2"
                                    style="color: #001f48; font-size: large"
                                  >
                                    {{ trx.product_name }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="color: #23cac0; font-size: medium"
                                  >
                                    {{ FormatCurrency(trx.total_price) }}
                                  </div>
                                  <div class="body mb-2" style="color: black">
                                    No Transaksi : {{ trx.transaction_id }}
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
                                    {{ FormatDate(trx.created_at) }}
                                  </div>
                                  <div
                                    class="body mb-2"
                                    style="font-size: small"
                                  >
                                    {{ FormatDateDetail(trx.expired_at) }}
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
                                >{{ trx.status }}
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
            </v-col>
          </v-row>
        </v-card>
        <v-dialog v-model="dialog_detail" max-width="900px">
          <v-card class="body">
            <div class="d-flex align-center">
              <span>
                <v-img
                  :src="
                    UploadIcon('/assets/request/', 'logotransparan.png')
                  "
                  width="60"
                  height="60"
                ></v-img>
              </span>
              <span class="ml-1" style="font-size: large">
                Detail Transaksi
              </span>
            </div>
            <v-divider class=""></v-divider>
            <v-card-text class="body">
              <div v-for="(trx, i) in trx_detail" :key="i">
                <div
                  v-for="(section, i) in detail_sections"
                  :key="i"
                  class="mb-3"
                >
                  <v-icon class="mx-3 mb-1" color="#001F48" small>{{
                    section.icon
                  }}</v-icon>
                  <span
                    class="blue-text font-weight-bold"
                    style="font-size: medium"
                    >{{ section.title }}</span
                  >
                  <v-row class="ml-7 mt-3">
                    <v-col
                      v-for="(field, i) in section.fields"
                      :key="i"
                      cols="12"
                      sm="6"
                      md="4"
                      class="py-0"
                    >
                      <v-text-field
                        v-model="trx[field.model]"
                        :label="field.label"
                        readonly
                        variant="outlined"
                        color="#001F48"
                        :prepend-inner-icon="field.icon"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div class="mb-2"></div>
                <v-row v-if="trx.others.length > 1" class="mb-2">
                  <v-col cols="12" class="mt-2 pb-0">
                    <v-icon class="mx-3 mb-1" color="#001F48" small
                      >mdi-account-group</v-icon
                    >
                    <span class="body blue-text" style="font-size: medium"
                      >Data Semua Peserta</span
                    >
                  </v-col>
                  <v-col class="ml-10">
                    <v-table fixed-header style="border: 0.5px solid grey">
                      <thead>
                        <tr>
                          <th class="text-left">Nama</th>
                          <th class="text-left">Tanggal Lahir</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in trx.others" :key="item.fullname">
                          <td style="font-size: medium">{{ item.fullname }}</td>
                          <td style="font-size: medium">
                            {{ FormatDate(item.birthdate) }}
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
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
//   import moment from "moment"

export default {
  name: "TransactionApp",
  components: {
    Navbar,
    FooterApp,
    AccountDrawer,
    AccountMenu,
  },
  data: () => ({
    drawer: true,
    rail: false,
    dialog_trx: false,
    dialog_detail: false,
    transactions: [],
    dialog_err: false,
    dialog_text: "",
    dialog_title: "",

    products: [
      "Takaful Safari Umroh Afdhol",
      "Takaful Safari Umroh dan Haji Khusus",
      "Takaful Safari Multitrip",
      "Takaful Abror",
    ],
    pay_status: ["Menunggu Pembayaran", "Gagal", "Berhasil"],

    form_data: {
      product: null,
      status: null,
    },

    date_menu: false,
    selected_date: null,

    current_page: 1,
    per_page: 4,

    detail_sections: [
      {
        icon: "mdi-invoice-text",
        title: "Data Transaksi",
        fields: [
          { label: "Produk", model: "product", icon: "mdi-map" },
          {
            label: "Nomor Transaksi",
            model: "trx_id",
            icon: "mdi-invoice-text-edit",
          },
          { label: "Nomor Pembayaran", model: "no_va", icon: "mdi-cash-edit" },
          { label: "Jumlah Harga", model: "price", icon: "mdi-cash-multiple" },
          { label: "Status", model: "status", icon: "mdi-invoice-text-clock" },
        ],
      },
      {
        icon: "mdi-airplane",
        title: "Data Perjalanan",
        fields: [
          { label: "Keberangkatan", model: "from", icon: "mdi-map-marker" },
          { label: "Destinasi", model: "destination", icon: "mdi-map-marker" },
          { label: "Kapasitas", model: "capacity", icon: "mdi-account-group" },
          {
            label: "Tanggal Berangkat",
            model: "date_start",
            icon: "mdi-calendar",
          },
          { label: "Tanggal Pulang", model: "date_end", icon: "mdi-calendar" },
          {
            label: "Jenis Kontribusi",
            model: "contribution",
            icon: "mdi-format-list-bulleted-type",
          },
        ],
      },
      {
        icon: "mdi-account",
        title: "Data Peserta",
        fields: [
          {
            label: "Nama Pendaftar",
            model: "fullname",
            icon: "mdi-badge-account",
          },
          { label: "Kota Lahir", model: "birthplace", icon: "mdi-map-marker" },
          { label: "Tanggal", model: "birthdate", icon: "mdi-calendar" },
          {
            label: "Jenis Kelamin",
            model: "gender",
            icon: "mdi-gender-male-female",
          },
          { label: "Ahli Waris", model: "heir", icon: "mdi-account-switch" },
          { label: "Nomor Passport", model: "passport", icon: "mdi-passport" },
        ],
      },
    ],
  }),

  methods: {
    async GetTrx(name, status) {
      try {
        const response = await axios.post("/get-trx", {
          product_name: name,
          status: status,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            if (name !== "" && status !== "") {
              this.DialogActive("Belum ada polis yang terdaftar!");
            }
            this.dialog_trx = false;
          } else {
            this.transactions = response.data.data;
            this.dialog_trx = false;
          }
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
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
    FormatCurrency(amount) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        fraction: 2,
      });
      return formatter.format(amount);
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
    FormatDateDetail(date) {
      if (date && date.length > 10) {
        return func.FormatOutputDate(date, "", "api") + date.slice(10);
      } else {
        return func.FormatOutputDate(date, "", "api");
      }
    },
  },
  async created() {
    await this.GetTrx("", "");
  },
  computed: {
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, "simple")
        : "";
    },
    paginated_transactions() {
      const start = (this.current_page - 1) * this.per_page;
      const end = start + this.per_page;

      return this.transactions.slice(start, end);
    },
    pages() {
      return Math.ceil(this.transactions.length / this.per_page);
    },
  },
};
</script>
<style>
.theme--light.v-pagination .v-pagination__item--active {
  color: black;
}
</style>
