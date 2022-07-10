<template>
 <ul class="list">
  <template v-if="mode=== 'add'">
    <li v-for="building in buildingOptions"
    :key="building.type"
    class="option"
    :class="{'disabled': isTooExpensive(building.cost)}"
    :title="buildingCostString(building.cost)"
    @click="handleAdd(building)">
      {{building.type}}
    </li>
  </template>

  <template  v-if="mode=== 'edit'">
    <li class="option" @click="handleDelete">Delete</li>
  </template>
 </ul>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import store from '@/store';
import {
  IBuilding, IBuildingCost, IBuildingField,
} from '@/Utils/types';

export default class FieldMenu extends Vue {
  @Prop()
  fieldId!: number

  @Prop({ require: true })
  mode!: string;

  public get currentResources(): Record<string, number> {
    return store.state.resources;
  }

  public buildingCostString(cost:IBuildingCost): string {
    const x = Object.entries(cost).map((resource) => `${resource[0]}: ${resource[1]}`);
    return `
      Cost:
      ${x.toString()}
    `;
  }

  public get buildingOptions(): IBuilding[] {
    return store.state.buildings;
  }

  public isTooExpensive(cost: IBuildingCost): boolean {
    return Object.entries(cost).some((resource) => resource[1] > this.currentResources[resource[0]]);
  }

  public handleAdd(building: IBuilding): void {
    if (this.isTooExpensive(building.cost)) {
      return;
    }

    console.log('cos jest', building);

    const jsonCity = window.localStorage.getItem('city');
    const newBuilding = { fieldId: this.fieldId, type: building.type };

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

    this.updateResources(building.cost);

    window.localStorage.setItem('city', JSON.stringify(city));
    window.localStorage.setItem('citySavedTime', currentDate);
    store.commit('toggleMenu');
  }

  /**
   * Initialize city
   * @param newBuilding new building object
   * @param cost cost of new building
   */
  public initCity(newBuilding: IBuildingField, cost: IBuildingCost): void {
    const currentDate = (new Date()).toString();

    window.localStorage.setItem('city', JSON.stringify([newBuilding]));
    this.updateResources(cost);
    window.localStorage.setItem('citySavedTime', currentDate);
    store.commit('toggleMenu');
  }

  public updateResources(cost?: IBuildingCost): void {
    if (this.mode === 'edit') {
      const jsonCity = window.localStorage.getItem('city');

      if (!jsonCity) {
        return;
      }

      const city: IBuildingField[] = JSON.parse(jsonCity);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const building = city.find((el) => el.fieldId === this.fieldId)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const buildingInfo = store.state.buildings.find((b) => b.type === building.type)!;
      const buildingCost = buildingInfo.cost;
      store.commit('addResources', buildingCost);
      window.localStorage.setItem('resources', JSON.stringify(this.currentResources));
      return;
    }

    if (!cost) {
      return;
    }

    store.commit('substractResources', cost);
    window.localStorage.setItem('resources', JSON.stringify(this.currentResources));
  }

  public handleDelete(): void {
    const jsonCity = window.localStorage.getItem('city');

    if (!jsonCity) {
      return;
    }

    const city: IBuildingField[] = JSON.parse(jsonCity);

    const existingBuilding = city.findIndex((el) => el.fieldId === this.fieldId);

    if (existingBuilding !== -1) {
      this.updateResources();
      city.splice(existingBuilding, 1);
      window.localStorage.setItem('city', JSON.stringify(city));
    }

    store.commit('toggleMenu');
  }
}

</script>

<style scoped lang="scss">

.list {
  position: absolute;
  top: 0;
  left: 0;
  width: 125px;
  height: 125px;
  background-color: #fff;
  border: 1px solid cyan;
  list-style: none;
  margin: 0;
  padding: 0;
}

.option {
  padding: 5px;
  border-bottom: 1px solid #cdcdcd;
  cursor: pointer;
  transition: background .1s linear, color .1s linear;

  &:hover {
    background: rgb(32, 206, 162);
    color: #fff;
  }

  &.disabled {
    color: #bebebe;
    background: #cdcdcd;
    pointer-events: none;
  }
}

</style>
