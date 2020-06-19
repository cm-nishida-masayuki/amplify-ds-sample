import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import { AmplifyEventBus } from "aws-amplify-vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

AmplifyEventBus.$on("authState", async state => {
  if (state === "signedOut") {
    await store.dispatch("logout");
    router.push({ name: "login" });
  } else if (state === "signedIn") {
    await store.dispatch("getSession");
    router.push({ name: "Home" });
  }
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters["isAuthenticated"]) {
      await store.dispatch("getSession");
      if (!store.getters["isAuthenticated"]) {
        next({ name: "login" });
      }
    }
  }

  next();
});

export default router;
