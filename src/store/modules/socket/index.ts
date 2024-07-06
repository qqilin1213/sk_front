import { defineStore } from "pinia";
import { SocketStore } from "./type";
import { useRoomStoreWithOut } from '@/store/modules/room'
import { useTaskStoreWithOut } from '@/store/modules/task'
import { usePlayerStoreWithOut } from '@/store/modules/player'
import { RoomStatus } from '@/store/modules/room/types';
import router from '@/router';
import app from '@/main';
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn') //中文化


const SOCKET_URL_KEY = 'websocket_url';

export const useSocketStore = defineStore('socket', {
  state: (): SocketStore => ({
    // 连接状态
    isConnected: false,
    // 消息内容
    message: "",
    // 重新连接错误
    reconnectError: false,
    // 心跳消息发送时间
    heartBeatInterval: 50000,
    // 心跳定时器
    heartBeatTimer: 0
  }),
  actions: {
    // 连接关闭
    SOCKET_ONCLOSE(isReconnect = true) {
      const playerStore = usePlayerStoreWithOut();
      const roomStore = useRoomStoreWithOut();
      const taskStore = useTaskStoreWithOut();

      this.isConnected = false;
      // 连接关闭时停掉心跳消息
      window.clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = 0;
      if (localStorage.getItem(SOCKET_URL_KEY) != null) {
        ElMessage.info("连接已断开，" + moment().format('LLL'))
      }
      // 清除数据
      localStorage.removeItem(SOCKET_URL_KEY);
      // IndexedDBInterface.removeData(SOCKET_URL_KEY);
      playerStore.resetStore();
      taskStore.resetStore();
      roomStore.resetStore();

      if (isReconnect) {
        this.SOCKET_RECONNECT((success) => {
          if (success) {
            console.log("连接重新建立")
          }
        });
      }
    },
    // 发生错误
    SOCKET_ONERROR(event: any) {
      // console.error(event);
    },
    // 收到服务端发送的消息
    SOCKET_ONMESSAGE(message: any) {
      this.message = message;
      // 根据事件类型处理消息
      this.handleMessage(message);
    },
    // 自动重连
    SOCKET_RECONNECT(callback: (success: boolean, error?: any) => void) {
      // console.info("消息系统重连中...", count);
      if (!this.isConnected) {
        const url = localStorage.getItem(SOCKET_URL_KEY);
        // const url = await IndexedDBInterface.getData<string>(SOCKET_URL_KEY);
        if (url) {
          if (!this.isConnected) {
            console.info('Attempting to reconnect WebSocket...');
            this.connectWebSocket(url)
              .then(() => {
                console.info('Reconnected successfully.');
                if (callback) {
                  callback(true); // 成功时回调，传递 success = true
                }
              })
              .catch((error) => {
                console.error('Reconnection failed:', error);
                if (callback) {
                  callback(false, error); // 失败时回调，传递 success = false 和错误信息
                }
              });
          }
        } else {
          if (callback) {
            callback(false, new Error('No URL found in localStorage'));
          }
        }
      } else {
        if (callback) {
          callback(false, new Error('WebSocket is already connected'));
        }
      }
    },

    // 重连错误
    SOCKET_RECONNECT_ERROR() {
      this.reconnectError = true;
    },
    async connectWebSocket(url: string) {
      return new Promise<void>((resolve, reject) => {
        if (this.isConnected) {
          resolve();
          return;
        }
        app.config.globalProperties.$connect(url);
        app.config.globalProperties.$socket.onopen = (event: Event) => {
          console.log("successful websocket connection");
          app.config.globalProperties.$socket = event.currentTarget;
          this.isConnected = true;
          this.heartBeatTimer = window.setInterval(() => {
            if (this.isConnected) {
              app.config.globalProperties.$socket.sendObj({ event: 'heartbeat' });
            }
          }, this.heartBeatInterval);
          resolve();
        };

        app.config.globalProperties.$socket.onerror = (error: Event) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        };
      });
    },
    handleMessage(message: any) {
      const playerStore = usePlayerStoreWithOut();
      const roomStore = useRoomStoreWithOut();
      const taskStore = useTaskStoreWithOut();

      switch (message.event) {
        case 'joinedSuccess':
          roomStore.onJoinedSuccess(message, true);
          break;
        case 'joinedError':
          roomStore.onJoinedError(message);
          break;
        case 'changePlayerState':
          if (roomStore.status != RoomStatus.Finished) {
            roomStore.onChangePlayerState(message);
          }
          break;
        case 'allPlayerRoles':
          roomStore.onAllPlayerRoles(message);
          break;
        case 'playerRole':
          roomStore.onPlayerRole(message);
          break;
        case 'playerLeft':
          roomStore.onPlayerLeft(message);
          goToLink("/");
          break;
        case 'randomTask':
          taskStore.setCurrentTask(message);
          break;
        case 'setTask':
          taskStore.setCurrentTask(message);
          break;
        case 'changeRoomStatus':
          roomStore.setRoomStatus(message);
          break;
        case 'setImageData':
          roomStore.setImageData(message);
          break;
        case 'showVotedResult':
          playerStore.setIsVoted(message);
          if (playerStore.isVote === true) {
            ;
            roomStore.setVotedResult(message);
          }
          break;
        case 'showResult':
          playerStore.isComplete = message.isComplete;
          taskStore.setCurrentTask(message);
          roomStore.updateParticipant(message);
          roomStore.setGameResult(message);
          break;
        case 'restartGame':
          if (roomStore.status === RoomStatus.ReStart) {
            roomStore.resetBaseInfo();
            roomStore.updateParticipant(message)
            if (message.playerId === playerStore.currentPlayerId) {
              playerStore.resetBaseInfo(message.playerId);
              taskStore.resetStore();
              goToLinkWithParam('room', roomStore.roomId, message.playerId)
            }
          } else if (roomStore.status === RoomStatus.Waiting) {
            roomStore.updateParticipant(message)
          }
          break;
        case 'leaveGame':
          if (message.playerId === playerStore.currentPlayerId) {
            this.SOCKET_ONCLOSE(false);
            goToLink("/");
          }
          break;
        case 'closeGame':
          this.SOCKET_ONCLOSE(false);
          goToLink("/");
          break;
        case 'taskStatus':
          playerStore.isComplete = message.isComplete
          break;
        case 'changeHost':
          roomStore.onChangeRoom(message)
          break;
        case 'reconnect':

          let info = message?.info;
          if (info) {
            ElMessage.info(info);
            goToLink("/");
          } else {
            // 设置房间状态 
            roomStore.status = message.roomStatus;
            // 房间数据
            roomStore.isNeedMiddleRole = message.isNeedMiddleRole;
            roomStore.addParticipant(message);
            // 玩家信息
            playerStore.updatePlayerInfo(message);
            if (RoomStatus.Waiting != roomStore.status) {
              // 任务信息
              taskStore.setCurrentTask(message);
            }

            if (message.roomStatus === RoomStatus.Discussing || message.roomStatus === RoomStatus.Discussed) {
              roomStore.resultImgData = message.resultImgData;
            }
            // 设置房间状态 
            roomStore.status = message.roomStatus;
            if (RoomStatus.Finished === roomStore.status) {
              roomStore.voteResult = JSON.parse(message.voteResult);
              playerStore.isComplete = message.isComplete;
              taskStore.setCurrentTask(message);
              roomStore.updateParticipant(message);
              roomStore.setGameResult(message);
            }

          }


          break;
        default:
          console.warn('Unhandled event:', message.event);
      }
    },
  },
});

export function useSocketStoreWithOut() {
  return useSocketStore();
}

const goToLink = (url) => {
  router.push(url);
};


const goToLinkWithParam = (url, roomId, playerId) => {
  router.push({ name: url, params: { roomId, playerId } });
}