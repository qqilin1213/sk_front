<!--
 * @Author: qqilin1213
 * @Date: 2024-06-17 20:05:19
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 19:37:36
-->
<template>
  <MainLayout>
    <div class="grow flex items-center justify-center select-none">
      <div class="w-full max-w-2xl mt-20 mb-20 mx-4">
        <ProductContainer class="pt-10 pb-4" bg="bg-splatoon-blue bg-circles">
          <div class="absolute mt--25 ml--15 bg-judd h-60 w-60" />
          <div class="absolute right-3 top-5">
            <el-button size="middle" color="#3E454F" round @click="goToLink('/task')">查看全部任务</el-button>
          </div>
          <div class="absolute right-3 top-21">
            <div class="text-xl text-yellow-3 font-splatoon2 animate-pulse-alt">{{ roomStatus }}</div>
          </div>
          <div class="space-y-4">
            <div>
              <div class="flex flex-col items-center -space-y-2">
                <SquidTape
                  class="font-splatoon2 text-sm text-black rounded-sm -rotate-2 z-10"
                  bg="bg-splatoon-green"
                  squid-bg="bg-black"
                  border="border border-black"
                >
                  <div class="px-1"> ROOM </div>
                </SquidTape>

                <div class="relative -rotate-2">
                  <img src="@/assets/images/gesotown-daily-drop-bg.png" class="w-64" />
                  <div class="absolute inset-0 flex items-center justify-between ml-4 mr-4">
                    <div class="font-splatoon2 text-lg text-white"> {{ roomInfo.roomId ? roomInfo.roomId : 'ROOM ID' }} </div>
                    <el-button
                      text
                      round
                      class="text-white mt--4 font-splatoon2 roomId"
                      :data-clipboard-text="roomInfo.roomId"
                      @click="copyText()"
                      >复制</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 等待玩家 -->
            <template v-if="roomStore.status === RoomStatus.Waiting">
              <WaittingContiner :roomInfo="roomInfo"></WaittingContiner>
            </template>

            <!-- 开始游戏 -->
            <!-- 角色分配 -->
            <template v-else>
              <div class="px-2">
                <div v-show="roomInfo.hasHost">
                  <HostPlayer :firstDivClass="flex1_2Width" />
                  <el-divider></el-divider>
                </div>
                <!-- 游戏阶段-->
                <div v-show="roomStore.status === RoomStatus.StartGame">
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
                  <el-divider></el-divider>
                </div>
                <div
                  v-if="
                    roomStore.status === RoomStatus.AssigningRoles ||
                    roomStore.status === RoomStatus.AssigningTasks ||
                    roomStore.status === RoomStatus.StartGame
                  "
                >
                  <PlayerContiner @open="open = true"></PlayerContiner>
                </div>
                <!-- 讨论阶段 -->
                <div
                  v-else-if="roomStore.status === RoomStatus.Discussing || roomStore.status === RoomStatus.Discussed"
                  class="flex flex-col"
                >
                  <DiscussingContiner @open="open = true"></DiscussingContiner>
                </div>
                <!-- 投票阶段 -->
                <div v-else-if="roomStore.status === RoomStatus.Voting">
                  <VoteContiner :roomInfo="roomInfo"></VoteContiner>
                </div>
                <!-- 游戏结果 -->
                <div v-else-if="roomStore.status === RoomStatus.Finished">
                  <ResultContiner></ResultContiner>
                </div>
              </div>
            </template>
          </div>

          <div class="absolute z-20 mt--3 ml-140 bg-lijudd h-50 w-50" />

          <TaskDialog :show="open" @close="open = false" />
        </ProductContainer>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { useRoute } from 'vue-router';
import app from '@/main';
import router from '@/router';
import { ref, watch } from 'vue';
import { CopyDocument } from '@element-plus/icons-vue';
import Clipboard from 'clipboard';
import { ElMessage, ElMessageBox } from 'element-plus';
import { RoomStatus } from '@/store/modules/room/types';
import MainLayout from '@/layouts/MainLayout.vue';
import SplatImage from '@/components/SplatImage.vue';
import VoteContiner from '@/components/room/VoteContiner.vue';
import DiscussingContiner from '@/components/room/DiscussingContiner.vue';
import ResultContiner from '@/components/room/ResultContiner.vue';
import ProductContainer from '@/components/ProductContainer.vue';
import PlayerContiner from '@/components/room/PlayerContiner.vue';
import WaittingContiner from '@/components/room/WaittingContiner.vue';
import { useRoomStore, usePlayerStore, useTaskStore, useSocketStore } from '@/store';
import { getTaskList } from '@/api/task';

const route = useRoute();
const flex1_2Width = ref('w-6/12');

const open = ref(false);

