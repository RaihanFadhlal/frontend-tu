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
        <v-breadcrumbs class="bc mt-2" :items="items">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>

        <v-chip
          variant="flat"
          color="#F57C00"
          class="ch mb-3 font-weight-bold"
          elevation="3"
        >
          <v-icon left> mdi-airplane-marker </v-icon>
          {{ "Destinasi : " + destination }}
        </v-chip>
      </div>

      <v-container>
        <div v-if="products.length === 0" class="text-center">
          <v-progress-circular
            indeterminate
            color="#3EC2D1"
          ></v-progress-circular>
        </div>
        <v-row>
          <v-col
            v-for="(product, index) in products"
            :key="index"
            class="mb-2"
            cols="12"
            sm="8"
            md="6"
          >
            <v-hover v-slot="{ hover }">
              <v-card
                color="#f6fafb"
                :elevation="hover ? 16 : 2"
                :class="{ 'on-hover': hover }"
              >
                <v-card-text>
                  <v-row>
                    <v-col cols="5" lg="4">
                      <v-img
                        class="my-auto"
                        :src="UploadIcon('../../assets/explore/', product.img)"
                      >
                      </v-img>
                    </v-col>
                    <v-col cols="7">
                      <div
                        class="body mb-2"
                        style="color: #001f48; font-size: large"
                      >
                        {{ product.name }}
                      </div>
                      <span
                        class="body mb-2"
                        style="color: #9f9f9f; font-size: medium"
                        >Mulai dari </span
                      ><span
                        class="body mb-2"
                        style="color: #23cac0; font-size: medium"
                        >{{ FormatCurrency(product.price) }}</span
                      >
                      <div>
                        <v-btn
                          class="mt-4"
                          rounded
                          color="#F57C00"
                          @click="ChooseProduct(product)"
                        >
                          <v-text style="color: aliceblue; font-weight: 600"
                            >Detail</v-text
                          >
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <FooterApp />
  </v-app>
</template>

<script>
import func from "../../function";
import NavBar from "../../components/Navbar.vue";
import FooterApp from "../../components/FooterApp.vue";
import SearchProduct from "./SearchProduct.vue";

export default {
  name: "ExploreApp",
  components: {
    NavBar,
    FooterApp,
    SearchProduct,
  },
  data: () => ({
    dialog_search: false,
    dialog: false,
    items: [
      {
        title: "Beranda",
        disabled: false,
        href: "/",
      },
      {
        title: "Pencarian",
        disabled: true,
        href: "/",
      },
    ],
    products: [
      {
        name: "Takaful Safari Umroh dan Haji Khusus",
        price: "60000",
        img: "kabah1.png",
      },
      {
        name: "Takaful Multitrip",
        price: "170000",
        img: "kabah2.png",
      },
      {
        name: "Takaful Safari Umroh Non Covid",
        price: "60000",
        img: "kabah1.png",
      },
      {
        name: "Takaful Safari Umroh Non Covid (50 Ribu)",
        price: "50000",
        img: "kabah1.png",
      },
      {
        name: "Takaful Safari Umroh Non Covid (Plus Zam Zam)",
        price: "85000",
        img: "kabah1.png",
      },
      {
        name: " Takaful Safari Umroh Plus Covid New Normal",
        price: "125000",
        img: "kabah1.png",
      },
    ],
    destination: "",
  }),

  methods: {
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
    FormatCurrency(amount) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        fraction: 2,
      });
      return formatter.format(amount);
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog = true;
    },
    ChooseProduct(product) {
      localStorage.setItem("local_product_id", product.id);
      localStorage.setItem("local_product_name", product.name);
      this.$router.push("/detail?prod=" + product.id);
    },
    GetProduct(query) {
      let formdata = {
        path: query,
      };
      let param = func.ParamPOST(formdata);
      axios
        .post("http://localhost:82/apiSearchSafariProduct", param, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let feedback = response.data;
          if (feedback.length > 0) {
            if (feedback[0].status === true) {
              this.products = feedback.map((item) => item.data);
            } else {
              this.DialogActive("Gagal1 :  ", feedback[0].message);
            }
          } else {
            this.DialogActive("Gagal2");
          }
        })
        .catch((e) => {
          this.DialogActive("Gagal3 :", e);
        });
    },
  },

  created() {
    // const form = JSON.parse(localStorage.getItem("form_data")) || {};
    // this.GetProduct(form.destination);
    // if (form.destination == null || form.destination == "") {
    //   this.destination = "Semua";
    // } else {
    //   this.destination = form.destination;
    // }
  },
};
</script>

<style>
.explore-button {
  margin-top: 20px;
  width: 300px;
}
.bc {
  margin-left: 70px;
}
.ch {
  margin-left: 100px;
}

@media screen and (max-width: 600px) {
  .explore-button {
    margin-top: 10px;
    margin-left: 10px;
    width: 200px;
  }
  .bc {
    margin-left: 0px;
  }
  .ch {
    margin-left: 30px;
  }
}
.v-breadcrumbs-item {
  color: #1976d2 !important;
}
.mdi-chevron-right::before {
  color: rgba(0, 0, 0, 0.38);
}
</style>
