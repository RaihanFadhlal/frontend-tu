<template>
  <v-app class="body">
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
    >
      <v-list-item
        nav
        height="60px"
        :prepend-avatar="
          UploadIcon('../../assets/request/', 'logotransparan.png')
        "
        @click="rail = !rail"
      >
        <span class="ml-2">Data Akun</span>
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          route
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.title"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import Navbar from "../../components/Navbar.vue";

export default {
  name: "AccountDrawer",
  components: {
    Navbar,
  },
  data: () => ({
    drawer: true,
    items: [
      { title: "Profil Saya", icon: "mdi-account-details", route: "profile" },
      { title: "Ganti Password", icon: "mdi-lock", route: "changepass" },
      {
        title: "Riwayat Polis",
        icon: "mdi-book-account",
        route: "policy-history",
      },
      {
        title: "Riwayat Claim",
        icon: "mdi-shield-airplane",
        route: "claim-history",
      },
      {
        title: "Riwayat Transaksi",
        icon: "mdi-cash-multiple",
        route: "transaction",
      },
    ],
    rail: false,
  }),

  methods: {
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
  },
  watch: {
    rail(value) {
      this.$emit("update-rail", value)
    },
  },
};
</script>

<style>
.v-list-item--nav .v-list-item-title {
    font-size: medium !important; 
    font-weight: 700 !important; 
}
.v-list-item__prepend > .v-badge .v-icon, .v-list-item__prepend > .v-icon, .v-list-item__append > .v-badge .v-icon, .v-list-item__append > .v-icon {
    color: #001F48;
    opacity: 1 !important;
}
.mdi-chevron-left::before {
    margin-left: 8px;
}
</style>
