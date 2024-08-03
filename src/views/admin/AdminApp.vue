<template>
  <v-app class="body">
    <v-main>
      <v-container class="container-profile">
        <v-card>
          <v-row class="d-flex">
            <v-col>
              <div
                class="mb-3 rounded-ts-xl rounded-be-xl"
                style="background-color: #e3f2fd"
              >
                <v-icon class="ma-4" color="grey-darken-1"
                  >mdi-shield-account</v-icon
                >
                <span style="color: #212121">Takaful Safari</span>
              </div>
              <v-dialog v-model="dialog_claim" persistent max-width="700">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" prepend-icon="mdi-shield-search">
                    <span class="body">Cari Klaim</span>
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
                        >mdi-shield-search</v-icon
                      >
                      Cari Klaim
                    </div>
                    <v-form class="body">
                      <v-row justify="center">
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-select
                            variant="outlined"
                            v-model="form_data.product_name"
                            :items="products"
                            label="Produk"
                            clearable
                            color="#001F48"
                            prepend-inner-icon="mdi-shield-edit"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-select
                            variant="outlined"
                            v-model="form_data.status"
                            :items="status"
                            label="Status Klaim"
                            clearable
                            color="#001F48"
                            prepend-inner-icon="mdi-shield-edit"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-text-field
                            variant="outlined"
                            v-model="form_data.policy_id"
                            label="Nomor Polis"
                            clearable
                            color="#001F48"
                            prepend-inner-icon="mdi-account"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-text-field
                            variant="outlined"
                            v-model="form_data.registrant_id"
                            label="Email Pengguna"
                            clearable
                            color="#001F48"
                            prepend-inner-icon="mdi-account"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-menu
                            v-model="date_menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                variant="outlined"
                                v-model="formatted_date"
                                label="Tanggal Pengajuan"
                                prepend-inner-icon="mdi-calendar"
                                v-bind="props"
                                readonly
                                color="#001F48"
                                clearable
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              class="body"
                              v-model="selected_date"
                              :max="tomorrow"
                              @update:model-value="UpdateDate"
                              color="#001F48"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <v-row justify="center">
                        <v-btn
                          color="#F57C00"
                          @click="
                            GetClaims(
                              this.form_data.policy_id,
                              this.form_data.product_name,
                              this.form_data.date_report,
                              this.form_data.registrant_id,
                              this.form_data.status
                            )
                          "
                        >
                          <span class="body">Cari</span>
                        </v-btn>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-spacer></v-spacer>
                    <v-btn color="#001F48" @click="dialog_claim = false">
                      <span class="body">Tutup</span>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-card flat class="mt-3">
                <div v-if="claims.length === 0" class="text-center">
                  Belum ada klaim
                </div>
                <v-row>
                  <v-col
                    v-for="(claim, index) in paginated_claims"
                    :key="index"
                    cols="12"
                    class="pb-0"
                  >
                    <v-card elevation="1">
                      <v-card-text>
                        <v-row>
                          <v-col class="hidden-xs-only" cols="4" sm="3">
                            <v-img
                              class="my-auto rounded"
                              :src="claim.evidence"
                            >
                            </v-img>
                          </v-col>
                          <v-col cols="12" sm="9" class="pb-0">
                            <v-row class="d-flex">
                              <v-col cols="12" sm="6" class="pb-0">
                                <div
                                  class="body mb-2"
                                  style="color: #001f48; font-size: large"
                                >
                                  {{ claim.product_name }}
                                </div>
                                <div
                                  class="body mb-2"
                                  style="color: #23cac0; font-size: medium"
                                >
                                  {{ claim.claim_id }}
                                </div>
                                <div class="body mb-2" style="color: black">
                                  {{ "Detail : " + claim.detail }}
                                </div>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="6"
                                class="text-sm-end pb-0 pt-0 pt-sm-3"
                              >
                                <div
                                  class="body mb-2"
                                  style="color: black; font-size: medium"
                                >
                                  {{
                                    "Tanggal Pengajuan : " +
                                    FormatDate(claim.date_report)
                                  }}
                                </div>
                                <div
                                  class="body mb-2"
                                  style="color: black; font-size: medium"
                                >
                                  {{
                                    "Email Pengguna : " + claim.registrant_id
                                  }}
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
                              >{{ claim.status }}
                            </v-btn>
                            <v-btn
                              rounded
                              depressed
                              style="
                                color: #f57c00;
                                border: 1px solid;
                                background-color: white;
                              "
                              @click="EditClaim(claim.claim_id)"
                              >Edit
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-dialog v-model="dialog_edit_sfr" persistent max-width="700">
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
                          >mdi-shield-search</v-icon
                        >
                        {{ "Edit Klaim " + id }}
                      </div>
                      <v-form class="body">
                        <v-row justify="center">
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-select
                              variant="outlined"
                              v-model="form_edit_sfr.status"
                              :items="status"
                              label="Status Klaim"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-shield-edit"
                              :rules="[Required]"
                            ></v-select>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-text-field
                              variant="outlined"
                              v-model="form_edit_sfr.message"
                              label="Pesan"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-shield-edit"
                              :rules="[Required]"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-text-field
                              variant="outlined"
                              v-model="form_edit_sfr.cover_cost"
                              label="Biaya tercover"
                              clearable
                              color="#001F48"
                              prepend-inner-icon="mdi-shield-edit"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="5" class="py-0">
                            <v-file-input
                              variant="outlined"
                              label="Bukti Pembayaran"
                              chips
                              prepend-inner-icon="mdi-camera"
                              accept="image/png, image/jpeg, image/jpg"
                              @change="UploadImg"
                            ></v-file-input>
                          </v-col>
                        </v-row>
                        <v-row justify="center">
                          <v-btn color="#F57C00" @click="EditClaimSfr()">
                            <span class="body">Edit</span>
                          </v-btn>
                        </v-row>
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="pt-0">
                      <v-spacer></v-spacer>
                      <v-btn color="#001F48" @click="dialog_edit_sfr = false">
                        <span class="body">Tutup</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-pagination
                  v-model="current_page"
                  :length="pages"
                  @update:modelValue="UpdatePage"
                  color="blue lighten-5"
                  class="mx-auto mt-8 mb-5"
                ></v-pagination>
              </v-card>
            </v-col>
            <v-col cols="12">
              <div
                class="mb-3 rounded-ts-xl rounded-be-xl"
                style="background-color: #e3f2fd"
              >
                <v-icon class="ma-4" color="grey-darken-1"
                  >mdi-shield-account</v-icon
                >
                <span style="color: #212121">Takaful Abror</span>
              </div>
              <v-dialog v-model="dialog_claim_abror" persistent max-width="700">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" prepend-icon="mdi-shield-search">
                    <span class="body">Cari Klaim</span>
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
                        >mdi-shield-search</v-icon
                      >
                      Cari Klaim
                    </div>
                    <v-form class="body">
                      <v-row justify="center">
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-text-field
                            variant="outlined"
                            v-model="form_data_abror.policy_id"
                            label="Nomor Polis"
                            clearable
                            color="#001F48"
                            prepend-inner-icon="mdi-shield-edit"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-menu
                            v-model="date_menu_abror"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                variant="outlined"
                                v-model="formatted_date_abror"
                                label="Tanggal Pengajuan"
                                prepend-inner-icon="mdi-calendar"
                                v-bind="props"
                                readonly
                                color="#001F48"
                                clearable
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              class="body"
                              v-model="selected_date_abror"
                              :max="tomorrow"
                              @update:model-value="UpdateDate2"
                              color="#001F48"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="5" class="py-0">
                          <v-select
                            variant="outlined"
                            v-model="form_data_abror.status"
                            label="Status"
                            :items="status"
                            clearable
                            color="#001F48"
                            prepend-inner-icon="mdi-shield-edit"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row justify="center">
                        <v-btn
                          color="#F57C00"
                          @click="
                            GetClaimsAbror(
                              form_data_abror.policy_id,
                              form_data_abror.date_report,
                              form_data_abror.status
                            )
                          "
                        >
                          <span class="body">Cari</span>
                        </v-btn>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="pt-0">
                    <v-spacer></v-spacer>
                    <v-btn color="#001F48" @click="dialog_claim_abror = false">
                      <span class="body">Tutup</span>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-card flat class="mt-3">
                <div v-if="claims_abror.length === 0" class="text-center">
                  Belum Ada Klaim
                </div>
                <v-row>
                  <v-col
                    v-for="(claim, index) in paginated_claims_abror"
                    :key="index"
                    cols="12"
                    class="pb-0"
                  >
                    <v-card elevation="1">
                      <v-card-text>
                        <v-row>
                          <v-col class="hidden-xs-only" cols="4" sm="3">
                            <v-img
                              class="my-auto rounded"
                              :src="claim.evidence"
                            >
                            </v-img>
                          </v-col>
                          <v-col cols="12" sm="9" md="9" class="pb-0">
                            <v-row class="d-flex">
                              <v-col cols="12" sm="7" class="pb-0">
                                <div
                                  class="body mb-2"
                                  style="color: #001f48; font-size: large"
                                >
                                  {{ claim.product_name }}
                                </div>
                                <div
                                  class="body mb-2"
                                  style="color: #23cac0; font-size: medium"
                                >
                                  {{ claim.claim_id }}
                                </div>
                                <div class="body mb-2" style="color: black">
                                  {{ "Detail : " + claim.detail }}
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
                                  {{
                                    "Tanggal Pengajuan : " +
                                    FormatDate(claim.date_report)
                                  }}
                                </div>
                                <div
                                  class="body mb-2"
                                  style="color: black; font-size: medium"
                                >
                                  {{
                                    "Email Pengguna : " + claim.registrant_id
                                  }}
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
                              >{{ claim.status }}
                            </v-btn>

                            <v-btn
                              rounded
                              depressed
                              style="
                                color: #f57c00;
                                border: 1px solid;
                                background-color: white;
                              "
                              @click="EditClaimAbror(claim.claim_id)"
                              >Edit
                            </v-btn>
                          </v-col>
                          <v-dialog
                            v-model="dialog_edit_abr"
                            persistent
                            max-width="700"
                          >
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
                                    >mdi-shield-search</v-icon
                                  >
                                  {{ "Edit Klaim " + id_abror }}
                                </div>
                                <v-form class="body">
                                  <v-row justify="center">
                                    <v-col cols="12" sm="6" md="5" class="py-0">
                                      <v-select
                                        variant="outlined"
                                        v-model="form_edit_abr.status"
                                        :items="status"
                                        label="Status Klaim"
                                        clearable
                                        color="#001F48"
                                        prepend-inner-icon="mdi-shield-edit"
                                        :rules="[Required]"
                                      ></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="5" class="py-0">
                                      <v-text-field
                                        variant="outlined"
                                        v-model="form_edit_abr.message"
                                        label="Pesan"
                                        clearable
                                        color="#001F48"
                                        prepend-inner-icon="mdi-shield-edit"
                                        :rules="[Required]"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="5" class="py-0">
                                      <v-text-field
                                        variant="outlined"
                                        v-model="form_edit_abr.cover_cost"
                                        label="Biaya tercover"
                                        clearable
                                        color="#001F48"
                                        prepend-inner-icon="mdi-shield-edit"
                                      ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="5" class="py-0">
                                      <v-file-input
                                        variant="outlined"
                                        label="Bukti Pembayaran"
                                        chips
                                        prepend-inner-icon="mdi-camera"
                                        accept="image/png, image/jpeg, image/jpg"
                                        @change="UploadImg2"
                                      ></v-file-input>
                                    </v-col>
                                  </v-row>
                                  <v-row justify="center">
                                    <v-btn
                                      color="#F57C00"
                                      @click="EditClaimAbr"
                                    >
                                      <span class="body">Edit</span>
                                    </v-btn>
                                  </v-row>
                                </v-form>
                              </v-card-text>
                              <v-card-actions class="pt-0">
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="#001F48"
                                  @click="dialog_edit_abr = false"
                                >
                                  <span class="body">Tutup</span>
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-pagination
                  v-model="current_page_abror"
                  :length="pages_abror"
                  @update:modelValue="UpdatePageAbror"
                  color="blue lighten-5"
                  class="mx-auto mt-8 mb-5"
                ></v-pagination>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <!-- Dialog -->
        <v-dialog persistent v-model="dialog_err" max-width="400px">
          <v-card class="body">
            <v-card-title class="font-weight-bold mt-2"
              ><v-icon class="mr-2 mb-1" left>mdi-alert-circle-outline</v-icon
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
  </v-app>
