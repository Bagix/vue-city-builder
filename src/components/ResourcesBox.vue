<template>
  <div class="resources-box">
    <p v-for="(resource, name) in currentResources"  :key="name" :class="name">
      <span class="name">{{name}}:</span>
      <span class="value">{{resource}}</span>
    </p>
  </div>

</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import store from '@/store';
import { IBuilding, IResources } from '@/Utils/types';

export default class ResourcesBox extends Vue {
  public get currentResources(): IResources {
    return store.state.resources;
  }

  public updateResources(): void {
    const savedResourcesValue = window.localStorage.getItem('resources');
    const lastDateString = window.localStorage.getItem('citySavedTime');
    const jsonCity = window.localStorage.getItem('city');

    if (!savedResourcesValue || !lastDateString || !jsonCity) {
      return;
    }

    const city = JSON.parse(jsonCity) as IBuilding[];
    const resources = JSON.parse(savedResourcesValue) as Record<string, number>;
    const lastDate = new Date(lastDateString);
    const currentDate = new Date();
    const minutes = Math.trunc((currentDate.getTime() - lastDate.getTime()) / 60000);

    city.forEach((building) => {
      const currentBuilding = store.state.buildings.find((baseBuilding) => baseBuilding.type === building.type)!;

      Object.entries(currentBuilding.generate).forEach((entry) => {
        resources[entry[0]] += entry[1]! * minutes;
      });
    });

    store.commit('setResources', resources);
  }

  public mounted(): void {
    this.updateResources();
  }
}
</script>

<style scoped lang="scss">

.resources-box {
  display: flex;
  justify-content: space-between;
  margin: 16px auto;
  font-weight: bold;
  width: 400px;
  background: #fefefe;
  border: 2px solid black;
  border-radius: 10px;
  padding: 5px 15px;

  .value {
    margin-left: 5px;
  }

  .gold .name {
    color: gold
  }

  .stones .name {
    color: #000
  }

  .woods .name {
    color: #8e1515
  }

  .workers .name {
    color: #ed143d
  }
}

</style>