const roomInfo = reactive({
  currentPlayerId: '',
  roomId: '-',
  hasHost: false,
  hostPlayerId: '',
  participants: [],
  roomNum: 0,
  isHostReady: false,
  currentNum: 0,
});
const roomStore = useRoomStore();
const playerStore = usePlayerStore();
const taskStore = useTaskStore();
const socketStore = useSocketStore();
// 房间状态
const roomStatus = computed(() => {
  if (roomStore.status === RoomStatus.Waiting) {
    return '等待中...';
  } else if (roomStore.status === RoomStatus.AssigningRoles) {
    return '分配角色中...';
  } else if (roomStore.status === RoomStatus.AssigningTasks) {
    return '分配任务中...';
  } else if (roomStore.status === RoomStatus.StartGame) {
    return '比赛中...';
  } else if (roomStore.status === RoomStatus.Discussing) {
    return '发言中...';
  } else if (roomStore.status === RoomStatus.Discussed) {
    return '发言结束';
  } else if (roomStore.status === RoomStatus.Voting) {
    return '投票中...';
  } else if (roomStore.status === RoomStatus.Finished) {
    return '比赛结束';
  }
  return '';
});

onMounted(() => {
  // 检查 WebSocket 是否已连接，如果未连接则重新连接
  const roomId = route.params.roomId;
  const playerId = route.params.playerId;
  console.log('roomId:' + roomId);
  console.log('playerId:' + playerId);
  if (!socketStore.isConnected) {
    ElMessage.info('连接中断了');
    let url = localStorage.getItem('websocket_url');
    if (url == null) {
      url = `${import.meta.env.VITE_WEBSOCKET_URL}?playerId=${playerId}&roomId=${roomId}&reconnect=true`;
      localStorage.setItem('websocket_url', url);
    }
    socketStore
      .connectWebSocket(url)
      .then(() => {
        ElMessage.success('重新连接成功');
      })
      .catch((error) => {
        ElMessage.error('重新连接失败:', error);
      });
  }

  roomInfo.currentPlayerId = playerStore.currentPlayerId;
  roomInfo.roomId = roomStore.roomId;
  roomInfo.hasHost = roomStore.hasHost;
  roomInfo.hostPlayerId = roomStore.hostPlayerId;
  roomInfo.roomNum = roomStore.roomNum;
  roomInfo.hostIsReady = 0;
  initializeParticipants();
});

// 初始化 roomInfo.participants 数组
const initializeParticipants = () => {
  roomInfo.participants = Array.from({ length: roomInfo.roomNum }, (_, i) => {
    return (
      roomStore.participants[i] || {
        playerId: '',
        role: '',
        isReady: 0,
        isHost: 0,
      }
    );
  });

  // 更新房间信息
  roomInfo.hostPlayerId = roomStore.hostPlayerId;
  roomInfo.isHostReady = roomStore.isHostReady;
  // 更新主持人状态
  roomInfo.isHostReady = roomStore.isHostReady;

  roomInfo.currentNum = roomInfo.participants.filter((item) => item.isReady === 1).length;
};

// 监听 roomStore.participants 的变化，并更新 roomInfo.participants
watch(
  () => roomStore.participants,
  () => {
    if (roomStore.status === null) {
      roomStore.status = RoomStatus.Waiting;
    }
    initializeParticipants();
  },
  { deep: true },
);

// 复制文本
const copyText = () => {
  const clipboard = new Clipboard('.roomId'); //创建一个新的
  clipboard.on('success', (e) => {
    ElMessage.success('复制成功了鱿(*^▽^*)');
    // 释放内存
    clipboard.destroy();
  });
  clipboard.on('error', (e) => {
    // 不支持复制
    ElMessage.success('修改成功！');
    ElMessage.error('复制失败了o(╥﹏╥)o');
    console.log('该浏览器不支持自动复制');
    // 释放内存
    clipboard.destroy();
  });
};

const goToLink = (url) => {
  router.push(url);
};
</script>

<style scoped>
.el-divider--horizontal {
  border-top: 1px dashed #292e36;
  padding: 0;
}

.el-divider--vertical {
  border: 1px dashed #292e36;
  padding: 0;
  height: auto;
}

:deep(.bg-circles) {
  background-image: url('@/assets/images/circles-transparent.png'),
    linear-gradient(180deg, rgba(2, 0, 36, 0.1) 0%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.25) 100%);

  background-size: cover;
  background-repeat: repeat;
  background-size: 400px;
}

.bg-judd {
  background-image: url('@/assets/images/judd.png');
  background-size: contain;
  background-position: top, center;
  background-repeat: no-repeat;
}

.bg-lijudd {
  background-image: url('@/assets/images/lil-judd.png');
  background-size: contain;
  background-position: top, center;
  background-repeat: no-repeat;
}
</style>
