<!--
 * @Author: qqilin1213
 * @Date: 2024-06-26 16:14:49
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-02 11:56:06
-->
<template>
  <MainLayout>
    <div class="grow flex items-center justify-center">
      <div class="w-full max-w-2xl mt-20 mb-20 mx-4">
        <div class="reactive z-0 md:rotate-1">
          <ProductContainer class="py-12 bg-octoarrow">
            <div class="faq text-zinc-300 px-10">
              <div class="space-y-6 flex flex-col">
                <!-- 标题 -->
                <SquidTape
                  class="font-splatoon1 text-2xl text-black rounded-sm -rotate-2 z-10 justify-end w-full"
                  bg="bg-splatoon-green"
                  squid-bg="bg-black"
                  border="border border-black"
                  squid-size="15px"
                >
                  <div class="px-1">任务配置</div>
                </SquidTape>

                <template v-if="roomStore.status === RoomStatus.AssigningRoles">
                  <el-form ref="taskFormRef" :model="taskFormData" class="login-form">
                    <!-- 任务类型 -->
                    <el-form-item prop="models">
                      <div class="font-splatoon2 flex flex-row w-full mb-2">
                        <div class="text-2xl text-black">任务模式</div>
                      </div>
                      <div class="w-full">
                        <el-select multiple native class="w-full" v-model="taskFormData.models" :placeholder="seletTip">
                          <template #prefix>
                            <span class="font-splatoon1 text-3xl inline-block text-light-purper">&#57445;</span>
                          </template>
                          <span style="font-weight: bold">{{ value }}</span>
                          <el-option
                            class="font-splatoon1"
                            v-for="item in modelOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </el-form-item>
                    <!-- 游戏类型 -->
                    <el-form-item prop="gameTypes" v-if="taskFormData.models?.length != ''">
                      <div class="font-splatoon2 flex flex-row w-full mb-2">
                        <div class="text-2xl text-black">比赛模式</div>
                      </div>
                      <div class="w-full">
                        <el-select multiple native class="w-full" v-model="taskFormData.gameTypes" :placeholder="seletTip">
                          <template #prefix>
                            <span class="font-splatoon1 text-3xl inline-block text-light-purper">&#57445;</span>
                          </template>
                          <span style="font-weight: bold">{{ value }}</span>
                          <el-option
                            class="font-splatoon1"
                            v-for="item in gameTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </el-form-item>
                    <!-- 任务难度 -->
                    <el-form-item prop="levels">
                      <div class="font-splatoon2 flex flex-row w-full mb-2">
                        <div class="text-2xl text-black">任务难度</div>
                      </div>
                      <div class="w-full">
                        <el-select multiple native class="w-full" v-model="taskFormData.levels" :placeholder="seletTip">
                          <template #prefix>
                            <span class="font-splatoon1 text-3xl inline-block text-light-purper">&#57445;</span>
                          </template>
                          <span style="font-weight: bold">{{ value }}</span>
                          <el-option
                            class="font-splatoon1"
                            v-for="item in hardOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-form>

                  <div class="flex justify-between">
                    <!-- 返回 -->
                    <router-link to="/room" class="text-zinc-200 text-2xl font-splatoon2"> &laquo; {{ $t('create.return') }} </router-link>
                    <!-- 创建任务 -->
                    <div class="text-zinc-200 text-2xl font-splatoon2 cursor-pointer" @click="onRandomTask()">
                      {{ $t('create.created') }} &raquo;
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </ProductContainer>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import app from '@/main';
import MainLayout from '@/layouts/MainLayout.vue';
import SquidTape from '@/components/SquidTape.vue';
import { useTaskStore, useRoomStore } from '@/store';
import { ref, reactive, watch } from 'vue';
import { RoomStatus } from '@/store/modules/room/types';

// 人数选项
const modelOptions = ref([
  {
    label: '全模式任务',
    value: 'ALL',
  },
  {
    label: '真格模式任务',
    value: 'ANARCHY',
  },
]);
const allGameTypeOptions = ref([
  {
    label: '区域模式',
    value: 'AREA',
    type: 'ANARCHY',
  },
  {
    label: '鱼虎模式',
    value: 'YUHU',
    type: 'ANARCHY',
  },
  {
    label: '蛤蜊模式',
    value: 'GELI',
    type: 'ANARCHY',
  },
  {
    label: '塔楼模式',
    value: 'TA',
    type: 'ANARCHY',
  },
  {
    label: '全模式',
    value: 'ALL',
    type: 'ALL',
  },
]);
const hardOptions = reactive([
  {
    label: '简单任务',
    value: '1',
  },
  {
    label: '普通任务',
    value: '2',
  },
  {
    label: '困难任务',
    value: '3',
  },
]);

// 表单相关
const taskFormRef = ref();
const taskFormData = ref({
  models: [],
  gameTypes: [],
  levels: [],
});

const seletTip = ref('默认随机全部');
const taskStore = useTaskStore();
const roomStore = useRoomStore();
let gameTypeOptions = ref([]);

watch(
  () => taskFormData.value.models,
  (newValue, oldValue) => {
    gameTypeOptions.value = allGameTypeOptions.value
      .filter((option) => taskFormData.value.models.includes(option.type))
      .map((option) => ({
        label: option.label,
        value: option.value,
      }));
  },
);

const onRandomTask = () => {
  taskStore.onRandomTask(taskFormData.value);
};
</script>

<style scoped lang="css">
.text-light-purper {
  --un-text-opacity: 1;
  color: rgb(96 59 255);
}

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
  background-color: #6af7ce !important;
}

:deep(.el-select .el-input__inner) {
  color: black;
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

.bg-octoarrow {
  background-image: url('@/assets/images/octoarrow-transparent.png');
  background-size: cover;
  background-repeat: repeat;
  background-size: 200px;
  background-position: 75px 50px;
}
</style>