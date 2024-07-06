<!--
 * @Author: qqilin1213
 * @Date: 2024-06-29 21:54:12
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 19:37:40
-->
<template>
  <div class="relative h-full overflow-hidden w-full">
    <div class="relative h-full overflow-hidden w-full px-2">
      <template v-if="playerStore.currentPlayerId !== roomStore.hostPlayerId">
        <el-upload
          v-show="roomStore.resultImgData === ''"
          class="flex flex-col justify-center items-center"
          :action="uploadAction"
          :data="roomData"
          :show-file-list="false"
          :before-upload="beforeImgUpload"
        >
          <el-button size="large" color="#E9FF3D" round>上传战绩</el-button>
          <template #tip>
            <div class="text-white text-2xl font-splatoon2 p-5"> (请赢方的第一名上传此局战绩图片) </div>
          </template>
        </el-upload>
      </template>
      <template v-else-if="playerStore.currentPlayerId === roomStore.hostPlayerId && roomStore.resultImgData === ''">
        <div class="flex flex-col justify-center items-center">
          <div class="text-white text-2xl font-splatoon2 p-5"> 等待玩家上传此局战绩图片... </div>
        </div>
      </template>
      <!-- 比赛场 信息-->
      <!-- 角色手册-->
      <!-- 任务信息 -->
      <div>
        <div class="flex flex-col items-center -space-y-2">
          <SquidTape
            class="font-splatoon2 text-2xl text-black rounded-sm -rotate-2 z-10"
            bg="bg-splatoon-green"
            squid-bg="bg-black"
            border="border border-black"
          >
            <div class="px-1"> {{ taskStore.currentTask.typeInfo }} </div>
            <template v-if="!roomStore.hasHost && taskStore.currentTask.typeInfo && taskStore.currentTask.typeInfo.indexOf('真格') != -1">
              <div class="px-1"> ({{ taskStore.currentTask.subTypeInfo }})</div>
            </template>
          </SquidTape>
        </div>
        <el-divider border-style="dashed"></el-divider>
      </div>
      <!-- 任务是否完成 -->
      <div class="flex flex-col justify-around items-center">
        <div
          class="font-splatoon2 text-3xl ss:text-lg text-shadow text-green whitespace-nowrap mb-4"
          v-if="playerStore.isComplete === true"
        >
          坏鱿任务完成
        </div>
        <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-red whitespace-nowrap mb-4" v-else> 坏鱿任务失败 </div>
      </div>

      <!-- 主持人 -->
      <template v-if="playerStore.currentPlayerId === roomStore.hostPlayerId">
        <template v-for="(player, idx) in teamA" :key="idx">
          <TeamPlayer :item="player" :index="idx + 1" :firstDivClass="flexWidth" @open="$emit('open')" />
        </template>
        <el-divider></el-divider>
        <template v-for="(player, idx) in teamB" :key="idx">
          <TeamPlayer :item="player" :index="idx + 1" :firstDivClass="flexWidth" @open="$emit('open')" />
        </template>
      </template>
      <!-- 普通玩家 -->
      <template v-else>
        <TeamPlayer :item="currentPlayer" :firstDivClass="flexWidth" @open="$emit('open')" />
      </template>

      <div class="mt-2 text-center font-splatoon2 text-xl text-white m-3" v-if="roomStore.resultImgData !== ''"> (战败组开始，依次从下向上发言) </div>
      <SplatImage img-class="rounded-l-xl" />
    </div>

    <div v-if="roomStore.resultImgData != null" class="flex flex-col justify-around items-center mt-5">
      <template
        v-if="
          (roomStore.hasHost && playerStore.currentPlayerId === roomStore.hostPlayerId && roomStore.resultImgData != '') ||
          (!roomStore.hasHost && playerStore.currentPlayerId === roomStore.creatorPlayerId && roomStore.resultImgData != '')
        "
      >
        <Countdown ref="countdownRef" :duration="60" fontSize="text-4xl" color="text-white"></Countdown>

        <div class="mt-5 flex justify-between items-center">
          <el-button size="large" color="#E9FF3D" round @click="onEndSpeck()">结束发言</el-button>
          <el-button size="large" color="#E9FF3D" round @click="onPauseSpeck()">暂停发言</el-button>
          <el-button size="large" color="#E9FF3D" round @click="onStartSpeck()">开始发言</el-button>
        </div>
      </template>
    </div>

    <template
      v-if="(roomStore.hasHost && roomStore.hostPlayerId === playerStore.currentPlayerId) || (!roomStore.hasHost && isBadSquid > 0)"
    >
      <el-divider border-style="dashed" />
      <div class="flex flex-col justify-around items-center mt-5">
        <div class="flex flex-row mb-3">
          <div class="font-splatoon2 text-2xl text-white w-100% mr-4">坏鱿任务是否完成？</div>
          <el-switch
            v-model="playerStore.isComplete"
            @change="handleSwitchChange"
            size="large"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            style="--el-switch-on-color: #e9ff3d"
          />
        </div>
      </div>
    </template>

    <template
      v-if="
        (roomStore.hasHost && roomStore.hostPlayerId === playerStore.currentPlayerId && roomStore.status === RoomStatus.Discussed) ||
        (!roomStore.hasHost && roomStore.creatorPlayerId === playerStore.currentPlayerId && roomStore.status === RoomStatus.Discussed)
      "
    >
      <div class="flex flex-col justify-around items-center mt-5">
        <el-divider border-style="dashed" />
        <el-button size="large" color="#E9FF3D" round @click="onStartVote()">进入投票</el-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoomStore, usePlayerStore, useTaskStore } from '@/store';
