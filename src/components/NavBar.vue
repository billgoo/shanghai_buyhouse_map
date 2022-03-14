<template>
  <div class="smy__menu">
    <div class="logo-text">Vue 上海买房地图</div>
    <el-menu
      ref="barMenu"
      :default-openeds="['1']"
      style="width: 100%; height: 92%; overflow-x: hidden;"
      router
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span style="font-weight: bold">首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-map-location"></i>
          <span style="font-weight: bold">地图组件</span>
        </template>
        <el-menu-item index="/coordPicker">坐标查询工具</el-menu-item>
        <el-menu-item index="/firstNew">第一批</el-menu-item>
        <el-menu-item index="/secondNew">第二批</el-menu-item>
        <el-menu-item index="/custom">预测（自定义）</el-menu-item>
        <el-menu-item index="/rawAmap">地点搜索</el-menu-item>
        <el-menu-item index="/gaode">原生高德地图</el-menu-item>
      </el-submenu>
      <el-menu-item index="/about">
        <i class="el-icon-info"></i>
        <span style="font-weight: bold">关于</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};
  },
  methods: {
    // changePath(item) {
    //   // console.log(item, key, selectedKeys)
    //   this.$router.push({ path: item.key });
    // },
  },
  created() {},
};
</script>

<style scoped>
.smy__menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-shadow: 2px 0 6px #ededed;
  transition: 0.5s;
}

.logo-text {
  flex-shrink: 0;
  display: flex;
  height: 8%;
  width: 100%;
  color: #495060;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 2px 6px #ededed;
  z-index: 999;
}
</style>
