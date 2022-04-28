<template>
 <ul class="list">
   <li v-if="mode=== 'add'" class="option" @click="handleAdd">Option A</li>
   <li v-if="mode=== 'edit'" class="option" @click="handleDelete">Delete</li>
 </ul>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import store from '@/store';
import { IBuilding } from '@/Utils/types';

export default class FieldMenu extends Vue {
  @Prop()
  fieldId!: number

  @Prop()
  mode!: string

  public handleAdd(): void {
    console.log('wchodze');

    const jsonCity = window.localStorage.getItem('city');
    const newBuilding = { fieldId: this.fieldId, type: 'A' };
    let city: IBuilding[] = [];

    if (!jsonCity) {
      city.push(newBuilding);
      window.localStorage.setItem('city', JSON.stringify(city));
      store.commit('toggleMenu');
      return;
    }

    city = JSON.parse(jsonCity);

    // eslint-disable-next-line max-len
    const existingBuilding = city.findIndex((el) => el.fieldId === this.fieldId);

    if (existingBuilding !== -1) {
      city.splice(existingBuilding, 1, newBuilding);
    } else {
      city.push(newBuilding);
    }

    window.localStorage.setItem('city', JSON.stringify(city));
    store.commit('toggleMenu');
  }

  public handleDelete(): void {
    const jsonCity = window.localStorage.getItem('city');

    if (!jsonCity) {
      return;
    }

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
