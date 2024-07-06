<!--
 * @Author: qqilin1213
 * @Date: 2024-06-29 22:20:55
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-02 14:11:51
-->
<template>
  <div class="relative flex items-center rounded-3xl bg-black p-1 text-2xl font-splatoon2 text-white mb-2">
    <div v-show="item.isReady === 1" class="absolute check right-5"></div>
    <div :class="`truncate ${firstDivClass}  text-right pr-2`">玩家{{ index + 1 }}</div>
    <div class="h-6 border-r border-dashed border-white mx-2"></div>
    <template v-if="item.playerId !== ''">
      <template v-if="item.playerId === playerStore.currentPlayerId">
        <div class="absolute current left-5 animate-pulse-alt w-10 h-10"></div>
        <div :class="`truncate ${secondDivClass} text-left pl-2 text-blue`"> {{ item.playerId }}</div>
      </template>
      <template v-else>
        <div :class="`truncate ${secondDivClass} text-left pl-2`">{{ item.playerId }}</div>
        <div v-if="roomStore.hasHost && roomStore.hostPlayerId === playerStore.currentPlayerId" class="absolute right-0">
          <el-button size="large" color="#E9FF3D" round  @click="handleChangeClick(item)">移交房主</el-button>
        </div>
      </template>
    </template>
    <template v-else>
      <div :class="`truncate ${secondDivClass} text-left pl-2 text-splatoon-yellow animate-pulse-alt`"> WAITING...</div>
    </template>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { usePlayerStore, useRoomStore } from '@/store';

const emit = defineEmits(['change']);
const roomStore = useRoomStore();
const playerStore = usePlayerStore();

const props = defineProps({
  item: Object,
  index: Number,
  firstDivClass: {
    type: String,
    default: 'w-1/3',
  },
});

const secondDivClass = computed(() => {
  // 如果 firstDivClass 为空，可以设置一个默认值，或者根据实际情况处理
  const widthMatch = props.firstDivClass ? props.firstDivClass.match(/\d+/) : null;
  const width = widthMatch ? parseInt(widthMatch[0]) : 2; // 设置一个默认值，比如 1
  return `w-${3 - width}/3`;
});

const handleChangeClick = (item) => {
  emit('change', item);
}

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
