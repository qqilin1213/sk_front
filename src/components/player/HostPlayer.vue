<!--
 * @Author: qqilin1213
 * @Date: 2024-06-29 22:15:57
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-02 14:14:43
-->
<template>
  <div class="relative flex items-center justify-around rounded-3xl bg-black p-1 text-2xl font-splatoon2 text-white">
    <div v-show="roomStore.isHostReady" class="absolute check right-5"></div>
    <div :class="`truncate ${firstDivClass} text-right pr-2`">主持人</div>
    <div class="h-6 border-r border-dashed border-white mx-2"></div>
    <template v-if="playerStore.currentPlayerId === roomStore.hostPlayerId">
      <div class="absolute current left-5 animate-pulse-alt w-10 h-10"></div>
      <div :class="`truncate ${secondDivClass} text-left pl-2 text-blue`">
        {{ roomStore.hostPlayerId }}
      </div>
    </template>
    <template v-else>
      <div :class="`truncate ${secondDivClass} text-left pl-2`">
        {{ roomStore.hostPlayerId }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoomStore, usePlayerStore } from '@/store';
import { computed } from 'vue';

const roomStore = useRoomStore();
const playerStore = usePlayerStore();

const props = defineProps({
  firstDivClass: {
    type: String,
    default: 'w-1/2',
  },
});

const secondDivClass = computed(() => {
  // 如果 firstDivClass 为空，可以设置一个默认值，或者根据实际情况处理
  const widthMatch = props.firstDivClass ? props.firstDivClass.match(/\d+/) : null;
  const width = widthMatch ? parseInt(widthMatch[0]) : 6; // 设置一个默认值，比如 1
  return `w-${12 - width}/12`;
});
</script>

<style scoped>
.check {
  mask-image: url('@/assets/images/room/check.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
  width: 32px;
  height: 32px;
  z-index: auto;
  background-color: #6af6cd;
}

.current {
  background-image: url('@/assets/images/room/current.png');
  background-size: contain;
  background-position: top, center;
  background-repeat: no-repeat;
}
</style>
