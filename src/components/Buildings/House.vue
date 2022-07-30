<template>
  <div class="building" @click="handleClick">
    <div class="image"/>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class House extends Vue {
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
  border: 1px solid #000;
  cursor: pointer;
  padding: 10px;

  .image {
    width: 100%;
    height: 100%;
    background-color: #ed143d;
    mask: url('../../assets/house.svg') no-repeat center;
  }

}

</style>
