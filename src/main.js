import naiveui from 'naive-ui';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Provider from './components/Provider.vue'
import router from './router'
import Axios from 'axios'
import VueEasyLightbox from 'vue-easy-lightbox'

import YmapPlugin from "vue-yandex-maps"

// let MIDDLEWARE_URL = 'https://middleware.bdm.uz/'
let VITE_BASE_URL = 'https://api-texnowell.bdm.uz/api/v1/'
// let VITE_BASE_URL = 'http://localhost:8080/api/v1/'
Axios.defaults.baseURL = VITE_BASE_URL

Axios.defaults.timeout = 20000

const app = createApp(Provider)
app.use(VueEasyLightbox)

app.use(createPinia());

import { useErrorStore } from './stores/error'
const errorStore = useErrorStore()
const settings = {
  apiKey: '4df75bf4-23fc-49d0-b865-284adb1324de',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1'
}
app.use(YmapPlugin, settings)


Axios.interceptors.request.use(function (config) {
    // config.data['url'] = VITE_BASE_URL + config.data['url'];
    // config.data['headers'] = {
    //   "Authorization": "Bearer " + localStorage.getItem('token')
    // }
    config.headers['Authorization'] = "Bearer " + localStorage.getItem('token')
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

Axios.interceptors.response.use((res) => {
  return res.data;
}, (err) => {
  errorStore.errorText = JSON.stringify(err.response.statusText)
  if(err.response.status == 401) {
    router.push({ name: 'login' })
  }
  return Promise.reject("Xatolik")
})


app.use(router);
app.use(naiveui);
app.provide('imgUrl',`${VITE_BASE_URL}uploads/`);

app.mount('#app')
