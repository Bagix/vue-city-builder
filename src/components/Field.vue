<template>
  <div class="field"
    @click="handleClick"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter.prevent
  />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Field extends Vue {
  public handleClick(): void {
    this.$emit('openMenu', 'add');
  }

  public handleDrop(e: DragEvent): void {
    if (!e.dataTransfer) {
      return;
    }

    const building = e.dataTransfer.getData('building');
    this.$emit('dropBuilding', building);
  }
}

</script>

<style scoped lang="scss">

.field {
  width: 100px;
  height: 100px;
  background-color: #cdcdcd;
  border: 1px solid #000;
  cursor: pointer;
}

</style>
