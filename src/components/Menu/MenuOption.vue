<template>
  <li
  :class="{'disabled': isTooExpensive(building.cost)}"
  :title="buildingCostString(building.cost)"
  @click="handleAdd(building)">
    {{building.type}}
  </li>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import store from '@/store';
import { IBuilding, IBuildingCost, IBuildingField } from '@/Utils/types';
import { buildingCostString, saveFirstbuilding } from '@/Utils/share';

export default class MenuOption extends Vue {
  @Prop()
  fieldId!: number

  @Prop()
  building!: IBuilding

  public get currentResources(): Record<string, number> {
    return store.state.resources;
  }

  public buildingCostString(cost:IBuildingCost): string {
    return buildingCostString(cost);
  }

  public isTooExpensive(cost: IBuildingCost): boolean {
    return Object.entries(cost).some((resource) => resource[1] > this.currentResources[resource[0]]);
  }

  public handleAdd(building: IBuilding): void {
    if (this.isTooExpensive(building.cost)) {
      return;
    }

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
    saveFirstbuilding(newBuilding);
    this.updateResources(cost);
    store.commit('toggleMenu');
  }

  public updateResources(cost: IBuildingCost): void {
    store.commit('substractResources', cost);
    window.localStorage.setItem('resources', JSON.stringify(this.currentResources));
  }
}

</script>

<style scoped lang="scss">

.disabled {
  color: #bebebe;
  background: #cdcdcd;
  pointer-events: none;
}

</style>
