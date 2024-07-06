<!--
 * @Author: qqilin1213
 * @Date: 2024-06-28 00:11:28
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 18:06:59
-->
<template>
  <div v-if="playerStore.isVote === false">
    <div class="font-splatoon2 flex flex-row justify-around mb-4">
      <div class="text-xl text-white"> 是否为本场第一： </div>
      <el-select class="w-1/2" v-model="playerStore.isTop">
        <template #prefix>
          <span class="font-splatoon1 text-3xl inline-block text-light-purper">&#57445;</span>
        </template>
        <span style="font-weight: bold">{{ value }}</span>
        <el-option class="font-splatoon1" v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <template v-for="(player, idx) in teamA" :key="idx">
      <VotePlayer :item="player" :index="idx + 1" :firstDivClass="flexWidth" @vote="onVote" />
    </template>
    <el-divider border-style="dashed"></el-divider>
    <template v-for="(player, idx) in teamB" :key="idx">
      <VotePlayer :item="player" :index="idx + 1" :firstDivClass="flexWidth" @vote="onVote" />
    </template>
  </div>

  <div class="w-full h-50" v-if=" playerStore.isVote === true">
    <div id="voteResultChart" style="width: 100%; height: 100%"> </div>
  </div>

  <!-- 投票中 -->
  <template
    v-if="
      (playerStore.currentPlayerId === roomStore.hostPlayerId && totalValue >= roomStore.participants.length - 1) ||
      (!roomStore.hasHost && isBadSquid && totalValue >= roomStore.participants.length - 1)
    "
  >
    <div class="mt-5 w-full flex items-center justify-center">
      <el-button size="large" color="#E9FF3D" round @click="onShowResult()">公布比赛结果</el-button>
    </div>
  </template>
</template>

<script setup>
import * as echarts from 'echarts';
import VotePlayer from '@/components/player/VotePlayer.vue';
import { Check, Close } from '@element-plus/icons-vue';
import { RoomStatus } from '@/store/modules/room/types';
import { useRoomStore, usePlayerStore } from '@/store';
const roomStore = useRoomStore();
const playerStore = usePlayerStore();
let totalValue = ref(0);

// 布局
const flexWidth = ref('w-1/3');

let players = reactive([]);

const options = [
  { label: '是', value: true },
  { label: '否', value: false },
];

const teamA = computed(() => roomStore.participants.filter((player) => player.groupId === 'A'));
const teamB = computed(() => roomStore.participants.filter((player) => player.groupId === 'B'));
const isBadSquid = computed(() => {
  let badPlayers = roomStore.participants.filter((player) => player.roleName === '坏鱿');
  if (badPlayers && badPlayers.length > 0) {
    return badPlayers[0].playerId === playerStore.currentPlayerId;
  } else {
    return false;
  }
});

// 图表
const voteResultChartRef = ref();
const playerData = ref([]);
const votedResult = ref([]);
const option = reactive({
  color: ['#9cecfb', '#65c7f7', '#0052d4'],
  legend: {
    show: false,
  },
  grid: {
    top: '1%',
    left: '10%',
    right: '20%', // 可根据实际情况调整
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    max: 'dataMax', // 保证百分比和柱状图宽度对应得上
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: [],
    axisLabel: {
      textStyle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 35, // 调整行高以确保标签不会被截断
      },
      formatter: function (value) {
        return value.length > 10 ? value.substring(0, 10) + '...' : value; // 如果标签太长，可以截断
      },
      showMaxLabel: true,
      showMinLabel: true,
      interval: 0, // 显示所有标签
      rich: {
        name: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#FFFFFF',
          lineHeight: 35,
        },
      },
    },
  },
  series: [
    {
      showBackground: true,
      name: '',
      type: 'bar',
      barWidth: 20,
      zlevel: 2, // 层级高的显示在上面
      data: [],
      label: {
        position: 'right', // 标签显示在柱状图的右侧
        show: true,
        color: '#FFFFFF',
        lineHeight: 44,
        fontSize: 14,
      },
    },
    {
      name: '',
      type: 'bar',
      barWidth: 20,
      barGap: '-100%', // 两条柱条重叠
      data: [],
      label: {
        show: true,
        color: '#FDE047',
        fontSize: 16,
        position: 'right', // 标签右对齐
        distance: 15, // 标签距离柱条的距离
        formatter: (params) => {
          return '';
        },
        rich: {
          sep_color: {
            color: '#E0E0E0',
            padding: [0, 4],
          },
        },
      },
      itemStyle: {
        color: '#5E3AFA',
      },
      emphasis: {
        // 防止鼠标放柱状图上时柱子消失
        itemStyle: {
          color: '#5E3AFA',
        },
      },
    },
  ],
});

