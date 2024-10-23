import { createApp } from 'vue';
import App from './App.vue';
import './styles/tailwind.css';
import BootstrapVue3 from 'bootstrap-vue-3';
import { createPinia } from 'pinia';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(App);
const pinia = createPinia();

app.use(BootstrapVue3);
app.use(pinia);
app.mount('#app');