</template>

<script>
import func from "../../function";
import axios from "../../axios";
import { mapGetters } from "vuex";

export default {
  name: "ClaimApp",
  data: () => ({
    drawer: true,
    rail: false,
    claims: [],
    claims_abror: [],
    dialog_err: false,
    dialog_text: "",
    dialog_title: "",
    dialog_edit_sfr: false,
    dialog_edit_abr: false,

    dialog_claim: false,
    date_menu: false,
    selected_date: null,

    dialog_claim_abror: false,
    date_menu_abror: false,
    selected_date_abror: null,

    cars: [],
    products: [
      "Takaful Safari Umroh Afdhol",
      "Takaful Safari Umroh dan Haji Khusus",
      "Takaful Safari Multitrip",
    ],
    country: ["Saudi Arabia", "Turki", "Malaysia"],
    status: ["Diproses", "Diterima", "Ditolak"],

    form_data: {
      policy_id: null,
      product_name: null,
      date_report: null,
      registrant_id: null,
      status: null,
    },

    form_data_abror: {
      policy_id: null,
      date_report: null,
      status: null,
    },

    current_page: 1,
    current_page_abror: 1,

    per_page: 5,
    tomorrow: null,

    form_edit_sfr: {
      status: null,
      message: null,
      cover_cost: "",
      pay_proof: "",
    },
    image: "",

    form_edit_abr: {
      status: null,
      message: null,
      cover_cost: "",
      pay_proof: "",
    },
    image2: "",

    id: "",
    id_abror: "",

    Required: (value) => !!value || "Harus Diisi",
  }),

  methods: {
    async GetClaims(id, prod, date_rep, reg_id, status) {
      try {
        const response = await axios.post("/get-claim-sfr", {
          policy_id: id,
          product_name: prod,
          date_report: date_rep,
          registrant_id: reg_id,
          status: status,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            if (
              id !== "" &&
              prod !== "" &&
              date_rep !== "" &&
              reg_id !== "" &&
              status !== ""
            ) {
              this.DialogActive("Belum ada klaim yang terdaftar!");
            }
            this.dialog_claim = false;
          } else {
            this.claims = response.data.data;
            this.dialog_claim = false;
          }
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          throw new Error("Unauthorized");
        } else {
          console.error("Error :", error.message);
          throw error;
        }
      }
    },
    async GetClaimsAbror(id, date_rep, status) {
      try {
        const response = await axios.post("/get-claim-abr", {
          policy_id: id,
          date_report: date_rep,
          status: status,
        });
        if (response.data.status) {
          if (response.data.data == null) {
            if (id !== "" && date_rep !== "" && status !== "") {
              this.DialogActive("Belum ada klaim yang terdaftar!");
            }
            this.dialog_claim_abror = false;
          } else {
            this.claims_abror = response.data.data;
            this.dialog_claim_abror = false;
          }
        } else {
          console.error("Error :", response.data.message);
        }
      } catch (error) {
        this.dialog_claim_abror = false;
        this.DialogActive("Belum ada klaim yang terdaftar!");
        console.error("Error :", error);
      }
    },
    async EditClaimSfr() {
      try {
        const proof = this.image.replace(/^.+?base64,/, "");
        const cover = parseInt(this.form_edit_sfr.cover_cost, 10);
        const response = await axios.put("/update-claim-sfr", {
          status: this.form_edit_sfr.status,
          message: this.form_edit_sfr.message,
          cover_cost: cover,
          pay_proof: proof,
          claim_id: this.id,
        });

        if (response.data && response.data.status) {
          this.DialogActive("Data klaim berhasil diupdate!");
          this.dialog_edit_sfr = false;
          setTimeout(() => {
            location.Reload();
          }, 2000);
        } else {
          console.error(
            "Error :",
            response.data ? response.data.message : "Unknown error"
          );
          this.DialogActive("Data klaim gagal diupdate!");
          this.dialog_edit_sfr = false;
        }
      } catch (error) {
        this.dialog_edit_sfr = false;
        this.DialogActive("Data klaim gagal diupdate!!");
        console.error("Error :", error);
      }
    },
    async EditClaimAbr() {
      try {
        const proof = this.image2.replace(/^.+?base64,/, "");
        const cover = parseInt(this.form_edit_abr.cover_cost, 10);
        const response = await axios.put("/update-claim-abr", {
          status: this.form_edit_abr.status,
          message: this.form_edit_abr.message,
          cover_cost: cover,
          pay_proof: proof,
          claim_id: this.id_abror,
        });
        if (response.data.status) {
          this.DialogActive("Data klaim berhasil diupdate!");
          this.dialog_edit_abr = false;
          setTimeout(() => {
            location.Reload();
          }, 2000);
        } else {
          console.error("Error :", response.data.message);
          this.dialog_edit_abr = false;
        }
      } catch (error) {
        this.dialog_edit_abr = false;
        this.DialogActive("Data klaim gagal diupdate!");
        console.error("Error :", error);
      }
    },
    EditClaim(id) {
      this.id = id;
      this.dialog_edit_sfr = true;
    },
    EditClaimAbror(id) {
      this.id_abror = id;
      this.dialog_edit_abr = true;
    },
    UpdateDate(value) {
      this.form_data.date_report = func.FormatDate(value);
      this.date_menu = false;
    },
    UpdateDate2(value) {
      this.form_data_abror.date_report = func.FormatDate(value);
      this.date_menu_abror = false;
    },
    DialogActive(title, msg) {
      this.dialog_title = title;
      this.dialog_text = msg;
      this.dialog_err = true;
    },
    UpdatePage(page) {
      this.current_page = page;
    },
    UpdatePageAbror(page) {
      this.current_page_abror = page;
    },
    UpdateRail(value) {
      this.rail = value;
    },
    FormatDate(date) {
      return func.FormatOutputDate(date, "simple", "api");
    },
    UploadImg(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        this.file_name = input.files[0].name;
        var reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    UploadImg2(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        this.file_name = input.files[0].name;
        var reader = new FileReader();
        reader.onload = (e) => {
          this.image2 = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
  },
  async created() {
    try {
      await this.GetClaims("", "", "", "", "");
      await this.GetClaimsAbror("", "", "", "", "");
      this.tomorrow = func.Tomorrow();
    } catch (error) {
      if (
        error.message === "Unauthorized" ||
        error.message === "Invalid request"
      ) {
        this.$router.push("/");
      }
    }
  },

  computed: {
    formatted_date() {
      return this.selected_date
        ? func.FormatOutputDate(this.selected_date, "simple")
        : "";
    },
    formatted_date_abror() {
      return this.selected_date_abror
        ? func.FormatOutputDate(this.selected_date_abror, "simple")
        : "";
    },
    paginated_claims() {
      const start = (this.current_page - 1) * this.per_page;
      const end = start + this.per_page;

      return this.claims.slice(start, end);
    },
    paginated_claims_abror() {
      const start = (this.current_page_abror - 1) * this.per_page;
      const end = start + this.per_page;

      return this.claims_abror.slice(start, end);
    },
    pages() {
      return Math.ceil(this.claims.length / this.per_page);
    },
    pages_abror() {
      return Math.ceil(this.claims_abror.length / this.per_page);
    },
  },
};
</script>
<style>
.theme--light.v-pagination .v-pagination__item--active {
  color: black;
}
</style>
