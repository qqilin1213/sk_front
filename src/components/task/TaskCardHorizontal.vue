<!--
 * @Author: qqilin1213
 * @Date: 2024-06-24 13:36:51
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-27 09:32:04
-->
<template>
  <div :class="[isActiveTask(task), 'flex items-center space-x-4 py-2 mt-2 relative']">
    <!-- Gear Image -->
    <div class="ml-2 shrink-0">
      <div :class="[getIconPath(task), 'h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24']"></div>
    </div>

    <!-- Details -->
    <div class="grow min-w-0 flex flex-col justify-evenly space-y-2">
      <div class="flex">
        <div class="inline-block text-xs bg-zinc-200 bg-opacity-30 rounded px-1 py-px font-semibold"> </div>
      </div>

      <div class="flex items-center">
        <!-- Left-aligned section -->
        <div class="flex-1 w-1/10 font-splatoon2 text-shadow whitespace-nowrap text-white">
          {{ task.title }}
        </div>

        <!-- Center-aligned section -->
        <div class="flex-1 w-6/10 mx-auto font-splatoon2 text-shadow text-yellow text-center whitespace-wrap">
          {{ task.subTitle }}
        </div>

        <!-- Right-aligned section -->
        <div class="flex-1 w-3/10 flex flex-row justify-end space-x-2 mr-2.5">
          <div v-for="n in task.level" :key="n" class="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 star_icon"></div>
        </div>
      </div>

      <div class="flex justify-between">
        <div class="flex items-center space-x-2 bg-price w-28 mr-20 -mr-px">
          <div class="font-splatoon1 text-gray"> {{ task.createName }} </div>
        </div>
        <div class="flex font-splatoon1 justify-end text-white mr-2.5" v-show="showBth">
          <el-button size="small" color="#6AF6CD" round @click="chooseTask(task)">选择</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
.bg-price {
  background-image: url('@/assets/images/gesotown-price-bg.png');
  background-repeat: no-repeat;
  background-size: 120px 31px;
  background-position: left;
}

.star_icon {
  mask-image: url('@/assets/images/task/star.svg');
  mask-repeat: no-repeat;
  mask-size: contain;
  z-index: auto;
  background-color: #eaff3d;
  /* background-image: url('@/assets/images/task/star.svg');
  background-size: cover; */
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