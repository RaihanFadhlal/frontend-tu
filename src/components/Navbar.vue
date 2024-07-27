<template>
  <div>
    <v-app-bar color="#001F48" class="body">
      <v-col cols="4" sm="3" lg="2">
        <v-img :src="logo"></v-img>
      </v-col>
      <v-row class="hidden-xs">
        <v-col class="d-flex justify-end">
          <v-menu open-on-hover v-for="(link, index) in menu" :key="index">
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <span
                      v-if="CheckLogin(link.term)"
                      v-bind="props"
                      class="mr-5 cursor-pointer"
                      :class="isHovering ? 'text-orange-lighten-3' : ''"
                      @click="link.icon === 'home' ? GoHome() : ''"
                    >
                      <v-icon
                        class="mb-1 mr-1"
                        left
                        :color="isHovering ? '#FFCC80' : 'white'"
                      >
                        {{ "mdi-" + link.icon }}
                      </v-icon>
                      {{ link.name }}
                    </span>
                  </template>
                </v-hover>
              </span>
            </template>
            <v-list v-if="link.child !== ''" class="body">
              <div v-for="child in link.child" :key="child.path">
                <v-list-item
                  v-if="CheckLogin(child.term)"
                  @click="handleItemClick(child)"
                >
                  <v-list-item-title>
                    <v-icon class="mr-3" left>{{ "mdi-" + child.icon }}</v-icon>
                    {{ child.name }}
                  </v-list-item-title>
                </v-list-item>
              </div>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <v-col v-if="$vuetify.display.xs" class="d-flex justify-end">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon
      ></v-col>
    </v-app-bar>
    <v-navigation-drawer
      v-if="$vuetify.display.xs"
      v-model="drawer"
      temporary
      class="body"
      width="350"
    >
      <v-list>
        <v-list-item
          title="Beranda"
          prepend-icon="mdi-home"
          height="50px"
          @click="GoHome"
        ></v-list-item>
        <v-list-group v-for="(link, index) in menu" :key="index">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-if="index > 0 && CheckLogin(link.term)"
              v-bind="props"
              :title="link.name"
              :prepend-icon="'mdi-' + link.icon"
              height="50px"
              :value="link.name"
            ></v-list-item>
          </template>
          <div v-for="child in link.child" :key="child.path">
          <v-list-item
            v-if="CheckLogin(child.term)"
            :title="child.name"
            :prepend-icon="'mdi-' + child.icon"
            @click="handleItemClick(child)"
          ></v-list-item>
        </div>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Navbar",

  data() {
    return {
      logo: new URL("../assets/logoputih.jpg", import.meta.url).href,
      drawer: false,
      menu: [
        { icon: "home", name: "Beranda", child: "", term: "any" },
        {
          icon: "compass",
          name: "Produk",
          term: "any",
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
          term: "login",
          child: [
            {
              icon: "shield-plus",
              name: "Ajukan Klaim",
              path: "/claim-req",
              term: "login",
            },
            {
              icon: "shield-sync",
              name: "Proses Klaim",
              path: "",
              term: "login",
            },
          ],
        },
        {
          icon: "account",
          name: "Akun",
          term: "any",
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
            { icon: "cog", name: "Data Akun", path: "/profile", term: "login" },
            { icon: "logout", name: "Keluar", path: "/login", term: "login" },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
    CheckLogin(term) {
      return (
        (this.isAuthenticated && term !== "not-login") ||
        (!this.isAuthenticated && term !== "login")
      );
    },
    async handleItemClick(child) {
      if (child.icon === "logout") {
        await this.logout();
      } else if (child.term === "login" && !this.isAuthenticated) {
        await this.$store.dispatch("refreshToken");
        if (this.isAuthenticated) {
          this.$router.push(child.path);
        } else {
          this.$router.push("/login");
        }
      } else {
        this.$router.push(child.path);
      }
    },
    GoHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.text-orange-lighten-3 {
  color: #ffcc80;
}
::v-deep(.v-list-item-title) {
  font-weight: 600
}
</style>
