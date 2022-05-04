<template>
 <ul class="list">
  <template v-if="mode=== 'add'">
    <li v-for="building in buildingOptions"
    :key="building.type"
    class="option"
    :class="{'disabled': isTooExpensive(building.cost)}"
    @click="handleAdd(building.type, building.cost)">
      Option {{building.type}} ({{building.cost}} gold)
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
import { IBuilding, IBuildingField } from '@/Utils/types';

export default class FieldMenu extends Vue {
  @Prop()
  fieldId!: number

  @Prop()
  mode!: string

  public get currentBankValue(): number {
    return store.state.bank;
  }

  public get buildingOptions(): IBuilding[] {
    return store.state.buildings.sort((a, b) => a.cost - b.cost);
  }

  public isTooExpensive(cost: number): boolean {
    return !!(cost > this.currentBankValue);
  }

  public handleAdd(type: string, cost: number): void {
    if (this.isTooExpensive(cost)) {
      return;
    }

    const jsonCity = window.localStorage.getItem('city');
    const newBuilding = { fieldId: this.fieldId, type };
    let city: IBuildingField[] = [];

    if (!jsonCity) {
      city.push(newBuilding);
      window.localStorage.setItem('city', JSON.stringify(city));
      store.commit('toggleMenu');
      return;
    }

    city = JSON.parse(jsonCity);

    // eslint-disable-next-line max-len
    const existingBuilding = city.findIndex((el) => el.fieldId === this.fieldId);

    if (existingBuilding !== -1) {
      city.splice(existingBuilding, 1, newBuilding);
    } else {
      city.push(newBuilding);
    }

    this.updateBank(cost);

    window.localStorage.setItem('city', JSON.stringify(city));
    store.commit('toggleMenu');
  }

  public updateBank(amount?: number): void {
    if (this.mode === 'edit') {
      const jsonCity = window.localStorage.getItem('city');

      if (!jsonCity) {
        return;
      }

      const city: IBuildingField[] = JSON.parse(jsonCity);
      const building = city.find((el) => el.fieldId === this.fieldId);
      const buildingInfo = store.state.buildings.find((b) => b.type === building?.type);
      const cost = buildingInfo?.cost ?? 0;
      store.commit('addBank', cost);
      window.localStorage.setItem('bank', this.currentBankValue.toString());
      return;
    }

    if (!amount) {
      return;
    }

    store.commit('substractBank', amount);
    window.localStorage.setItem('bank', this.currentBankValue.toString());
  }

  public handleDelete(): void {
    const jsonCity = window.localStorage.getItem('city');

    if (!jsonCity) {
      return;
    }

    const city: IBuildingField[] = JSON.parse(jsonCity);

    const existingBuilding = city.findIndex((el) => el.fieldId === this.fieldId);

    if (existingBuilding !== -1) {
      this.updateBank();
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
