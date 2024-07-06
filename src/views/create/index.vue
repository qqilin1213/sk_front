<template>
  <MainLayout>
    <div class="grow flex items-center justify-center select-none">
      <div class="w-full max-w-2xl mt-20 mb-20 mx-4">
        <div class="relative" v-show="isShowContiner">
          <Splat2 class="absolute -top-32 -left-24 w-64" />
          <Splat5 class="absolute -right-28 -bottom-24 w-64" />

          <div class="relative z-0 md:rotate-1">
            <ProductContainer class="py-12 bg-octoarrow">
              <div class=" text-zinc-300 px-10">
                <div class="space-y-6 flex flex-col">
                  <!-- 标题 -->
                  <SquidTape
                    class="font-splatoon1 text-2xl text-black rounded-sm -rotate-2 z-10 justify-end"
                    bg="bg-splatoon-green"
                    squid-bg="bg-black"
                    border="border border-black"
                    squid-size="15px"
                  >
                    <div class="px-1">
                      {{ $t('create.title') }}
                    </div>
                  </SquidTape>

                  <el-form ref="roomFormRef" :model="roomFormData" class="login-form" layout="vertical" :rules="rules">
                    <el-form-item prop="isNeedHost" hide-label>
                      <div class="font-splatoon2 text-2xl text-black w-100%">{{ $t('create.NeedCompere') }}</div>
                      <el-switch
                        v-model="roomFormData.isNeedHost"
                        size="large"
                        inline-prompt
                        :active-icon="Check"
                        :inactive-icon="Close"
                        style="--el-switch-on-color: #6af7ce"
                      />
                    </el-form-item>
                    <!-- 玩家ID-->
                    <el-form-item
                      prop="playName"
                      :rules="[{ required: true, message: '请输入玩家名称' }]"
                      :validate-trigger="['change', 'blur']"
                      hide-label
                    >
                      <div class="font-splatoon2 flex flex-row w-100% mb-2">
                        <div class="text-2xl text-black">{{ $t('create.userName') }}</div>
                        <div class="text-2xl text-yellow-3 ml-1">(*)</div>
                      </div>
                      <el-input v-model.trim="roomFormData.playName" class="w-40" placeholder="USER NAME">
                        <template #prefix>
                          <span class="font-splatoon1 text-3xl inline-block text-light-purper rotate-[25deg]">&#57445;</span>
                        </template>
                        <template #suffix>
                          <span class="font-splatoon1 text-3xl inline-block text-light-purper rotate-[-25deg]">&#57445;</span>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item
                      prop="roomNum"
                      :rules="[{ required: true, message: '参数人数不能为空' }]"
                      :validate-trigger="['change', 'blur']"
                    >
                      <div class="font-splatoon2 flex flex-row w-100% mb-2">
                        <div class="text-2xl text-black">{{ $t('create.participation') }}</div>
                        <div class="text-2xl text-yellow-3 ml-1">(*)</div>
                      </div>
                      <div>
                        <el-select v-model="roomFormData.roomNum" class="w-40">
                          <template #prefix>
                            <span class="font-splatoon1 text-3xl inline-block text-light-purper">&#57445;</span>
                          </template>
                          <span style="font-weight: bold">{{ value }}</span>
                          <el-option
                            class="font-splatoon1"
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          /> </el-select
                      ></div>
                    </el-form-item>
                    <el-form-item prop="isNeedMiddle" hide-label v-show="roomFormData.roomNum == 6">
                      <div class="font-splatoon2 text-2xl text-black w-100%">{{ $t('create.NeedMiddleRole') }}</div>
                      <el-switch
                        v-model="roomFormData.isNeedMiddleRole"
                        size="large"
                        inline-prompt
                        :active-icon="Check"
                        :inactive-icon="Close"
                        style="--el-switch-on-color: #6af7ce"
                      />
                    </el-form-item>
                  </el-form>

                  <div class="flex flex-justify-between">
                    <!-- 返回 -->
                    <router-link to="/" class="text-zinc-200 text-2xl font-splatoon2 justify-start">
                      &laquo; {{ $t('create.return') }}
                    </router-link>
                    <!-- 创建房间 -->
                    <div class="text-zinc-200 text-2xl font-splatoon2 justify-end cursor-pointer" @click="createRoom()">
                      {{ $t('create.created') }} &raquo;</div
                    >
                  </div>
                </div>
              </div>
            </ProductContainer>

            <img class="absolute hidden sm:block -top-6 right-14 w-48 -rotate-3" src="@/assets/images/tape/tape-1.png" />
            <img class="absolute -bottom-10 left-8 w-44 rotate-6" src="@/assets/images/tape/tape-3.png" />
            <img class="absolute top-40 -right-24 w-32 rotate-6" src="@/assets/images/stickers/sticker-4.png" />
            <img class="absolute hidden sm:block -bottom-6 right-32 w-44 -rotate-3" src="@/assets/images/stickers/sticker-10.png" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import Splat2 from '@/components/splats/Splat2.vue';
