<template>
  <div class="side-menu">
    <component v-for="(building, index) in buildingOptions"
      :key="index"
      :is="building.type"
      :draggable="!isTooExpensive(building.cost)"
      @dragstart="handleDragStart($event, building.type)"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import House from '@/components/Buildings/House.vue';
import Mine from '@/components/Buildings/Mine.vue';
import Sawmill from '@/components/Buildings/Sawmill.vue';
import store from '@/store';
import { IBuilding, IBuildingCost } from '@/Utils/types';

@Options({
  components: {
    House,
    Mine,
    Sawmill,
  },
})
export default class SideMenu extends Vue {
  public get buildingOptions(): IBuilding[] {
    return store.state.buildings;
  }

  public get currentResources(): Record<string, number> {
    return store.state.resources;
  }

  public handleDragStart(e: DragEvent, buildingType: string): void {
    if (!e.dataTransfer) {
      return;
    }

    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('building', buildingType);
  }

  public isTooExpensive(cost: IBuildingCost): boolean {
    return Object.entries(cost).some((resource) => resource[1] > this.currentResources[resource[0]]);
  }
}
</script>

<style lang="scss">

</style>
