<template>
  <div class="example-custom-extension">
    <amap
      async
      :is-hotspot="false"
      :show-indoor-map="false"
      :center.sync="center"
      :zoom.sync="zoom"
      map-style="amap://styles/normal"
    >
      <CustomMap />
    </amap>
  </div>
</template>

<script>
import CustomMap from "@/components/CustomMap.vue";

export default {
  components: { CustomMap },
  data() {
    return {
      center: null,
      zoom: 13,
    };
  },
};
</script>

<style lang="less" scoped>
.example-custom-extension {
  width: 100%;
  height: 80vh;
}
</style>
