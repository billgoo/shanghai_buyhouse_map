<template>
  <div>
    <div id="iframe-container">
      <iframe :src="$route.meta.link" scrolling="auto" frameborder="0" class="trend-container2" id="iframe"></iframe>
    </div>
  </div>
</template>

<script>
import NProgress from 'nprogress'

export default {
  name: "ExternalView",
  mounted() {
    let iframe = document.getElementById('iframe')
    NProgress.start()

    iframe.onload = function() {
      NProgress.done()
    }
  },
}
</script>

<style scoped>
.trend-container2 {
  position: relative;
  width: 100%;
  min-height: 700px;
  padding-bottom: 16px;
}
</style>

