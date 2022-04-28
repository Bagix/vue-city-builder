<template>
  <div ref="gameBoard" class="game-board">
    <component
      v-for="(field, index) in 16"
      :is="getBlock(index)"
      :key="index"
      @openMenu="(mode) => openMenu(mode,index)"
      @click="getMousePosition($event)"
     />

    <FieldMenu v-if="isMenuOpen"
      :style="mousePosition"
      :fieldId="selectedFieldId"
      :mode="menuMode"
     />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Field from './components/Field.vue';
import Building from './components/Building.vue';
import FieldMenu from './components/FieldMenu.vue';
import store from './store';
import { IBuilding } from './Utils/types';

@Options({
  components: {
    Field,
    FieldMenu,
    Building,
  },
})

export default class App extends Vue {
  selectedFieldId: null | number = null;

  menuMode: string = 'add' || 'edit';

  mousePosition: Record<string, string> = {};

  public get isMenuOpen(): boolean {
    return store.state.isMenuOpen;
  }

  public getBlock(fieldId: number): string {
    const jsonCity = window.localStorage.getItem('city');

    if (!jsonCity) {
      return 'Field';
    }

    const city: IBuilding[] = JSON.parse(jsonCity);
    const building = city.find((el) => el.fieldId === fieldId);

    if (building) {
      return 'Building';
    }

    return 'Field';
  }

  public getMousePosition(event: MouseEvent): void {
    const board = this.$refs.gameBoard as HTMLElement;
    const topValue = event.clientY - board.getBoundingClientRect().top;
    const leftValue = event.clientX - board.getBoundingClientRect().left;

    this.mousePosition = {
      top: `${topValue}px`,
      left: `${leftValue}px`,
    };
  }

  public openMenu(mode: string, index: number): void {
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
