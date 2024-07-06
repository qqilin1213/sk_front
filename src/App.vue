<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';

try {
  // Detect mobile browsers
  if (navigator.userAgent.match(/iPhone|iPad|Android/i)) {
      document.body.classList.add('is-mobile');
  }
} catch (e) {
  //
}
</script>


<style>
  @import '@/assets/styles/base.css';
</style>
