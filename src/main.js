import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { createStore } from "vuex";
import tokens from "./store/tokens";

const pinia = createPinia();
const app = createApp(App);
const store = createStore({
  modules: {
    tokens: tokens,
  },
});

app.use(pinia);
app.use(store);
app.mount("#app");
