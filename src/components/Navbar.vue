<template>
  <v-app-bar color="#001F48" class="body">
    <v-col cols="3" lg="2">
      <v-img :src="logo"></v-img>
    </v-col>
    <v-row class="hidden-xs-only">
      <v-col class="d-flex justify-end">
        <v-menu open-on-hover v-for="(link, index) in menu" :key="index">
          <template v-slot:activator="{ props }">
            <span v-bind="props">
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <span
                    v-bind="props"
                    class="mr-5 cursor-pointer"
                    :class="isHovering ? 'text-orange-lighten-3' : ''"
                    @click="GoHome(link)"
                  >
                    <v-icon
                      class="mb-1 mr-1"
                      left
                      :color="isHovering ? '#FFCC80' : 'white'"
                    >
                      {{ "mdi-" + link.icon }}
                    </v-icon>
                    {{ link.name }}</span
                  >
                </template>
              </v-hover>
            </span>
          </template>
          <v-list v-if="link.child !== ''" class="body">
            <div v-for="childs in link.child">
              <v-list-item
                v-if="CheckLogin(childs.term)"
                route
                :to="childs.path"
              >
                <v-list-item-title
                  ><v-icon class="mr-3" left>{{ "mdi-" + childs.icon }}</v-icon
                  >{{ childs.name }}</v-list-item-title
                >
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
export default {
  name: "Navbar",
  components: {},
  data() {
    return {
      logo: new URL("../assets/logoputih.jpg", import.meta.url).href,
      login: false,
      menu: [
        { icon: "home", name: "Beranda", child: "" },
        {
          icon: "compass",
          name: "Produk",
          child: [
            {
              icon: "map",
              name: "Perjalanan - Takaful Safari",
              path: "/safari",
              term: "any",
            },
            {
              icon: "car",
              name: "Kendaraan - Takaful Abror",
              path: "/abror",
              term: "any",
            },
          ],
        },
        {
          icon: "shield-airplane",
          name: "Klaim",
          child: [
            {
              icon: "shield-plus",
              name: "Ajukan Klaim",
              path: "",
              term: "any",
            },
            {
              icon: "shield-sync",
              name: "Proses Klaim",
              path: "",
              term: "any",
            },
          ],
        },
        {
          icon: "account",
          name: "Akun",
          child: [
            {
              icon: "account-arrow-right",
              name: "Masuk",
              path: "login",
              term: "not-login",
            },
            {
              icon: "account-plus",
              name: "Daftar",
              path: "register",
              term: "not-login",
            },
            { icon: "cog", name: "Data Akun", path: "/account", term: "login" },
            { icon: "logout", name: "Keluar", path: "/logout", term: "login" },
          ],
        },
      ],
    };
  },
  methods: {
    GoHome(link) {
      if (link.child == "") {
        if (this.$route.path === "/") {
          location.reload();
        } else {
          this.$router.push("/");
        }
      }
    },
    CheckLogin(term) {
      return (
        (this.login && term !== "not-login") ||
        (!this.login && term !== "login")
      );
    },
  },
};
</script>
<style>
.body {
  font-family: "Lato", sans-serif;
  font-weight: 600;
}
</style>
