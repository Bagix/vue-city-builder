<template>
  <DayNight @change="switchTheme"/>
  <ResourcesBox/>
  <div class="wrapper">
    <div ref="gameBoard" class="game-board">
      <component
        v-for="(field, index) in 16"
        :is="getBlock(index)"
        :key="index"
        @openMenu="(mode) => openMenu(mode,index)"
        @click="getMousePosition"
        @dropBuilding="((building) => dropBuilding(building, index))"
      />
      <FieldMenu
        v-if="isMenuOpen"
        :style="mousePosition"
        :fieldId="selectedFieldId"
        :mode="menuMode"
       />
    </div>
    <SideMenu/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { saveFirstbuilding } from '@/Utils/share';
import Field from './components/Field.vue';
import House from './components/Buildings/House.vue';
import SideMenu from './components/SideMenu.vue';
import Mine from './components/Buildings/Mine.vue';
import Sawmill from './components/Buildings/Sawmill.vue';
import FieldMenu from './components/Menu/FieldMenu.vue';
import ResourcesBox from './components/ResourcesBox.vue';
import DayNight from './components/DayNight.vue';
import store from './store';
import { IBuildingCost, IBuildingField, IResources } from './Utils/types';

@Options({
  components: {
    Field,
    FieldMenu,
    House,
    Mine,
    Sawmill,
    SideMenu,
    DayNight,
    ResourcesBox,
  },
})
export default class App extends Vue {
  public isDarkTheme = false;

  public selectedFieldId: null | number = null;

  public menuMode: string = 'add' || 'edit';

  public mousePosition: Record<string, string> = {};

  public get isMenuOpen(): boolean {
    return store.state.isMenuOpen;
  }

  public get currentResources(): IResources {
    return store.state.resources;
  }

  public dropBuilding(type: string, fieldId: number): void {
    const jsonCity = window.localStorage.getItem('city');
    const newBuilding = { fieldId, type };
    const buildingsArray = store.state.buildings;
    const building = buildingsArray.find((b) => b.type === type)!;

    if (building.instantResources) {
      store.commit('addResources', building.instantResources);
    }

    if (!jsonCity) {
      this.initCity(newBuilding, building.cost);
      return;
    }

    const city = JSON.parse(jsonCity) as IBuildingField[];
    const currentDate = (new Date()).toString();

    city.push(newBuilding);

    window.localStorage.setItem('city', JSON.stringify(city));
    window.localStorage.setItem('citySavedTime', currentDate);

    store.commit('substractResources', building.cost);
    window.localStorage.setItem('resources', JSON.stringify(this.currentResources));
  }

  public initCity(newBuilding: IBuildingField, cost: IBuildingCost): void {
    saveFirstbuilding(newBuilding);
    store.commit('substractResources', cost);
    window.localStorage.setItem('resources', JSON.stringify(this.currentResources));
  }

  public getBlock(fieldId: number): string {
    const jsonCity = window.localStorage.getItem('city');

    if (!jsonCity) {
      return 'Field';
    }

    const city: IBuildingField[] = JSON.parse(jsonCity);
    const building = city.find((el) => el.fieldId === fieldId);

    if (building) {
      return `${building.type}`;
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

  public switchTheme(isNight: boolean): void {
    this.isDarkTheme = isNight;
    const html = document.querySelector('html')!;

    if (this.isDarkTheme) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
</script>

<style lang="scss">

* {
  box-sizing: border-box;
}

body,
html {
  margin: 0;
}

html {
  transition: background .2s linear;

  &.dark {
    background: #0f1437;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.game-board {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 400px;

  .building {
    background-image: url('./assets/field-bg.jpg');
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper .side-menu {
  margin-left: 50px;
}

</style>
