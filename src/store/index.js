import Vue from "vue";
import Vuex from "vuex";
import { Auth, DataStore } from "aws-amplify";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    async getSession({ dispatch, commit }) {
      try {
        const user = await Auth.currentAuthenticatedUser();
        commit("SET_USER", user);
      } catch (e) {
        dispatch("logout");
      }
    },
    async logout({ commit }) {
      // Clear DataStore Local Data
      await DataStore.clear();
      commit("SET_USER", null);
    }
  },
  modules: {}
});
