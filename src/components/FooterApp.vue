<template>
  <v-footer class="body mt-10" color="#001F48">
    <v-container class="mx-auto">
      <v-row class="mt-5 mt-sm-10">
        <v-col cols="11" md="3 ">
          <v-img
            :src="logo"
          ></v-img>
          <div class="white--text ml-3 mt-3 text-body-2">
            <strong>M</strong>aslahah, <strong>A</strong>ma<strong>N</strong>ah,
            <strong>Ta</strong>'awuni, <strong>P</strong>rogresif profesional
          </div>
        </v-col>

        <v-col
          cols="11"
          md="3"
        >
          <v-row class="white--text">KONTAK</v-row>
          <v-row>
            <v-card
              color="cyan-darken-2"
              height="5px"
              width="70px"
            ></v-card> </v-row
          ><v-row v-for="(item, i) in contact" :key="i"
            ><v-card flat class="d-flex" color="#001F48">
              <v-icon color="white" class="my-auto">{{ item.icon }}</v-icon>
              <v-card-text
                class="body grey--text text--lighten-1"
                style="font-size: medium; font-weight: bold;"
                >{{ item.text }}</v-card-text
              >
            </v-card></v-row
          >
        </v-col>

        <v-col
          cols="11"
          md="2"
        >
          <v-row class="white--text">MANFAAT</v-row>
          <v-row class="mb-3">
            <v-card color="cyan darken-2" height="5px" width="80px"></v-card>
          </v-row>
          <v-row
            v-for="item in benefits"
            :key="item"
            class="grey--text text--lighten-1"
          >
            {{ item }}
          </v-row>
        </v-col>

        <v-col
          cols="11"
          md="4"
        >
          <v-row class="white--text">PRODUK</v-row>
          <v-row class="mb-3">
            <v-card color="cyan darken-2" height="5px" width="70px"></v-card>
          </v-row>
          <v-row
            v-for="item in product"
            :key="item"
            class="grey--text text--lighten-1"
          >
            {{ item }}
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "FooterApp",
  data() {
    return {
      logo: new URL("/assets/mantapberhijrah.png", import.meta.url).href,
      contact: [
        {
          icon: "mdi-map-marker",
          text: "Jl. Persada Raya No. 70 C-D, Menteng Dalam, Tebet, Jakarta 12870",
        },
        {
          icon: "mdi-cellphone",
          text: "Telp: (021) 285 43111 (Hunting) Fax: (021) 285 43222",
        },
        {
          icon: "mdi-email",
          text: "cs@takafulumum.co.id",
        },
      ],
      benefits: [
        "> Dikelola Full Syariah",
        "> Digital Proses",
        "> 24/7 Customer Service",
      ],
      product: [
        "> Takaful Safari Umroh dan Haji Khusus",
        "> Takaful Multitrip",
        "> Takaful Safari Umroh Non Covid",
        "> Takaful Safari Umroh Non Covid (50 Ribu)",
        "> Takaful Safari Umroh Non Covid (Plus Zam Zam)",
        "> Takaful Safari Umroh Plus Covid New Normal",
        "> Takaful Abror",
      ],
    };
  },
};
</script>
