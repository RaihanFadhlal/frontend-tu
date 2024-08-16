<template>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn class="hidden-lg-and-up mb-5 font-weight-bold pl-1" v-bind="props">
          <v-img
            cover
            :src="UploadIcon('/assets/request/', 'logotransparan.png')"
            width="30px"
            class="mr-1"
          ></v-img>
          Dashboard Admin
        </v-btn>
      </template>
  
      <v-list density="compact">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          link
          route
          :to="item.route"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" color="#001f48"></v-icon>
          </template>
  
          <v-list-item-title
            v-text="item.title"
            class="body ml-1"
          ></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
  
  <script>
  export default {
    name: "AccountMenu",
    components: {},
    data: () => ({
      items: [
        { title: "Profil Admin", icon: "mdi-account-details", route: "profile" },
        {
          title: "Riwayat Claim",
          icon: "mdi-shield-airplane",
          route: "admin",
        },
      ],
    }),
    methods: {
      UploadIcon(path, name) {
        return new URL(path + name, import.meta.url).href;
      },
    },
  };
  </script>
  <style>
  .v-list-item__prepend {
    display: block !important;
  }
  .v-list-item__prepend > .v-badge .v-icon,
  .v-list-item__prepend > .v-icon,
  .v-list-item__append > .v-badge .v-icon,
  .v-list-item__append > .v-icon {
    color: #001f48;
    opacity: 1 !important;
  }
  </style>
  