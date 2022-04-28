<template>
  <div class="game-board">
    <!-- <Field v-for="(field, index) in 16" :key="index" @openMenu="toogleMenu(index)"/> -->
    <component v-bind:is="getBlock(index)" v-for="(field, index) in 16"
    :key="index" @openMenu="(mode) => toogleMenu(mode,index)"/>
    <FieldMenu v-if="isMenuOpen" :fieldId="selectedFieldId" :mode="menuMode"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Field from './components/Field.vue';
import Building from './components/Building.vue';
import FieldMenu from './components/FieldMenu.vue';
import store from './store';

@Options({
  components: {
    Field,
    FieldMenu,
    Building,
  },
})
export default class App extends Vue {
  selectedFieldId: null | number = null;

  menuMode: string = 'add' || 'delete';

  public get isMenuOpen(): boolean {
    return store.state.isMenuOpen;
  }

  public getBlock(fieldId: number): string {
    const jsonCity = window.localStorage.getItem('city');

    if (!jsonCity) {
      return 'Field';
    }

    const city = JSON.parse(jsonCity);
    const building = city.find((el:Record<string, number|string>) => el.field_id === fieldId);

    if (building) {
      return 'Building';
    }

    return 'Field';
  }

  public toogleMenu(mode: string, index: number): void {
    this.selectedFieldId = index;
    this.menuMode = mode;
    store.commit('toggleMenu');
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
