<template>
  <v-app>
    <Navbar />
    <v-main class="body">
      <div>
        <!-- Welcome User -->
        <v-col cols="11" class="mx-auto mt-10">
          <v-card flat color="#E3F2FD" class="d-flex flex-column align-center">
            <h1>Selamat Datang!</h1>
            <h2>Cari Asuransi Apa?</h2>

            <div class="d-sm-flex my-5">
              <v-card
                v-for="(product, i) in products"
                :key="i"
                class="d-flex mx-4 mb-4"
                style="border-radius: 16px"
              >
                <v-img
                  :src="UploadIcon('../../assets/landing/', product.icon)"
                  class="mx-2"
                  width="50px"
                ></v-img>
                <div class="d-flex flex-column align-center ml-2 mr-6 my-4">
                  <h2>{{ product.name }}</h2>
                  <h3 style="color: #5b5b5b">{{ product.detail }}</h3>
                  <v-btn
                    v-if="product.path == '/abror'"
                    v-bind="activatorProps"
                    height="30px"
                    :color="product.color"
                    class="font-weight-bold text-white mt-2"
                    route
                    :to="product.path"
                    >Lihat Produk</v-btn
                  >
                  <v-dialog v-else max-width="800">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                        v-bind="activatorProps"
                        height="30px"
                        :color="product.color"
                        class="font-weight-bold text-white mt-2"
                        >Lihat Produk</v-btn
                      >
                    </template>
                    <template v-slot:default="{ isActive }">
                      <SearchProduct />
                    </template>
                  </v-dialog>
                </div>
              </v-card>
            </div>
          </v-card>
        </v-col>

        <!-- Why Takaful -->
        <v-col cols="11" class="mx-auto mt-10">
          <v-card flat color="#E3F2FD" class="d-md-flex">
            <v-col class="why-takaful" cols="12" md="6" lg="6">
              Kenapa Harus Takaful Umum ?
            </v-col>
            <v-col cols="12" md="6" lg="6">
              <v-container>
                <v-row>
                  <v-col v-for="(item, i) in reasons" :key="i" cols="12" md="5">
                    <v-card
                      class="card2 d-flex pa-2"
                      :style="{ borderLeft: '4px solid ' + item.color }"
                    >
                      <div style="flex: 1">
                        <div :style="{ color: item.color, fontSize: '20px' }">
                          {{ item.name }}
                        </div>
                        <div class="mt-2" style="font-size: 13px">
                          {{ item.detail }}
                        </div>
                      </div>
                      <div style="align-self: flex-start">
                        <v-img
                          style="width: 50px"
                          :src="
                            UploadIcon(
                              '../../assets/landing/reasons/',
                              item.img
                            )
                          "
                        ></v-img>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-card>
        </v-col>
        <!-- Claim Process-->
        <v-col cols="11" class="mx-auto mt-10">
          <v-card flat color="#E3F2FD">
            <div
              class="mt-8 ml-8 pl-4"
              style="
                font-weight: bold;
                border-left: solid 6px orangered;
                font-size: xx-large;
              "
            >
              Proses Klaim
            </div>
            <div class="owl-carousel">
              <div
                v-for="(item, i) in process"
                :key="i"
                class="d-flex mx-auto"
                style="width: 180px"
              >
                <v-col class="d-flex flex-column align-center">
                  <v-img
                    :src="UploadIcon('../../assets/landing/process/', item.img)"
                    width="150"
                  ></v-img>
                  <span style="text-align: center">{{ item.detail }}</span>
                </v-col>
                <v-col class="d-flex flex-column align-center">
                  <v-img
                    v-if="i !== 4"
                    :src="
                      UploadIcon('../../assets/landing/process/', 'panah.png')
                    "
                    :style="{ marginBottom: i > 1 ? '20px' : '0px' }"
                    width="30px"
                  ></v-img
                ></v-col>
              </div>
            </div>
          </v-card>
        </v-col>
      </div>
    </v-main>
    <FooterApp />
  </v-app>
</template>

<script>
import Navbar from "../../components/Navbar.vue";
import FooterApp from "../../components/FooterApp.vue";
import SearchProduct from "../product/SearchProduct.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "LandingApp",
  components: {
    Navbar,
    FooterApp,
    SearchProduct,
  },

  data() {
    return {
      date1: null,
      dialog_search: false,
      products: [
        {
          name: "Takaful Safari",
          detail: "Asuransi Perjalanan",
          color: "#23CAC0",
          icon: "logo.png",
          path: "/safari",
        },
        {
          name: "Takaful Abror",
          detail: "Asuransi Kendaraan",
          color: "#FF6600",
          icon: "logo_abror.png",
          path: "/abror",
        },
      ],
      reasons: [
        {
          name: "Maslahah",
          detail:
            "Memelihara tujuan syara dan meraih manfaat dan atau menghindarkan kemudharatan",
          img: "maslahah.png",
          color: "#001F48",
        },
        {
          name: "Polis",
          detail:
            "Proses polis cepat kurang dari 5 menit. Cukup kirim berkas melalui email, tidak perlu datang ke kantor",
          img: "polis.png",
          color: "#4DD0E1",
        },
        {
          name: "Harga",
          detail: "Memberikan harga terjangkau sesuai dengan kebutuhan Anda",
          img: "harga.png",
          color: "#00838F",
        },
        {
          name: "Klaim",
          detail:
            "Cukup melalui WhatsApp Customer Solution Takaful Umum dan lengkapi berkas pelaporan",
          img: "klaim.png",
          color: "#F57F17",
        },
      ],
      process: [
        {
          detail: "Peserta Melaporkan",
          img: "lapor.png",
        },
        {
          detail: "Melengkapi Berkas",
          img: "berkas.png",
        },
        {
          detail: "Survey oleh Takaful Umum",
          img: "survey.png",
        },
        {
          detail: "Klaim diterima dan dibayar",
          img: "klaim.png",
        },
        {
          detail: "Klaim sudah selesai",
          img: "selesai.png",
        },
      ],
    };
  },
  computed: {
    formattedDate() {
      const { d } = useI18n();
      return d(this.date1, "long");
    },
  },
  methods: {
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
  },
  mounted() {
    $(document).ready(() => {
      $(".owl-carousel").owlCarousel({
        responsive: {
          0: {
            items: 2,
          },
          600: {
            items: 3,
          },
          1000: {
            items: 5,
          },
        },
        autoplay: true,
        autoplaySpeed: 10,
      });
    });
  },
};
</script>
<style>
.router-link {
  color: inherit;
  text-decoration: none;
}
.why-takaful {
  font-size: 60px;
  margin-top: 70px;
  font-weight: bold;
  text-align: center;
}
.card2 {
  width: 230px;
  height: 150px;
  margin: 5px;
}

@media screen and (max-width: 600px) {
  .why-takaful {
    font-size: 40px;
    margin-top: 20px;
  }
  .card2 {
    margin-left: 35px;
  }
}
</style>
