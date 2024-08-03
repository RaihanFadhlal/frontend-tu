import axios from 'axios';
import store from './store';
import router from './router';

const instance = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true
});

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post('/refresh-token', {}, {
          baseURL: 'http://localhost:9000',
          withCredentials: true
        });
        store.commit('setAccessToken', response.data.access_token);
        store.commit('setAuthenticated', true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${store.state.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error('Refresh token failed:', err);
        store.commit('setAuthenticated', false);
        store.commit('setAccessToken', '');
        router.push('/login');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;