<!--
 * @Author: qqilin1213
 * @Date: 2024-06-17 21:00:13
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-04 17:56:41
-->
<template>
  <MainLayout>
    <div class="grow flex items-center justify-center select-none">
      <div class="w-full max-w-2xl mt-20 mb-20 mx-4">
        <div class="relative">
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
                      {{ $t('join.title') }}
                    </div>
                  </SquidTape>

                  <el-form ref="joinFormRef" :model="joinFormData" layout="vertical" :rules="rules">
                    <el-form-item
                      prop="roomCode"
                      :rules="[{ required: true, message: '请输入房间ID' }]"
                      :validate-trigger="['change', 'blur']"
                      hide-label
                    >
                      <!-- 房间号 -->
                      <div class="font-splatoon2 flex flex-row w-100% mb-2">
                        <div class="font-splatoon2 text-2xl text-black">{{ $t('join.roomCode') }}</div>
                        <div class="text-2xl text-yellow-3 ml-1">(*)</div>
                      </div>

                      <el-input v-model.trim="joinFormData.roomCode" class="w-40" placeholder="ROOM CODE">
                        <template #prefix>
                          <span class="font-splatoon1 text-3xl inline-block text-light-purper rotate-[25deg]">&#57445;</span>
                        </template>
                        <template #suffix>
                          <span class="font-splatoon1 text-3xl inline-block text-light-purper rotate-[-25deg]">&#57445;</span>
                        </template>
                      </el-input>
                    </el-form-item>
                    <!-- 玩家ID-->
                    <el-form-item
                      prop="playName"
                      :rules="[{ required: true, message: '请输入玩家名称' }]"
                      :validate-trigger="['change', 'blur']"
                      hide-label
                    >

                      <div class="font-splatoon2 flex flex-row w-100% mb-2">
                        <div class="text-2xl text-black">{{ $t('join.userName') }}</div>
                        <div class="text-2xl text-yellow-3 ml-1">(*)</div>
                      </div>

                      <el-input v-model.trim="joinFormData.playName" class="w-40" placeholder="USER NAME">
                        <template #prefix>
                          <span class="font-splatoon1 text-3xl inline-block text-light-purper rotate-[25deg]">&#57445;</span>
                        </template>
                        <template #suffix>
                          <span class="font-splatoon1 text-3xl inline-block text-light-purper rotate-[-25deg]">&#57445;</span>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-form>

                  <!-- 返回 -->
                  <div class="flex flex-justify-between">
                    <router-link to="/" class="text-zinc-200 text-2xl font-splatoon2 justify-start">
                      &laquo; {{ $t('join.return') }}
                    </router-link>
                    <div class="text-zinc-200 text-2xl font-splatoon2 justify-end cursor-pointer" @click="joinGame()">
                      {{ $t('join.created') }} &raquo;</div
                    >
                  </div>
                </div>
              </div>
            </ProductContainer>

            <img class="absolute hidden sm:block -top-6 right-14 w-48 -rotate-3" src="@/assets/images/tape/tape-1.png" />
            <img class="absolute -bottom-10 left-8 w-44 rotate-6" src="@/assets/images/tape/tape-3.png" />
            <img class="absolute top-40 -right-24 w-32 rotate-6" src="@/assets/images/stickers/sticker-3.png" />
            <img class="absolute hidden sm:block -bottom-6 right-32 w-44 -rotate-3" src="@/assets/images/stickers/sticker-10.png" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import app from '@/main';
import Splat2 from '@/components/splats/Splat2.vue';
import Splat5 from '@/components/splats/Splat5.vue';
import SquidTape from '@/components/SquidTape.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import ProductContainer from '@/components/ProductContainer.vue';
import { Check, Close } from '@element-plus/icons-vue';

import { ref, getCurrentInstance } from 'vue';
import { ElLoading } from 'element-plus';
import { useRoomStore } from '@/store';

const joinFormRef = ref();
const joinFormData = ref({
  roomCode: '',
  playName: '',
});
const rules = reactive({
  roomCode: [
    {
      required: true,
      message: '房间号不能为空',
    },
  ],
  playName: [
    {
      required: true,
      message: '玩家名称不能为空',
    },
  ],
});

const roomStore = useRoomStore();

const joinGame = () => {
  if (!joinFormRef) return;

  joinFormRef.value.validate((valid) => {
    if (valid) {
      let roomId = joinFormData.value.roomCode.replace(/[^a-zA-Z0-9]/g, '');
      let playerId = joinFormData.value.playName;
      // 创建连接
      roomStore.joinRoom(roomId, playerId);
      //
    } else {
      ElMessage.warning('必填项是不是没有填写鱿~(→_←)');
      return;
    }
  });
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
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 0px !important;
}
:deep(.el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 0px !important;
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
