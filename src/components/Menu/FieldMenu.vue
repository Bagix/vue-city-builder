<template>
 <ul class="list">
  <template v-if="mode=== 'add'">
    <MenuOption
      v-for="building in buildingOptions"
      :key="building.type"
      class="option"
      :building="building"
      :fieldId="fieldId"
    />
  </template>

  <template  v-if="mode=== 'edit'">
    <li class="option" @click="handleDelete">Delete</li>
  </template>
 </ul>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import store from '@/store';
import { IBuilding, IBuildingField } from '@/Utils/types';
import MenuOption from '@/components/Menu/MenuOption.vue';

@Options({
  components: {
    MenuOption,
  },
})
export default class FieldMenu extends Vue {
  @Prop()
  fieldId!: number

  @Prop({ require: true })
  mode!: string;

  public get currentResources(): Record<string, number> {
    return store.state.resources;
  }

  public get buildingOptions(): IBuilding[] {
    return store.state.buildings;
  }

  public returnResources(): void {
    const jsonCity = window.localStorage.getItem('city');

    if (!jsonCity) {
      return;
    }

    const city: IBuildingField[] = JSON.parse(jsonCity);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const building = city.find((el) => el.fieldId === this.fieldId)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const buildingInfo = store.state.buildings.find((b) => b.type === building.type)!;

    if (buildingInfo.instantResources) {
      store.commit('substractResources', buildingInfo.instantResources);
    }

    const buildingCost = buildingInfo.cost;
    store.commit('addResources', buildingCost);
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
      this.returnResources();
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
}

</style>
