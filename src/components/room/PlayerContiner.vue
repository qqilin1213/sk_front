<!--
 * @Author: qqilin1213
 * @Date: 2024-06-29 23:21:37
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-02 17:43:09
-->
<template>
  <div class="flex flex-col justify-center items-center space-x-4 z-20  w-full px-2">
    <el-button size="large" color="#E9FF3D" round @click="openManual = true">角色手册</el-button>
    <el-divider border-style="dashed"></el-divider>
  </div>

  <div class="relative h-full overflow-hidden w-full px-2">
    <!-- 比赛场 信息-->
    <template v-for="(player, idx) in teamA" :key="idx">
      <TeamPlayer :item="player" :index="idx + 1" :firstDivClass="flexWidth" @open="$emit('open')" />
    </template>
    <el-divider border-style="dashed"></el-divider>
    <template v-for="(player, idx) in teamB" :key="idx">
      <TeamPlayer :item="player" :index="idx + 1" :firstDivClass="flexWidth" @open="$emit('open')" />
    </template>
  </div>

  <!-- 按钮 -->
  <div class="flex justify-center items-center mt-5 space-x-4">
    <template
      v-if="roomStore.hasHost && roomStore.status === RoomStatus.AssigningRoles && playerStore.currentPlayerId === roomStore.hostPlayerId"
    >
      <el-button size="large" color="#E9FF3D" round @click="onReselectRole()">角色重抽</el-button>
      <el-button size="large" color="#E9FF3D" round @click="onRandomTask()">随机任务</el-button>
      <el-button size="large" color="#E9FF3D" round @click="onChooseTask()">指定任务</el-button>
    </template>

    <template
      v-else-if="
        roomStore.status === RoomStatus.AssigningRoles && !roomStore.hasHost && playerStore.currentPlayerId === roomStore.creatorPlayerId
      "
    >
      <el-button size="large" color="#E9FF3D" round @click="onRandomTask()">随机任务</el-button>
    </template>

    <!-- 选择任务-->
    <template
      v-else-if="
        roomStore.hasHost && playerStore.currentPlayerId === roomStore.hostPlayerId && roomStore.status === RoomStatus.AssigningTasks
      "
    >
      <el-button size="large" color="#E9FF3D" round @click="onReselectTask()">重新选择任务</el-button>
      <el-button size="large" color="#E9FF3D" round @click="onStartGame()">开始比赛</el-button>
    </template>

    <template
      v-else-if="
        !roomStore.hasHost && playerStore.currentPlayerId === roomStore.creatorPlayerId && roomStore.status === RoomStatus.AssigningTasks
      "
    >
      <el-button size="large" color="#E9FF3D" round @click="onStartGame()">开始比赛</el-button>
    </template>

    <!-- 比赛中 -->
    <template
      v-else-if="
        (playerStore.currentPlayerId === roomStore.hostPlayerId && roomStore.status === RoomStatus.StartGame) ||
        (!roomStore.hasHost && playerStore.currentPlayerId === roomStore.creatorPlayerId)
      "
    >
      <el-button size="large" color="#E9FF3D" round @click="onStartDis()">进入讨论</el-button>
    </template>
  </div>

  <ManualDialog :show="openManual" @close="openManual = false"></ManualDialog>
</template>

<script setup>
import { useRoomStore, usePlayerStore, useTaskStore } from '@/store';
import { RoomStatus } from '@/store/modules/room/types';
import router from '@/router';

const roomStore = useRoomStore();
const playerStore = usePlayerStore();
const taskStore = useTaskStore();

const openManual = ref(false);

// 假设 baseUrl 是你希望拼接的基础 URL
const baseUrl = import.meta.env.VITE_APP_API_BASEURL;
const uploadPath = 'upload/file';
const roomData = ref({
  roomId: roomStore.roomId,
});
// 动态计算 action 的完整 URL
const uploadAction = computed(() => `${baseUrl}${uploadPath}`);

// 团队信息
const currentPlayer = computed(() => {
  let players = roomStore.participants.filter((player) => player.playerId === playerStore.currentPlayerId);
  if (players.length > 0) {
    return players[0];
  } else {
    return null;
  }
});
const teamA = computed(() => roomStore.participants.filter((player) => player.groupId === 'A'));
const teamB = computed(() => roomStore.participants.filter((player) => player.groupId === 'B'));

// 布局
const flexWidth = ref('w-1/3');

// 上传文件校验
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg') {
    ElMessage.error('上传图片需是JPG/PNG/JPEG 格式!');
    return false;
  }
};

// 进行投票
const onStartVote = () => {
  roomStore.onChangeRoomStatus(RoomStatus.Voting);
};

const openTaskContiner = () => {
  $emit('openTask');
};

const goToLink = (url) => {
  router.push(url);
};

const onRandomTask = () => {
  goToLink('/taskConfig');
};

const onChooseTask = () => {
  roomStore.chooseTask = true;
  goToLink('/task');
};

const onReselectTask = () => {
  taskStore.onReselectTask();
};

const onReselectRole = () => {
  roomStore.onAssignRole();
};

const onStartGame = () => {
  roomStore.onChangeRoomStatus(RoomStatus.StartGame);
};

const onStartDis = () => {
  roomStore.onChangeRoomStatus(RoomStatus.Discussing);
};

defineEmits(['open', 'openManual']);
</script>