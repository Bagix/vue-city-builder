import { createStore } from 'vuex';

export default createStore({
  state: {
    isMenuOpen: false,
    resources: {
      gold: 10,
      stones: 5,
      woods: 5,
      workers: 0,
    },
    buildings: [
      {
        type: 'House',
        instantResources: {
          workers: 5,
        },
        cost: {
          gold: 3,
          stones: 2,
          woods: 2,
        },
        generate: {
          gold: 1,
        },
      },
      {
        type: 'Mine',
        isInstant: false,
        cost: {
          gold: 4,
          woods: 3,
          workers: 3,
        },
        generate: {
          stones: 1,
        },
      },
      {
        type: 'Sawmill',
        isInstant: false,
        cost: {
          gold: 2,
          workers: 2,
        },
        generate: {
          woods: 2,
        },
      },
    ],
  },
  mutations: {
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    substractResources(state, payload) {
      const resources = state.resources as Record<string, number>;

      Object.keys(payload).forEach((key) => {
        resources[key] -= payload[key];
      });
    },
    addResources(state, payload) {
      const resources = state.resources as Record<string, number>;

      Object.keys(payload).forEach((key) => {
        resources[key] += payload[key];
      });
    },
    setResources(state, payload) {
      const resources = state.resources as Record<string, number>;

      Object.keys(payload).forEach((key) => {
        resources[key] = payload[key];
      });
    },
  },
  actions: {
  },
  modules: {
  },
});
