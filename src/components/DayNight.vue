<template>
  <div class="wrapper" @click="handleClick">
    <div class="sun-moon-box" :class="{'night': isNight}">
      <div class="sun">
        <div class="image"/>
      </div>
      <div class="moon">
        <div class="image"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class DayNight extends Vue {
  public isNight = false;

  public handleClick(): void {
    this.isNight = !this.isNight;
    this.$emit('change', this.isNight);
  }
}

</script>

<style scoped lang="scss">

.wrapper,
.sun,
.moon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.wrapper {
  position: relative;
  margin: 30px auto 60px;
  cursor: pointer;
  overflow: hidden;
}

.sun-moon-box {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform .5s ease-out;

  &.night {
    transform: rotate(180deg);
  }
}

.sun {
  margin-bottom: 30px;

  .image {
    width: 100%;
    height: 100%;
    background-color: #eaa722;
    mask: url('../assets/sun.svg') no-repeat center;
  }
}

.moon {
  transform: rotate(180deg);
  padding: 4px;

  .image {
    width: 100%;
    height: 100%;
    background-color: #fff;
    mask: url('../assets/moon.svg') no-repeat center;
  }
}

</style>
