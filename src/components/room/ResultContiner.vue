<!--
 * @Author: qqilin1213
 * @Date: 2024-06-29 11:10:36
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-01 23:18:24
-->
<template>
  <div class="relative h-full overflow-hidden w-full">
    <div class="overflow-y-auto h-full pb-8 flex flex-col items-center">
      <div class="flex w-full justify-around">
        <el-button size="large" color="#E9FF3D" round @click="onRestartGame()">再来一局</el-button>
        <template
          v-if="roomStore.hostPlayerId === playerStore.currentPlayerId || roomStore.creatorPlayerId === playerStore.currentPlayerId"
        >
          <el-button size="large" color="#E9FF3D" round @click="onCloseGame()">结束比赛</el-button>
        </template>
        <template v-else>
          <el-button size="large" color="#E9FF3D" round @click="onLeftRoom()">退出房间</el-button>
        </template>
      </div>

      <!-- 游戏结果-->
      <el-divider>
        <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-white whitespace-nowrap mt-5 mb-4">游戏结果</div>
      </el-divider>

      <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-green whitespace-nowrap mt-4 mb-4">{{ roomStore.resultMsg }}</div>
      <!-- 角色信息-->
      <el-divider>
        <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-white whitespace-nowrap mt-5 mb-4">角色信息</div>
      </el-divider>

      <div v-for="(role, index) in specialRoles" :key="index" :class="roleClass(role?.roleName)">
        {{ role.roleName }}：{{ role.playerId }}
      </div>
      <!-- 任务信息-->
      <el-divider>
        <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-white whitespace-nowrap mt-5 mb-5">任务信息</div>
      </el-divider>
      <div
        class="font-splatoon2 text-3xl ss:text-lg text-shadow text-green whitespace-nowrap mt-4 mb-4"
        v-if="playerStore.isComplete === true"
      >
        坏鱿任务完成
      </div>
      <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-red whitespace-nowrap mt-4 mb-4" v-else> 坏鱿任务失败 </div>
      <div class="flex flex-col items-center mt-4">
        <div :class="[getIconPath(taskStore.currentTask), 'h-16 w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 m-auto ']"></div>
        <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-white whitespace-nowrap mb-3">
          {{ taskStore.currentTask.title }}
        </div>
        <div class="w-full flex flex-row justify-center items-center">
          <template v-for="n in taskStore.currentTask.level" :key="n">
            <Star class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
          </template>
        </div>
        <div class="p-4 mt-2 font-splatoon2 text-2xl ss:text-lg text-shadow text-yellow whitespace-normal">
          {{ taskStore.currentTask.subTitle }}
        </div>
        <div class="font-splatoon1 text-2xl text-gray-5"> {{ taskStore.currentTask.createName }} </div>
      </div>
      <!-- 投票结果 -->
      <el-divider>
        <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-white whitespace-nowrap mt-5 mb-4">投票结果</div>
      </el-divider>
      <div class="w-full">
        <div v-for="(item, index) in roomStore.voteResult" :key="index">
          <div class="flex justify-between items-center">
            <div class="font-splatoon2 text-xl ss:text-lg text-shadow text-yellow whitespace-nowrap p-2 px-4 w-3/12 justify-start">
              {{ item.playerId }}:
            </div>
            <div class="flex flex-wrap gap-2 w-9/12">
              <div
                v-for="(voter, voterIndex) in item.votes"
                :key="voterIndex"
                :class="{
                  'flex items-center font-splatoon2 text-xl ss:text-lg text-shadow bg-black text-white rounded-full p-2 px-4 mb-2':
                    item.votes,
                  'bg-transparent': !item.votes,
                }"
              >
                {{ voter.id }} ( {{ voter.score }})
              </div>
            </div>
          </div>
          <!-- Conditional divider -->
          <template v-if="index !== roomStore.voteResult.length - 1">
            <el-divider border-style="dashed"> </el-divider>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Star from '@/components/splats/Star.vue';
import { useTaskStore, useRoomStore, usePlayerStore } from '@/store';
import { RoomStatus } from '@/store/modules/room/types';

const roomStore = useRoomStore();
const taskStore = useTaskStore();
const playerStore = usePlayerStore();

const specialRoles = computed(() => roomStore.participants.filter((item) => item.roleName != '好鱿' && item.roleName != ''));

const roleClass = (type) => {
  if (type === '呆呆鱿') {
    return 'font-splatoon2 text-3xl ss:text-lg text-shadow text-yellow whitespace-nowrap mt-4 mb-4';
  } else if (type === '坏鱿') {
    return 'font-splatoon2 text-3xl ss:text-lg text-shadow text-red whitespace-nowrap mt-4 mb-4';
  }
};

const getIconPath = (currentTask) => {
  if (currentTask?.type === 'ALL') {
    return 'all_icon';
  } else if (currentTask?.type === 'ANARCHY') {
    switch (currentTask?.subType) {
      case 'AREA':
        return 'area_icon';
      case 'YUHU':
        return 'YUHU_icon';
      case 'GELI':
        return 'GELI_icon';
      case 'TA':
        return 'TA_icon';
      default:
        return '';
    }
  }
  return '';
};

const onRestartGame = () => {
  roomStore.onRestartGame();
};

const onCloseGame = () => {
  roomStore.onCloseGame();
};

const onLeftRoom = () => {
  playerStore.onLeaveGame();
};
</script>

<style scoped>
.all_icon {
  background-image: url('@/assets/images/rules/regular.svg');
  background-size: cover;
}

.area_icon {
  background-image: url('@/assets/images/rules/area.svg');
  background-size: cover;
}
.YUHU_icon {
  background-image: url('@/assets/images/rules/hoko.svg');
  background-size: cover;
}
.GELI_icon {
  background-image: url('@/assets/images/rules/asari.svg');
  background-size: cover;
}
.TA_icon {
  background-image: url('@/assets/images/rules/yagura.svg');
  background-size: cover;
}

:deep(.el-divider__text) {
  background-color: #ffffff00 !important;
}
</style>
