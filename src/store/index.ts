import { createStore } from 'vuex';

export default createStore({
  state: {
    isMenuOpen: false,
    bank: 10,
    buildings: [
      { type: 'A', cost: 4 },
      { type: 'B', cost: 6 },
    ],
  },
  mutations: {
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    substractBank(state, payload) {
      state.bank -= payload;
    },
    addBank(state, payload) {
      state.bank += payload;
    },
    setBank(state, payload) {
      state.bank = payload;
    },
  },
  actions: {
  },
  modules: {
  },
});
