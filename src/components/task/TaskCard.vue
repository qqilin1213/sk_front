<!--
 * @Author: qqilin1213
 * @Date: 2024-06-24 13:37:47
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-27 00:45:49
-->
<template>
  <div class="relative">
    <img src="@/assets/images/gesotown-tape-blob-bg.png" />

    <div :class="[isActiveTask(task), 'absolute inset-0 flex flex-col items-center justify-evenly my-4']">
      <!-- Gear Image -->
      <div class="w-full">
        <div :class="[getIconPath(task), 'h-18 w-18 lg:h-20 lg:w-20 xl:h-24 xl:w-24 absolute inset-0  m-auto opacity-50']"></div>
      </div>

      <!-- 内容 -->
      <div class="relative text-center px-10">
        <div class="inset-0 flex flex-col items-center justify-center">
          <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-white whitespace-nowrap mb-5"> {{ task.title }} </div>
          <div class="mt-5 font-splatoon2 text-xl ss:text-lg text-shadow text-yellow whitespace-normal">
            {{ task.subTitle }}
          </div>
        </div>
      </div>

      <!-- 制作人 -->
      <div class="flex flex-row justify-around items-center">
        <div class="font-splatoon1 text-gray mt-5 mb-5"> {{ task.createName }} </div>
      </div>
    </div>

    <!-- 级别 -->
    <div class="absolute top-5 left-6">
      <div class="flex flex-row">
        <div v-for="n in task.level" :key="n" class="w-10 h-10 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 star_icon" />
      </div>
    </div>

    <!-- 选择按钮 -->
    <div class="absolute inset-0 flex items-end justify-center pt-10" v-show="showBth">
      <div class="font-splatoon1">
        <el-button size="large" color="#6AF6CD" round @click="chooseTask(task)">选择</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import SquidTape from '@/components/SquidTape.vue';
import { useTaskStore } from '@/store';

const taskStore = useTaskStore();

const props = defineProps({
  task: Object,
  showBth: Boolean,
});

const isActiveTask = (task) => {
  if (task.isChoose && taskStore.currentTask.title != '') {
    return 'selected_task';
  } else {
    return '';
  }
};

const chooseTask = (task) => {
  taskStore.tasks.forEach((item) => {
    if (item.isChoose) {
      item.isChoose = false;
    }
  });
  task.isChoose = true;
  taskStore.setTask(task,false);
};

const getIconPath = (task) => {
  if (task.type === 'ALL') {
    return 'all_icon';
  } else if (task.type === 'ANARCHY') {
    switch (task.subType) {
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
</script>

<style scoped>
.star_icon {
  mask-image: url('@/assets/images/task/star.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
  z-index: auto;
  background-color: #eaff3d;
}

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
</style>
