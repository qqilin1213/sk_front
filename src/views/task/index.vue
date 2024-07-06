<!--
 * @Author: qqilin1213
 * @Date: 2024-06-24 12:56:22
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 12:03:47
-->
<template>
  <MainLayout>
    <div class="grow flex items-center justify-center select-none">
      <div class="mx-4 md:mx-12 w-full">
        <div class="flex flex-justify-between mb-5">
          <!-- 返回 -->
          <router-link 
          :to="{ name: 'room', params: { roomId: roomStore.roomId, playerId:playerStore.currentPlayerId } }" 
           class="text-yellow text-3xl font-splatoon2 justify-start">
            &laquo; {{ $t('create.return') }}
          </router-link>
        </div>
        <TaskContiner ref="allTaskRef" title="全模式任务看板"></TaskContiner>
        <TaskContiner class="mt-20" ref="anarchyTaskRef" title="真格模式任务看板"></TaskContiner>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useTaskStore, useRoomStore, usePlayerStore} from '@/store';
import MainLayout from '@/layouts/MainLayout.vue';
import SquidTape from '@/components/SquidTape.vue';
import TaskContiner from '@/components/task/TaskContiner.vue';

const taskStore = useTaskStore();
const roomStore = useRoomStore();
const playerStore = usePlayerStore();

let tasks = reactive([]);
let allTasks = ref([]);
let anarchyTasks = ref([]);

const allTaskRef = ref();
const anarchyTaskRef = ref();

const taskReq = reactive({
  types: 'ALL,ANARCHY',
});

onMounted(() => {
  taskStore.getTasks(taskReq).then(() => {
    tasks = taskStore.tasks;
    allTasks.value = tasks.filter((item) => item.type === 'ALL');
    anarchyTasks.value = tasks.filter((item) => item.type === 'ANARCHY');

    allTaskRef.value.setTasks(allTasks.value);
    anarchyTaskRef.value.setTasks(anarchyTasks.value);
  });
});
</script>

<style scoped>
.bg-paper {
  background-image: url('@/assets/images/paper-bg.jpg');
  background-size: cover;
  background-repeat: repeat-y;

  mask-image: url('@/assets/images/paper-tear-mask.svg');
  mask-position: bottom;
  mask-size: 100%;
}

.bg-horiz-card {
  background-image: url('@/assets/images/gesotown-horiz-card-bg.png');
  /* background-size: 100% 100%; */
  background-repeat: no-repeat;
  background-position: center;
}
</style>
