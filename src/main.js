
import Vue from "vue";
import VueRouter from "vue-router";
import RouterPrefetch from "vue-router-prefetch";
import App from "./App";
// TIP: change to import router from "./router/starterRouter"; to start with a clean layout
import router from "./router/index";
import { BootstrapVue ,BSpinner } from 'bootstrap-vue'


import BlackDashboard from "./plugins/blackDashboard";
import i18n from "./i18n";
import VCalendar from 'v-calendar';

import "./registerServiceWorker";

// import css

import './assets/css/styles.css'

Vue.component('b-spinner', BSpinner)
Vue.use(BootstrapVue)
Vue.use(BlackDashboard);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.use(VCalendar, {
  componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
});

new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
