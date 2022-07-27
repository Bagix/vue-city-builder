<template>
  <button class="theme-switch" :class="{'light': isDarkTheme}" @click="switchTheme">Switch Theme</button>
  <div class="resources-box">
    <p v-for="(resource, name) in currentResources"  :key="name" :class="name">
      <span class="name">{{name}}:</span>
      <span class="value">{{resource}}</span>
    </p>
  </div>

  <div class="wrapper">
    <div ref="gameBoard" class="game-board">
      <component
        v-for="(field, index) in 16"
        :is="getBlock(index)"
        :key="index"
        @openMenu="(mode) => openMenu(mode,index)"
        @click="getMousePosition($event)"
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
import Field from './components/Field.vue';
import House from './components/Buildings/House.vue';
import SideMenu from './components/SideMenu.vue';
import Mine from './components/Buildings/Mine.vue';
import Sawmill from './components/Buildings/Sawmill.vue';
import FieldMenu from './components/FieldMenu.vue';
import store from './store';
import { IBuilding, IBuildingField, IResources } from './Utils/types';

@Options({
  components: {
    Field,
    FieldMenu,
    House,
    Mine,
    Sawmill,
    SideMenu,
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
    const buildingsArray = store.state.buildings;
    const newBuilding = { fieldId, type };
    const building = buildingsArray.find((b) => b.type === type)!;

    if (!jsonCity) {
      const currentDate = (new Date()).toString();

      window.localStorage.setItem('city', JSON.stringify([newBuilding]));
      window.localStorage.setItem('citySavedTime', currentDate);
      store.commit('substractResources', building.cost);
      window.localStorage.setItem('resources', JSON.stringify(this.currentResources));
      return;
    }

    if (building.instantResources) {
      store.commit('addResources', building.instantResources);
    }

    const city = JSON.parse(jsonCity) as IBuildingField[];
    const currentDate = (new Date()).toString();

    city.push(newBuilding);

    window.localStorage.setItem('city', JSON.stringify(city));
    window.localStorage.setItem('citySavedTime', currentDate);

    store.commit('substractResources', building.cost);
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

  public updateResources(): void {
    const savedResourcesValue = window.localStorage.getItem('resources');
    const lastDateString = window.localStorage.getItem('citySavedTime');
    const jsonCity = window.localStorage.getItem('city');

    if (!savedResourcesValue || !lastDateString || !jsonCity) {
      return;
    }

    const city = JSON.parse(jsonCity) as IBuilding[];
    const resources = JSON.parse(savedResourcesValue) as Record<string, number>;
    const lastDate = new Date(lastDateString);
    const currentDate = new Date();
    const minutes = Math.trunc((currentDate.getTime() - lastDate.getTime()) / 60000);

    city.forEach((building) => {
      const currentBuilding = store.state.buildings.find((baseBuilding) => baseBuilding.type === building.type)!;

      Object.entries(currentBuilding.generate).forEach((entry) => {
        resources[entry[0]] += entry[1]! * minutes;
      });
    });

    store.commit('setResources', resources);
  }

  public switchTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    const html = document.querySelector('html')!;
    console.log('tutaj', this.isDarkTheme, html);

    if (this.isDarkTheme) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  public mounted(): void {
    this.updateResources();
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
}

.resources-box {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  font-weight: bold;
  width: 400px;
  margin: auto;
  background: #fefefe;

  .value {
    margin-left: 5px;
  }

  .gold .name {
    color: gold
  }

  .stones .name {
    color: gray
  }

  .woods .name {
    color: brown
  }

  .workers .name {
    color: darksalmon
  }
}

.resources-box {
  border: 2px solid black;
  border-radius: 10px;
  padding: 5px 15px;
  margin-bottom: 16px;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper .side-menu {
  margin-left: 50px;
}

.theme-switch {
  font-size: 16px;
  background: #0f1437;
  color: #fff;
  padding: 10px 16px;
  border-radius: 5px;
  margin: 30px 0 60px;
  border-color: #0f1437;
  font-weight: bold;
  cursor: pointer;
  transition: background .1s linear, color .1s linear .2s, box-shadow .2s linear,
              transform .2s cubic-bezier(0,1.25,.47,1.5);

  &:hover {
    box-shadow: 0 0 10px 10px #0f1437;
    transform: scale(2)
  }

  &.light {
    background: #fefefe;
    color: #0f1437;
    border-color: #fefefe;

    &:hover {
      box-shadow: 0 0 10px 10px #fefefe;
    }
  }

  &:active {
    border-color: transparent;
  }
}

</style>
