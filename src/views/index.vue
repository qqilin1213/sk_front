<!--
 * @Author: qqilin1213
 * @Date: 2024-06-17 16:26:06
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-02 18:06:44
-->
<template>
  <MainLayout>
    <div class="grow flex items-center justify-center">
      <div class="flex flex-wrap items-center justify-center py-6 sm:px-20 lg:px-36 xl:px-20">
        <div class="text-center pt-2">
          <button
            class="bg-zinc-300 bg-opacity-50 hover:bg-opacity-70 px-2 py-1 rounded-full font-splatoon1 text-zinc-200 text-3xl"
            @click="goToLink('create')"
          >
            <span class="inline-block rotate-[25deg] text-yellow-3">&#57445;</span>
            {{ $t('startPage.create') }}
          </button>
        </div>
        <div class="text-center pt-2 pl-4">
          <button
            class="bg-zinc-300 bg-opacity-50 hover:bg-opacity-70 px-2 py-1 rounded-full font-splatoon1 text-zinc-200 text-3xl"
            @click="goToLink('join')"
          >
            <span class="inline-block rotate-[25deg] text-yellow-3">&#57445;</span>
            {{ $t('startPage.join') }}
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import router from '@/router';

// import { useAppStore } from '@/store/modules/app';
// import { framework } from './data';

// const appStore = useAppStore();
// const data = ref(framework);

const goToLink = (url: string) => {
  router.push(url);
};
</script>

<style lang="less" scoped></style>