const props = defineProps({
  roomInfo: Object,
});

const setRoomInfo = (data) => {
  roomInfo.value = data;
};

const roleColorClass = (roleName) => {
  switch (roleName) {
    case '好鱿':
      return 'bg-green-3';
    case '坏鱿':
      return 'bg-red-3';
    case '呆呆鱿':
      return 'bg-yellow-3';
    default:
      return 'bg-opacity-100'; // Default color for unknown roles
  }
};

const onVote = (player) => {
  playerStore.onVote(player);
};

const createChart = () => {
  players = roomStore.participants;
  
  if (!voteResultChartRef.value) {
    voteResultChartRef.value = echarts.init(document.getElementById('voteResultChart'));
  }

  playerData.value = players.map((item) => item.playerId);
  votedResult.value = [];
  // 构建结果
  const voteStats = computedResult();
  playerData.value.forEach((playerId) => {
    let obj = {
      playerId: playerId,
      realValue: voteStats[playerId].count,
      value: 15,
      votes: voteStats[playerId].voters,
    };
    votedResult.value.push(obj);
  });

  // 计算 value 的总和
  totalValue.value = votedResult.value.reduce((sum, current) => {
    return sum + current.realValue;
  }, 0);

  option.yAxis.data = playerData.value;
  adjustAxisLabelStyle();
  option.series[0].data = votedResult.value.map((item) => item.realValue);
  option.series[1].data = votedResult.value;
  roomStore.voteResult = votedResult.value;
  voteResultChartRef.value.clear();
  voteResultChartRef.value.resize();
  voteResultChartRef.value.setOption(option);
};

// 计算函数，根据 y 轴数据数量动态调整 fontSize 和 lineHeight
function adjustAxisLabelStyle() {
  const yAxisDataLength = option.yAxis.data.length;
  let fontSize, lineHeight;

  if (yAxisDataLength === 6) {
    fontSize = 16;
    lineHeight = 35;
  } else if (yAxisDataLength == 4) {
    fontSize = 16;
    lineHeight = 44;
  } else {
    fontSize = 16;
    lineHeight = 30;
  }

  option.yAxis.axisLabel.textStyle.fontSize = fontSize;
  option.yAxis.axisLabel.textStyle.lineHeight = lineHeight;
}

const computedResult = () => {
  // 初始化所有玩家的投票信息
  const voteStats = players.reduce((acc, player) => {
    acc[player.playerId] = { playerId: player.playerId, count: 0, voters: [] };
    return acc;
  }, {});

  // 统计投票信息
  players.forEach((player) => {
    let score = 0;
    if (player.votedPlayerId) {
      if (player.isTop === 1) {
        score = 1.5;
      } else {
        score = 1;
      }
      voteStats[player.votedPlayerId].count += score;
      voteStats[player.votedPlayerId].voters.push({
        id: player.playerId,
        score: score,
      });
    }
  });
  return voteStats;
};

onMounted(() => {
  window.addEventListener('resize', resizeChart);
  let currentPlayerId = playerStore.currentPlayerId;
  let badPlayerId = roomStore.participants.filter((item) => item.roleName === '坏鱿')[0]?.playerId;
  if (roomStore.hasHost && roomStore.hostPlayerId === currentPlayerId) {
    playerStore.isVote = true;
  } else if (badPlayerId != undefined && badPlayerId === currentPlayerId) {
    playerStore.isVote = true;
  }

  if (playerStore.isVote) {
    setTimeout(() => {
      createChart();
    }, 100);
  }
});

watch(
  () => roomStore.participants,
  () => {
    setTimeout(() => {
      createChart();
    }, 100);
  },
  { deep: true },
);

const onShowResult = () => {
  roomStore.getGameResult();
};

const resizeChart = () => {
  if (voteResultChartRef.value) {
    voteResultChartRef.value.resize();
  }
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
});
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