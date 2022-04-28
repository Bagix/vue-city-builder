<template>
  <div class="field" @click="handleClick"/>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Field extends Vue {
  handleClick(): void {
    this.$emit('openMenu');
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
