<!--
 * @Author: qqilin1213
 * @Date: 2024-06-30 15:53:46
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-30 18:00:18
-->
<template>
  <div class="relative flex items-center rounded-3xl bg-black p-1 text-2xl font-splatoon2 text-white mb-2">
    <div class="absolute right-0">
      <el-button size="large" color="#E9FF3D" round @click="handleVoteClick(item)">投TA</el-button>
    </div>
    <div :class="` ${firstDivClass} text-right pr-2 truncate`"> {{ item.groupId }} {{ index > 0 ? index : '' }}</div>
    <div class="h-6 border-r border-dashed border-white mx-2"></div>
    <div v-if="item.roleName !== ''" class="absolute left-0 m-2 rounded-3xl">
      <div :class="`${roleColorClass(item.roleName)} text-black font-splatoon2 text-xl px-2 py-1 shadow rounded-3xl animate-pulse-alt`">
        {{ item.roleName }}
      </div>
    </div>
    <template v-if="item.playerId !== '' && item.playerId === playerStore.currentPlayerId">
      <div :class="`truncate ${secondDivClass} text-left pl-2 text-blue`">
        {{ item.playerId }}
      </div>
    </template>
    <template v-else-if="item.playerId !== '' && item.playerId !== playerStore.currentPlayerId">
      <div :class="`truncate ${secondDivClass} text-left pl-2`">
        {{ item.playerId }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import { useRoomStore, usePlayerStore } from '@/store';
import { RoomStatus } from '@/store/modules/room/types';
import { ref, computed, defineProps } from 'vue';
const roomStore = useRoomStore();
const playerStore = usePlayerStore();

const emit = defineEmits(['vote']);

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

const handleVoteClick = (item) => {
  emit('vote', item);
};

// 根据 roleName 返回对应的颜色类
function roleColorClass(roleName) {
  switch (roleName) {
    case '好鱿':
      return 'bg-green-3';
    case '坏鱿':
      return 'bg-red-3';
    case '呆呆鱿':
      return 'bg-yellow-3';
    default:
      return 'bg-opacity-100'; // Default color for unknown roles
  }
}


</script>

<style scoped>
</style>
