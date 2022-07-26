<template>
  <div class="side-menu">
    <component v-for="(building, index) in buildingOptions"
      :key="index"
      :is="building.type"
      :class="{'disabled': isTooExpensive(building.cost)}"
      :draggable="!isTooExpensive(building.cost)"
      :title="buildingCostString(building.cost)"
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
import { buildingCostString } from '@/Utils/share';

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

  public buildingCostString(cost:IBuildingCost): string {
    return buildingCostString(cost);
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

<style scoped lang="scss">

.side-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 400px;
}

.disabled {
  background-image: linear-gradient(#000 33%, #222 66%, transparent);
  cursor: default;
}

</style>
