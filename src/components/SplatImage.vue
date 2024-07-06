<!--
 * @Author: qqilin1213
 * @Date: 2024-06-27 12:56:47
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-27 19:17:39
-->
<template>
  <button class="block relative" @click="openImage()">
    <div class="bg-zinc-700 aspect-[2/1] overflow-hidden" :class="imgClass">
      <img v-if="lowRes" :src="lowRes" />
      <div v-else class="bg-zinc-500 animate-pulse h-full" :class="imgClass"> &nbsp; </div>
    </div>

    <div
      v-if="!hideLabel && imageData"
      class="absolute bg-zinc-900 rounded bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 overflow-ellipsis overflow-hidden max-w-[85%] text-white whitespace-nowrap font-splatoon2 px-2"
      :class="textSize"
    >
      结果
    </div>

    <ImageDialog ref="imageDialogRef" :show="open" @close="open = false" />
  </button>
</template>

<script setup>
import { computed, ref } from 'vue';
import ImageDialog from './ImageDialog.vue';
import { useRoomStore } from '@/store';

const roomStore = useRoomStore();
const imageDialogRef = ref();

const props = defineProps({
  imgClass: String,
  textSize: {
    type: String,
    default: 'text-xs lg:text-sm',
  },
  hideLabel: Boolean,
});

const open = ref(false);

const lowRes = computed(() => roomStore.resultImgData);

const openImage = () => {
  open.value = true;
  imageDialogRef.value.setImage(roomStore.resultImgData);
};
</script>
