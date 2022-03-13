<template>
  <div class="example-custom-extension">
    {{ "需移动取坐标使用 " + "https://jimliu.net/amap-vue/examples/coord-picker.html" }}
    <amap
      :is-hotspot="false"
      :show-indoor-map="false"
      :center="null"
      :zoom="13"
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
};
</script>

<style lang="less" scoped>
.example-custom-extension {
  width: 100%;
  height: 600px;
}
</style>
