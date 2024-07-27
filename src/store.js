// store.js
import {
  createStore
} from 'vuex';
import axios from './axios';

const store = createStore({
  state: {
    accessToken: localStorage.getItem('accessToken') || '',
    isAuthenticated: !!localStorage.getItem('accessToken'),
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
  },
});

store.subscribe((mutation, state) => {
  if (mutation.type === 'setAccessToken') {
    axios.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
  } else if (mutation.type === 'clearAuthData') {
    delete axios.defaults.headers.common['Authorization'];
  }
});

export default store;