/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 10:07:07
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 19:45:51
 */
import { defineStore } from 'pinia';
import { TaskState, Task } from "./type";
import { TaskReqParams } from "@/api/task/types"
import { useSocketStoreWithOut } from "@/store/modules/socket";
import { useRoomStoreWithOut } from "@/store/modules/room";
import { usePlayerStoreWithOut } from "@/store/modules/player";

import { getTaskList } from '@/api/task'
import router from '@/router';
import app from '@/main';
import { RoomStatus } from '@/store/modules/room/types';

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    currentTask: {
      taskId: "",
      type: "",
      typeInfo: "",
      subType: "",
      subTypeInfo: "",
      level: 0,
      title: "",
      subTitle: "",
      createName: "",
      isChoose: false,
    },
  }),
  actions: {
    resetStore() {
      this.$reset();
    },
    // 业务
    // 获取任务列表
    async getTasks(req: TaskReqParams) {
      const result = await getTaskList(req);
      this.tasks = result?.tasks;
    },
    // 随机任务
    async onRandomTask(req: TaskReqParams) {
      const webSocketStore = useSocketStoreWithOut();
      const roomStore = useRoomStoreWithOut();

      if (webSocketStore.isConnected) {
        let roomId = roomStore.roomId;
        let models = req.models.join(',');
        let gameTypes = req.gameTypes.join(',');
        let levels = req.levels.join(',');
        const message = { event: 'randomTask', roomId, models, gameTypes, levels };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            let roomId = roomStore.roomId;
            let models = req.models.join(',');
            let gameTypes = req.gameTypes.join(',');
            let levels = req.levels.join(',');
            const message = { event: 'randomTask', roomId, models, gameTypes, levels };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });

      }
    },
    setCurrentTask(message: any) {
      const roomStore = useRoomStoreWithOut();
      const playerStore = usePlayerStoreWithOut();

      this.currentTask = {
        taskId: message.task?.taskId,
        type: message.task?.type,
        typeInfo: message.task?.typeInfo,
        subType: message.task?.subType,
        subTypeInfo: message.task?.subTypeInfo,
        level: message.task?.level,
        title: message.task?.title,
        subTitle: message.task?.subTitle,
        createName: message.task?.createName,
        isChoose: true,
      }
      if (this.currentTask.typeInfo === '') {
        roomStore.status = RoomStatus.AssigningRoles
      } else {
        roomStore.status = RoomStatus.AssigningTasks
      }
      goToLinkWithParam('room',roomStore.roomId, playerStore.currentPlayerId)
    },
    setTask(task: Task, isReselect: boolean) {
      const webSocketStore = useSocketStoreWithOut();
      const roomStore = useRoomStoreWithOut();
      const playerStore = usePlayerStoreWithOut();

      this.currentTask = task;
      let c_task = this.currentTask;
      if (webSocketStore.isConnected) {
        let roomId = roomStore.roomId;
        // 任务信息
        let type = this.currentTask.type;
        let taskId = this.currentTask.taskId;
        let typeInfo = this.currentTask.typeInfo;
        let subType = this.currentTask.subType;
        let subTypeInfo = this.currentTask.subTypeInfo;
        let level = this.currentTask.level;
        let title = this.currentTask.title;
        let subTitle = this.currentTask.subTitle;
        let createName = this.currentTask.createName;

        const message = {
          event: 'setTask', roomId, type, typeInfo, subType
          , subTypeInfo, level, title, subTitle, createName, taskId
        };
        app.config.globalProperties.$socket.sendObj(message);
        if (isReselect) {
          roomStore.status = RoomStatus.AssigningRoles;
        } else {
          roomStore.status = RoomStatus.AssigningTasks;
        }
        goToLinkWithParam('room',roomStore.roomId, playerStore.currentPlayerId)

      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            let roomId = roomStore.roomId;
            // 任务信息
            let type = c_task.type;
            let taskId = c_task.taskId;
            let typeInfo = c_task.typeInfo;
            let subType = c_task.subType;
            let subTypeInfo = c_task.subTypeInfo;
            let level = c_task.level;
            let title = c_task.title;
            let subTitle = c_task.subTitle;
            let createName = c_task.createName;

            const message = {
              event: 'setTask', roomId, type, typeInfo, subType
              , subTypeInfo, level, title, subTitle, createName, taskId
            };
            app.config.globalProperties.$socket.sendObj(message);
            if (isReselect) {
              roomStore.status = RoomStatus.AssigningRoles;
            } else {
              roomStore.status = RoomStatus.AssigningTasks;
            }
            goToLinkWithParam('room',roomId, playerStore.currentPlayerId)
          }
        });

      }
    },
    onReselectTask() {
      this.currentTask = {
        taskId: "",
        type: "",
        typeInfo: "",
        subType: "",
        subTypeInfo: "",
        level: 0,
        title: "",
        subTitle: "",
        createName: "",
        isChoose: false,
      }
      this.setTask(this.currentTask, true)
    }
  },
  persist: {
    key: 'task',
    storage: localStorage,
  },
});


const goToLinkWithParam = (url, roomId, playerId) => {
  router.push({ name: url, params: { roomId, playerId } } );
}

export function useTaskStoreWithOut() {
  return useTaskStore();
}

