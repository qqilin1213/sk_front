<!--
 * @Author: qqilin1213
 * @Date: 2024-06-26 18:34:09
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-04 00:40:48
-->
<template>
  <ModalDialog inner-class="md:-rotate-1 w-[75%] h-[95%] flex justify-center items-center" no-scroll>
    <div :class="[getBgColor(currentPlayer), 'w-full max-w-2xl isolate rounded-2xl overflow-hidden bg-tapes h-[85%] flex flex-col']">
      <div class="relative h-full w-full flex flex-col">
        <!-- 标题区域 -->
        <div class="bg-zinc-800/40 backdrop-blur-md z-30 pt-10 pb-4" v-if="playerStore.currentPlayerId != roomStore.hostPlayerId">
          <div class="flex items-center space-x-2 mx-2 justify-between">
            <div :class="[getTextColor(currentPlayer), 'font-splatoon2 text-3xl lg:text-2xl xl:text-3xl']">
              {{ currentPlayer != null ? currentPlayer.roleName : '主持人' }}手册
            </div>
          </div>
        </div>

        <!-- 关闭按钮 -->
        <button class="text-zinc-300 bg-zinc-800/50 rounded-full p-1 absolute top-3 right-3 z-40" @click="$emit('close')">
          <span class="sr-only">Close</span>
          <el-icon :size="20" color="#ffffff"><Close /></el-icon>
        </button>

        <!-- 图片区域 -->
        <div class="flex-1 overflow-auto mt-2 mb-2 px-2">
          <div class="flex justify-center items-center h-full">
            <img :src="getImageSrc(currentPlayer)" class="max-w-full max-h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import goodSquid from '@/assets/images/manual/goodSquid.jpg';
import neutralSquid from '@/assets/images/manual/neutralSquid.jpg';
import badSquid from '@/assets/images/manual/badSquid.jpg';

import { Close } from '@element-plus/icons-vue';
import Star from '@/components/splats/Star.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import { usePlayerStore, useRoomStore, useTaskStore } from '@/store';
defineEmits(['close']);

const playerStore = usePlayerStore();
const taskStore = useTaskStore();
const roomStore = useRoomStore();

const currentPlayer = computed(() => {
  let players = roomStore.participants.filter((item) => item.playerId === playerStore.currentPlayerId);
  if (players.length > 0) {
    return players[0];
  } else {
    return null;
  }
});

const getBgColor = (player) => {
  if (player != null) {
    switch (player.roleName) {
      case '好鱿':
        return 'bg-splatoon-yellow';
      case '呆呆鱿':
        return 'bg-splatoon-orange';
      case '坏鱿':
        return 'bg-splatoon-red';
      default:
        return 'bg-splatoon-purple';
    }
  } else {
    return 'bg-splatoon-purple';
  }
};

const getTextColor = (player) => {
  if (player != null) {
    switch (player?.roleName) {
      case '好鱿':
        return 'text-splatoon-yellow';
      case '呆呆鱿':
        return 'text-splatoon-orange';
      case '坏鱿':
        return 'text-splatoon-red';
      default:
        return 'text-splatoon-purple';
    }
  } else {
    return 'text-splatoon-purple';
  }
};

const getImageSrc = (player) => {
  if (player != null) {
    switch (player?.roleName) {
      case '好鱿':
        return goodSquid;
      case '呆呆鱿':
        return neutralSquid;
      case '坏鱿':
        return badSquid;
      default:
        return host;
    }
  } else {
    return 'text-splatoon-purple';
  }
};
</script>

<style scoped>
.bg-tapes {
  background-image: url('@/assets/images/tapes-transparent.png'),
    linear-gradient(180deg, rgba(2, 0, 36, 0.1) 0%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.25) 100%);
  background-size: cover;
  background-repeat: repeat;
}
</style>
