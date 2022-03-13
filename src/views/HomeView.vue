<template>
  <el-container class="container__box">
    <el-aside class="container__left" width="20%">
      <NavBar />
    </el-aside>
    <el-main class="container__right">
      <el-card v-if="this.$route.path === '/'" class="container__content">
        <div>
          <TheWelcome />
        </div>
      </el-card>
      <el-card v-else class="container__content">
        <transition :name="transitionName">
          <router-view class="router" />
        </transition>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import TheWelcome from "@/components/Welcome/TheWelcome.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "HomeView",
  components: {
    TheWelcome,
    NavBar,
  },
  data() {
    return {
      transitionName: "",
      // 更新说明
      updateInfo: {},
      updateEditModal: false,
    };
  },
  computed: {},
  methods: {},
  created() {},
  beforeRouteEnter(to, from, next) {
    next();
  },
};
</script>

<style scoped>
.container__box {
  display: flex;
  height: 100%;
  border: 1px solid #eee;
}
.container__left {
  display: flex;
  height: 100%;
}

.container__right {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.container__content {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  position: relative;
}
</style>
