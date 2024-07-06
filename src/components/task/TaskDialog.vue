<!--
 * @Author: qqilin1213
 * @Date: 2024-06-26 18:34:09
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-03 13:42:46
-->
<template>
  <ModalDialog inner-class="md:-rotate-1 w-[75%] h-[95%] flex justify-center items-center" no-scroll>
    <div
      :class="[
        getBgColor(taskStore.currentTask),
        'w-full max-w-2xl isolate rounded-2xl overflow-hidden bg-tapes h-[85%] flex flex-col justify-center items-center',
      ]"
    >
      <div class="relative h-full overflow-hidden w-full">
        <div class="absolute inset-x-0 bg-zinc-800/40 backdrop-blur-md z-30 pt-10 pb-4">
          <div class="flex items-center space-x-2 mx-2">
            <div class="font-splatoon2 text-3xl lg:text-2xl xl:text-3xl text-shadow"> 任务详情 </div>
            <div
              v-if="taskStore.currentTask.subTypeInfo"
              class="font-splatoon2 text-xl lg:text-2xl xl:text-base bg-splatoon-blue rounded px-1 drop-shadow"
            >
              {{ $t(taskStore.currentTask.subTypeInfo) }}
            </div>
          </div>
        </div>

        <button class="text-zinc-300 bg-zinc-800/50 rounded-full p-1 absolute top-3 right-3 z-40" @click="$emit('close')">
          <span class="sr-only">Close</span>
          <el-icon :size="20" color="#ffffff"><Close /></el-icon>
        </button>

        <div class="overflow-y-auto h-full pt-24 pb-8 flex flex-col items-center">
          <div class="flex flex-col items-center">
            <div :class="[getIconPath(taskStore.currentTask), 'h-22 w-22 lg:h-20 lg:w-20 xl:h-24 xl:w-24 m-auto mt-10']"></div>
            <div class="font-splatoon2 text-3xl ss:text-lg text-shadow text-white whitespace-nowrap mt-10 mb-5">
              {{ taskStore.currentTask.title }}
            </div>
            <div class="w-full flex flex-row justify-center items-center">
              <template v-for="n in taskStore.currentTask.level" :key="n">
                <Star class="w-20 h-20 sm:w-15 sm:h-15 md:w-16 md:h-16 lg:w-17 lg:h-17" />
              </template>
            </div>
            <div class="p-4 mt-5 font-splatoon2 text-2xl ss:text-lg text-shadow text-yellow whitespace-normal">
              {{ taskStore.currentTask.subTitle }}
            </div>
            <div class="font-splatoon1 text-2xl text-gray-5"> {{ taskStore.currentTask.createName }} </div>
          </div>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue';
import Star from '@/components/splats/Star.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import { useTaskStore } from '@/store';
defineEmits(['close']);

const taskStore = useTaskStore();

const getBgColor = (currentTask) => {
  if (currentTask.type === 'ALL') {
    return 'bg-splatoon-battle-regular';
  } else if (currentTask.type === 'ANARCHY') {
    switch (currentTask.subType) {
      case 'AREA':
        return 'bg-splatoon-battle-ranked';
      case 'YUHU':
        return 'bg-splatoon-battle-ranked';
      case 'GELI':
        return 'bg-splatoon-battle-ranked';
      case 'TA':
        return 'bg-splatoon-battle-ranked';
      default:
        return '';
    }
  }
  return '';
};

const getIconPath = (currentTask) => {
  if (currentTask.type === 'ALL') {
    return 'all_icon';
  } else if (currentTask.type === 'ANARCHY') {
    switch (currentTask.subType) {
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
.product-mask {
  mask-image: url('@/assets/images/tag-card-header.svg');
  mask-position: top;
  mask-size: 2000px auto;
  mask-repeat: no-repeat;
}

.bg-tapes {
  background-image: url('@/assets/images/tapes-transparent.png'),
    linear-gradient(180deg, rgba(2, 0, 36, 0.1) 0%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.25) 100%);
  background-size: cover;
  background-repeat: repeat;
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
