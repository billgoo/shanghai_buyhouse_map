<template>
  <div class="example-custom-extension">
    <amap
      ref="rootMap"
      :is-hotspot="false"
      :show-indoor-map="false"
      :center="['121.475164', '31.228816']"
      :zoom="11"
      map-style="amap://styles/normal"
    >
      <NewHouseMap
        v-if="routeMap && routeMap[routeName] && workPlace"
        :key="routeName"
        :dataArray="routeMap[routeName]"
        :workArray="workPlace"
      />
    </amap>
  </div>
</template>

<script>
import NewHouseMap from "@/components/NewHouseMap.vue";
// import staticRes from "@s/index.js";
import routeMap from "@s/routeMap.json";
import workPlace from "@s/workPlace.json";

export default {
  components: { NewHouseMap },
  data() {
    return {
      routeMap: null,
      workPlace: null,
      routeName: this.$route.name,
    };
  },
  created() {
    // 这两行也是可以引入的
    // this.routeMap = staticRes.routeMap;
    // this.workPlace = staticRes.workPlace;
    this.routeMap = routeMap;
    this.workPlace = workPlace;
    // this.$axios
    //   .get("@s/routeMap.json")
    //   .then((res) => {
    //     const json = res.data;
    //     console.log("read static resources: ", json);
    //     this.routeMap = json ? Object.assign({}, json) : null;
    //     for (let key of Object.keys(this.routeMap)) {
    //       this.routeMap[key].sort(function (a, b) {
    //         // Compare the 2 ids
    //         if (a.id < b.id) return -1;
    //         if (a.id > b.id) return 1;
    //         return 0;
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("read static resource index path error:" + err);
    //   });
    // this.$axios
    //   .get("@s/workPlace.json")
    //   .then((res) => {
    //     const json = res.data;
    //     console.log("read static resources: ", json);
    //     this.workPlace = json.slice();
    //     this.workPlace.sort(function (a, b) {
    //       // Compare the 2 ids
    //       if (a.id < b.id) return -1;
    //       if (a.id > b.id) return 1;
    //       return 0;
    //     });
    //   })
    //   .catch((err) => {
    //     console.log("read static resource index path error:" + err);
    //   });
  },
  watch: {
    $route(to, from) {
      this.routeName = to.name;
    },
  },
};
</script>

<style lang="less" scoped>
.example-custom-extension {
  width: 100%;
  height: 80vh;
}
</style>
