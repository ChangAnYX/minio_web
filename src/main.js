import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import store from "./store";
import upload from "vue-simple-uploader";
import all from "@/libs/globalFunction.js";

/*全局样式*/
import "./assets/css/global.css";
import "font-awesome/css/font-awesome.css";

Vue.config.productionTip = false;
Vue.use(ElementUI); //{size: 'small'}
Vue.use(all);
Vue.use(upload);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


