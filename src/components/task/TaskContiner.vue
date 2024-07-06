<!--
 * @Author: qqilin1213
 * @Date: 2024-06-24 20:35:28
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-26 23:18:00
-->
<template>
  <div class="relative select-none">
    <div class="bg-paper absolute inset-0 -z-50"></div>

    <div class="absolute top-4 left-4">
      <img src="@/assets/images/staple-left.png" class="w-12" />
    </div>
    <div class="absolute top-4 right-4">
      <img src="@/assets/images/staple-right.png" class="w-12" />
    </div>

    <div class="pb-24 lg:pb-36">
      <div class="text-center py-4">
        <SquidTape
          class="font-splatoon1 text-2xl text-black rounded-sm -rotate-2 z-10"
          bg="bg-splatoon-orange"
          squid-bg="bg-black"
          border="border border-black"
          squid-size="15px"
        >
          <div class="px-1"> {{ title }} </div>
        </SquidTape>
      </div>

      <div class="md:hidden px-2">
        <div v-for="(task, index) in tasks" :key="index" class="bg-horiz-card">
          <TaskCardHorizontal :task="task" :showBth="showChooseBtn" />
        </div>
      </div>

      <div class="hidden md:block px-2">
        <div class="flex flex-row flex-wrap justify-center">
          <div v-for="task in tasks" :key="task.id" class="my-6 w-1/3 flex justify-center">
            <TaskCard :task="task" :showBth="showChooseBtn" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue';
import { useRoomStore } from '@/store';
import TaskCard from '@/components/task/TaskCard.vue';
import TaskCardHorizontal from '@/components/task/TaskCardHorizontal.vue';
import SquidTape from '@/components/SquidTape.vue';
import { RoomStatus } from '@/store/modules/room/types';

const roomStore = useRoomStore();
const chooseTask = roomStore.chooseTask;
const status = roomStore.status;

const showChooseBtn = chooseTask && (status === RoomStatus.AssigningRoles) ;

const props = defineProps({
  title: String,
});

let tasks = ref([]);
const title = props.title;

const setTasks = (datas) => {
  tasks.value = datas;
};

// Expose the method
defineExpose({
  setTasks,
});
</script>

<style scoped>
.bg-paper {
  background-image: url('@/assets/images/paper-bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;

  /* mask-image: url('@/assets/images/paper-tear-mask.svg'); */
  /* mask-position: bottom; */
  /* mask-size: 100%; */
}

.bg-horiz-card {
  background-image: url('@/assets/images/gesotown-horiz-card-bg.png');
  /* background-size: 100% 100%; */
  background-repeat: no-repeat;
  background-position: center;
}
</style>