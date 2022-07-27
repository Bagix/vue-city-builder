<template>
  <div class="field"
    :class="{'drag-enter': isDragged}"
    @click="handleClick"
    @drop="handleDrop"
    @dragenter.prevent="toggleDragEffect"
    @dragleave="toggleDragEffect"
    @dragover.prevent
  />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Field extends Vue {
  public isDragged = false;

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

  public toggleDragEffect(): void {
    this.isDragged = !this.isDragged;
  }
}

</script>

<style scoped lang="scss">

.field {
  width: 100px;
  height: 100px;
  background: #cdcdcd;
  border: 1px solid #000;
  cursor: pointer;
  transition: background .15s linear, transform .15s linear;
}

.drag-enter {
  background: #ffff63;
  transform: scale(1.15)
}

</style>
