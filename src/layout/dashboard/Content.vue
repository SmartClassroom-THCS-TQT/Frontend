<template>
  <div class="content" :style="{ backgroundImage: `url(${require('@/assets/img/PG_bg_3.png')})` }">
    <fade-transition :duration="100" mode="out-in">
      <!-- your content here -->
      <router-view></router-view>
    </fade-transition>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
export default {
  components: {
    FadeTransition,
  },
};
</script>

