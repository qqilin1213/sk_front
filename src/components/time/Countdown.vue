<!--
 * @Author: qqilin1213
 * @Date: 2024-06-30 14:39:20
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-30 16:00:57
-->
<template>
  <div :class="[fontSize, color]" class="text-center">
    <div>{{ formattedTime }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
  fontSize: {
    type: String,
    default: 'text-2xl',
  },
  color: {
    type: String,
    default: 'text-black',
  },
});

const timeLeft = ref(props.duration);
const isRunning = ref(false);
let timer = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeLeft.value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

const start = () => {
  if (!isRunning.value) {
    isRunning.value = true;
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value -= 1;
      } else {
        pause();
      }
    }, 1000);
  }
};

const pause = () => {
  isRunning.value = false;
  clearInterval(timer);
};

const reset = () => {
  pause();
  timeLeft.value = props.duration;
};

// onMounted(() => {
//   start();
// });

defineExpose({
  start,
  pause,
  reset,
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>