<template>
  <div class="game-board">
    <Field v-for="(field, index) in 16" :key="index" @openMenu="toogleMenu(index)"/>
    <FieldMenu v-if="showMenu" :selectedField="selectedFieldIndex"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Field from './components/Field.vue';
import FieldMenu from './components/FieldMenu.vue';
import store from './store';

@Options({
  components: {
    Field,
    FieldMenu,
  },
})
export default class App extends Vue {
  showMenu = false;

  selectedFieldIndex: null | number = null;

  toogleMenu(index: number): void {
    // console.log(store.state.isMenuOpen);
    // store.commit('toggleMenu');
    this.selectedFieldIndex = index;
    this.showMenu = !this.showMenu;
  }
}
</script>

<style lang="scss">

* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.game-board {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 400px;
  margin: auto;
}

</style>
