<!--
 * @Author: qqilin1213
 * @Date: 2024-06-17 15:38:20
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 15:19:02
-->
<template>
  <main class="min-h-screen flex flex-col overflow-hidden select-none">
    <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 justify-between items-center mx-4 my-4 md:mx-12 z-10">
      <div class="font-splatoon1 text-5xl text-shadow-lg">
        <router-link to="/" class="text-zinc-200"> Splatoon 3 </router-link>
      </div>
      <div class="justify-end font-splatoon2 text-4xl text-zinc-200"> 鱿鱼杀 </div>
    </div>

    <slot></slot>

    <div class="m-2 text-center text-xs text-zinc-500">
      <div>
        <img src="@/assets/images/little-buddy.png" class="mx-auto mb-4" width="50" />
      </div>
      <div class="m-2 text-center text-3xl text-white font-splatoon2">
        {{ $t('footer.markerTitle') }}
      </div>
      <div class="m-2 text-center text-xl text-gray font-splatoon1">
        {{ $t('footer.maker') }}
      </div>
      <div>
        {{ $t('footer.term') }}
      </div>
      <div class="footer-links"> </div>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.footer-links a span {
  @apply text-zinc-300;
}
.footer-links a:hover span {
  @apply text-white underline;
}
</style>
