<template>
 <ul class="list">
   <li @click="handleClick">Option A</li>
 </ul>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

export default class FieldMenu extends Vue {
  @Prop()
  selectedField!: number

  handleClick(): void {
    const jsonCity = window.localStorage.getItem('city');
    const newBuilding = { field: this.selectedField, buildind: 'A' };
    let city = [];

    if (!jsonCity) {
      city.push(newBuilding);
      window.localStorage.setItem('city', JSON.stringify(city));
      return;
    }

    city = JSON.parse(jsonCity);

    // eslint-disable-next-line max-len
    const existingBuilding = city.findIndex((el:Record<string, number|string>) => el.field === this.selectedField);

    if (existingBuilding !== -1) {
      city.splice(existingBuilding, 1, newBuilding);
    } else {
      city.push(newBuilding);
    }

    window.localStorage.setItem('city', JSON.stringify(city));
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
  list-style: none;
}

</style>