import { CopyDocument, Check, Close } from '@element-plus/icons-vue';
import { RoomStatus } from '@/store/modules/room/types';

// 初始状态 等待图片上传
const speckValue = ref('');
const roomStore = useRoomStore();
const playerStore = usePlayerStore();
const taskStore = useTaskStore();

// 假设 baseUrl 是你希望拼接的基础 URL
const baseUrl = import.meta.env.VITE_APP_API_BASEURL;
const uploadPath = 'upload/file';
const roomData = ref({
  roomId: roomStore.roomId,
});
// 动态计算 action 的完整 URL
const uploadAction = computed(() => `${baseUrl}${uploadPath}`);
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
const isBadSquid = computed(() => roomStore.participants.filter((player) => player.roleName === '坏鱿').length);

// 布局
const flexWidth = ref('w-1/3');
// 计时组件
const countdownRef = ref();
// 结束次数
const endTimes = ref(0);

// 上传文件校验
const beforeImgUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg') {
    ElMessage.error('上传图片需是JPG/PNG/JPEG 格式!');
    return false;
  }
};

// 玩家发言
const onStartSpeck = () => {
  countdownRef.value.start();
};

const onEndSpeck = () => {
  endTimes.value = endTimes.value + 1;
  countdownRef.value.reset();
  if (endTimes.value >= roomStore.roomNum) {
    roomStore.onChangeRoomStatus(RoomStatus.Discussed);
  }
};

const onPauseSpeck = () => {
  countdownRef.value.pause();
};

// 进行投票
const onStartVote = () => {
  roomStore.onChangeRoomStatus(RoomStatus.Voting);
};

const handleSwitchChange = (value) => {
  playerStore.setComplete(value);
};

defineEmits(['open']);
</script>
<style scoped>
:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 0px !important;
}
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 0px !important;
}
:deep(.el-select) {
  --el-select-border-color-hover: #ffffff00;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #5937ec !important;
}

:deep(.el-select .el-input__inner) {
  color: white;
  font-family: var(--font-family-s1) !important;
}

:deep(.el-select) ::placeholder {
  color: #000000 !important; /* 修改文字颜色 */
}

:deep(.el-select__tags .el-tag--info) {
  color: #000000;
  font-family: var(--font-family-s2) !important;
  background-color: rgb(96 59 255 / 70%);
}
</style>