import Splat5 from '@/components/splats/Splat5.vue';
import SquidTape from '@/components/SquidTape.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import ProductContainer from '@/components/ProductContainer.vue';
import { Check, Close } from '@element-plus/icons-vue';
import { usePlayerStore, useRoomStore } from '@/store';
import router from '@/router';

import { ref } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';

const isNeedHost = ref(true);
const roomNum = ref('');
const playName = ref('');
const isShowContiner = ref(true);
const roomStore = useRoomStore();
const playerStore = usePlayerStore();

// 人数选项
const options = [
  {
    value: '4',
    label: '2v2',
  },
  {
    value: '6',
    label: '3v3',
  },
  {
    value: '8',
    label: '4v4',
  },
];

// 表单相关
const roomFormRef = ref();
const roomFormData = reactive({
  isNeedMiddleRole: true,
  isNeedHost: true,
  roomNum: '',
  playName: '',
});
const rules = reactive({
  num: [
    {
      required: true,
      message: '参赛人数不能为空',
    },
  ],
  playName: [
    {
      required: true,
      message: '玩家名称不能为空',
    },
  ],
});

// 创建房间
const createRoom = async () => {
  if (!roomFormRef) return;

  await roomFormRef.value.validate((valid) => {
    if (valid) {
      isShowContiner.value = false;
      const loading = ElLoading.service({
        lock: true,
        text: '',
        background: 'rgba(0, 0, 0, 0)',
      });
      // 申请房间
      roomStore
        .createRoom(roomFormData)
        .then((result) => {
          if (result) {
            roomStore.participants = [];
            loading.close();
            roomStore.onJoinedSuccess(result, !roomFormData.isNeedHost);
          }
        })
        .catch((error) => {
          loading.close();
          ElMessage.error('创建失败~', error);
        });
      //
    } else {
      ElMessage.warning('必填项是不是没有填写鱿~(→_←)');
      return;
    }
  });
};

const goToLink = (url) => {
  router.push(url);
};
</script>

<style scoped lang="css">
.text-light-purper {
  --un-text-opacity: 1;
  color: rgb(96 59 255);
}

:deep(.el-input) {
  --el-input-focus-border: #ffffff00;
  --el-input-transparent-border: 0 0 0 0px;
  --el-input-border-color: #ffffff00;
  --el-input-hover-border: 0px !important;
  --el-input-hover-border-color: #ffffff00;
  --el-input-focus-border-color: #ffffff00;
  --el-input-clear-hover-color: #ffffff00;
  box-shadow: 0 0 0 0px !important;
  --el-input-border: 0px;
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

:deep(.el-input__wrapper) {
  background-color: #6af7ce !important;
}

:deep(.el-input__inner) {
  color: black;
  font-family: var(--font-family-s1) !important;
}

:deep(.el-input__inner)::placeholder {
  color: #000000 !important; /* 修改文字颜色 */
}

:deep(.el-form-item__error) {
  color: #eaff3e;
  font-family: var(--font-family-s2) !important;
}
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #eaff3e;
}

.bg-octoarrow {
  background-image: url('@/assets/images/octoarrow-transparent.png');
  background-size: cover;
  background-repeat: repeat;
  background-size: 200px;
  background-position: 75px 50px;
}

</style>
