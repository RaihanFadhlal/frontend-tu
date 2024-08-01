// store.js
import {
  createStore
} from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from './axios';

const store = createStore({
  state: {
    accessToken: localStorage.getItem('accessToken') || '',
    isAuthenticated: !!localStorage.getItem('accessToken'),
    productCode: "",
    productName: "",
    abrorCont: "",
    carBrand: "",
    carType: "",
    cars: [],
    brands: [],
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
      localStorage.setItem('accessToken', token);
    },
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
    },
    clearAuthData(state) {
      state.accessToken = '';
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
    setProduct(state,{code, name}) {
      state.productCode = code
      state.productName = name
    },
    setAbror(state,{cont, brand, type, cars, brands}) {
      state.abrorCont = cont
      state.carBrand = brand
      state.carType = type
      state.cars = cars
      state.brands = brands
    }
  },
  actions: {
    async login({
      commit
    }, formData) {
      try {
        const response = await axios.post('/login', formData);
        if (response.data.status) {
          commit('setAccessToken', response.data.data.access_token);
          commit('setAuthenticated', true);
        } else {
          commit('setAuthenticated', false);
          commit('setAccessToken', '');
        }
        return response.data;
      } catch (error) {
        commit('setAuthenticated', false);
        commit('setAccessToken', '');
        throw error;
      }
    },
    async refreshToken({
      commit,
      state
    }) {
      try {
        const response = await axios.post('/refresh-token', {}, {
          withCredentials: true
        });
        commit('setAccessToken', response.data.access_token);
        commit('setAuthenticated', true);
        return response.data.access_token;
      } catch (error) {
        console.error('Unable to refresh token', error);
        commit('setAuthenticated', false);
        commit('setAccessToken', '');
        throw error;
      }
    },
    async logout({
      commit
    }) {
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('contribution');
        localStorage.removeItem('countries');
        localStorage.removeItem('form_safari');

        await axios.post('/logout', {}, {
          withCredentials: true
        });

        commit('clearAuthData');

        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    accessToken(state) {
      return state.accessToken;
    },
    productCode(state){
      return state.productCode
    },
    productName(state){
      return state.productName
    },
    abrorCont(state){
      return state.abrorCont
    },
    carBrand(state){
      return state.carBrand
    },
    carType(state){
      return state.carType
    },
    cars(state){
      return state.cars
    },
    brands(state){
      return state.brands
    },
    
  },
  plugins: [createPersistedState({
    paths: ['productCode', 'productName', 'abrorCont', 'carBrand', 'carType', 'cars', 'brands'] 
  })],
});

store.subscribe((mutation, state) => {
  if (mutation.type === 'setAccessToken') {
    axios.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
  } else if (mutation.type === 'clearAuthData') {
    delete axios.defaults.headers.common['Authorization'];
  }
});

export default store;