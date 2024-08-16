<template>
  <v-app>
    <v-main class="body">
      <NavBar />
      <v-row class="explore-row d-flex ml-2 ml-sm-15 mt-4">
        <v-col cols="6" sm="4" md="3" lg="2">
          <v-img :src="UploadIcon('/assets/explore/', 'logo.png')"></v-img>
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
          <span v-if="destination !== ''">{{ "Destinasi : " + destination }}</span>
          <span v-else>Destinasi : Semua</span>
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
                        :src="product.image"
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
import NavBar from "../../components/Navbar.vue";
import FooterApp from "../../components/FooterApp.vue";
import SearchProduct from "./SearchProduct.vue";
import axios from "../../axios";

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
    products: [],
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
      this.$router.push("/detail?id=" + product.code);
    },
    async GetProduct(country) {
      try {
        const response = await axios.get("/products", {
          params: {
            country: country,
          },
        });
        if (response.data.status) {
          this.products = response.data.data;
        } else {
          console.error("Error retrieving countries:", response.data.message);
        }
      } catch (error) {
        console.error("Error retrieving countries:", error);
      }
    },
  },

  async created() {
    const form = JSON.parse(localStorage.getItem("form_safari")) || {};
    if (form.destination == null || form.destination == "") {
      this.destination = "";
    } else {
      this.destination = form.destination;
    }
    await this.GetProduct(this.destination);
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
