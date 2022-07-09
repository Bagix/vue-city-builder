<template>
  <div class="building" @click="handleClick"/>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class Mine extends Vue {
  @Prop()
  fieldId!: number

  public handleClick(): void {
    this.$emit('openMenu', 'edit');
  }
}

</script>

<style scoped lang="scss">

.building {
  width: 100px;
  height: 100px;
  background-color: rgb(128, 27, 2);
  border: 1px solid #000;
  cursor: pointer;
}

</style>
