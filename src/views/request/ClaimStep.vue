<template>
  <v-app>
    <v-col
      class="fixed-img hidden-xs pb-5 mt-12"
      cols="3"
      style="background-color: #001f48"
    >
      <v-row justify="center" v-for="(item, i) in process" :key="i">
        <v-card
          flat
          style="
            font-size: small;
            background-color: rgba(255, 255, 255, 0);
            color: white;
          "
        >
          <v-img
            :src="UploadIcon('/assets/process/', item.img)"
            width="70"
            contain
            class="mx-auto"
          ></v-img>
          {{ item.detail }}
          <v-img
            v-if="i < 4"
            :src="UploadIcon('/assets/process/', 'panah.png')"
            width="15"
            contain
            class="mx-auto mt-1"
            style="transform: rotate(90deg)"
          ></v-img>
          <div v-if="i == 4" style="background-color: #001f48; height: 500px;"></div>
        </v-card>
      </v-row>
    </v-col>
    <v-col cols="3" class="hidden-xs"> </v-col>
  </v-app>
</template>

<script>
export default {
  name: "ClaimStep",
  data: () => {
    return {
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
  methods: {
    UploadIcon(path, name) {
      return new URL(path + name, import.meta.url).href;
    },
  },
};
</script>
