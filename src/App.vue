<template>
  <div id="app" v-cloak>
    <!-- <img src="./assets/logo.png"> -->
    <!-- TODO: 兼容不同显示尺寸的设备 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import HomeView from './views/HomeView.vue'
</script>

<style>
@import '@/assets/base.css';
@import '@/assets/customStyle.css';

#app {
  text-align: center;
  color: #2c3e50;
  background: #F8F8F9;
  /* margin-top: 60px; */
}

html {
  min-width: 1200px;
}

html,body,#app{
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0px;
}
.smy__card-full {
  min-height: 100%;
}
[v-cloak]{
  display: 'none';
}
</style>
