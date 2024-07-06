<!--
 * @Author: qqilin1213
 * @Date: 2024-06-27 12:58:02
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-27 19:19:01
-->
<template>
  <ModalDialog inner-class="-rotate-1 reactive">
    <div class="bg-zinc-100 p-2">
      <button class="text-zinc-300 bg-zinc-600/50 rounded-full p-1 absolute top-3 right-3" @click="$emit('close')">
        <span class="sr-only">Close</span>
        <el-icon :size="20" color="#ffffff"><Close /></el-icon>
      </button>
      <img v-if="imgUrl != ''" :src="imgUrl" />
    </div>

    <div class="absolute -top-8 w-full text-center">
      <img class="w-56 -rotate-1 inline-block" src="@/assets/images/tape/tape-1.png" />
    </div>

    <div class="absolute -bottom-6 w-full text-center rotate-2">
      <img class="w-80 inline-block" src="@/assets/images/stickers/sticker-12.png" />
      <div class="absolute inset-0 flex items-center justify-center text-black font-splatoon2"> 结果 </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { computed } from 'vue';
import ModalDialog from './ModalDialog.vue';
import { Close } from '@element-plus/icons-vue';

const imgUrl = ref('');

const setImage = (data) => {
  imgUrl.value = data;
};

defineExpose({
  setImage,
});

defineEmits(['close']);
</script>
