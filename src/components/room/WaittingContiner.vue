<!--
 * @Author: qqilin1213
 * @Date: 2024-06-29 23:37:03
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-02 14:33:31
-->
<template>
  <div class="relative h-full overflow-hidden w-full px-2">
    <!-- 房间 信息-->
    <!-- 主持人 -->
    <div v-if="roomStore.hasHost">
      <HostPlayer :firstDivClass="flex1_2Width" />
      <el-divider></el-divider>
    </div>
    <!-- 玩家 信息 -->
    <template v-for="(item, index) in roomInfo.participants" :key="index">
      <Player :index="index" :item="item" :firstDivClass="flex1_3width" @change="changeHost"></Player>
    </template>

    <div class="flex justify-center items-center mt-5 space-x-4">
      <div
        v-if="
          (roomStore.hasHost && roomStore.hostPlayerId === playerStore.currentPlayerId) ||
          (!roomStore.hasHost && (playerStore.currentPlayerId === roomStore.creatorPlayerId) === true)
        "
      >
        <el-button size="large" color="#3E454F" round @click="onCloseGame()">结束比赛</el-button>
      </div>
      <div v-else>
        <el-button size="large" color="#3E454F" round @click="onLeaveRoom()">离开房间</el-button>
      </div>
      <div v-if="playerStore.isReady === true">
        <el-button size="large" color="#E9FF3D" round @click="onReady(false)">取消准备</el-button>
      </div>
      <div v-else>
        <el-button size="large" color="#E9FF3D" round @click="onReady(true)">准备</el-button>
      </div>
      <div
        v-if="
          (playerStore.currentPlayerId === roomStore.hostPlayerId && roomStore.isHostReady && roomInfo.currentNum === roomStore.roomNum) ||
          (!roomStore.hasHost && playerStore.currentPlayerId === roomStore.creatorPlayerId && roomInfo.currentNum === roomStore.roomNum)
        "
      >
        <el-button size="large" color="#E9FF3D" round @click="onAssignRole()">分配角色</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
import { useRoomStore, usePlayerStore } from '@/store';
import router from '@/router';

const roomStore = useRoomStore();
const playerStore = usePlayerStore();

const flex1_2Width = ref('w-6/12');
const flex1_3width = ref('w-1/3');
// const roomInfo = ref({});

const props = defineProps({
  roomInfo: Object,
});

const onLeaveRoom = async () => {
  await playerStore.onLeaveRoom().then(() => {
    goToLink('/');
  });
};

const onReady = (flag) => {
  playerStore.onReady(flag);
};

const onAssignRole = () => {
  roomStore.onAssignRole();
};

const setRoomInfo = (data) => {
  roomInfo.value = data;
};

const onCloseGame = () => {
  roomStore.onCloseGame();
};

const changeHost = (item) => {
  roomStore.onChangeHost(item.playerId);
};
</script>