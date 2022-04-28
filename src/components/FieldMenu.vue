<template>
 <ul class="list">
   <li v-if="mode=== 'add'" @click="handleAdd">Option A</li>
   <li v-if="mode=== 'delete'" @click="handleDelete">Delete</li>
 </ul>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import store from '@/store';

export default class FieldMenu extends Vue {
  @Prop()
  fieldId!: number

  @Prop()
  mode!: string

  public handleAdd(): void {
    const jsonCity = window.localStorage.getItem('city');
    const newBuilding = { field_id: this.fieldId, buildind: 'A' };
    let city = [];

    if (!jsonCity) {
      city.push(newBuilding);
      window.localStorage.setItem('city', JSON.stringify(city));
      return;
    }

    city = JSON.parse(jsonCity);

    // eslint-disable-next-line max-len
    const existingBuilding = city.findIndex((el:Record<string, number|string>) => el.field_id === this.fieldId);

    if (existingBuilding !== -1) {
      city.splice(existingBuilding, 1, newBuilding);
    } else {
      city.push(newBuilding);
    }

    window.localStorage.setItem('city', JSON.stringify(city));
    store.commit('toggleMenu');
  }

  public handleDelete(): void {
    const jsonCity = window.localStorage.getItem('city')!;
    const city = JSON.parse(jsonCity);

    // eslint-disable-next-line max-len
    const existingBuilding = city.findIndex((el:Record<string, number|string>) => el.field_id === this.fieldId);

    if (existingBuilding !== -1) {
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
  list-style: none;

   li {
     cursor: pointer;
   }
}

</style>
