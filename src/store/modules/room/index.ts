/*
 * @Author: qqilin1213
 * @Date: 2024-06-14 15:18:40
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 16:32:54
 */
import { defineStore } from 'pinia';
import { RoomState, RoomStatus } from './types';
import { createNewRoom, TokenReqParams } from '@/api/room/index';
import { useSocketStoreWithOut } from "@/store/modules/socket";
import { usePlayerStore, usePlayerStoreWithOut } from "@/store/modules/player";
import app from '@/main';
import { ElMessage } from 'element-plus';
import router from '@/router';
import IndexedDBInterface from '@/utils/indexed/IndexedDBInterface';


export const useRoomStore = defineStore('room', {
  state: (): RoomState => ({
    roomNum: 0,
    isHostReady: false,
    hasHost: false,
    hostPlayerId: '',
    creatorPlayerId: '',
    roomId: '',
    participants: [],
    status: RoomStatus.Waiting,
    // status: RoomStatus.Finished,
    isNeedMiddleRole: false,
    resultImgData: '',
    voteResult: [],
    resultMsg: '',
  }),
  actions: {
    resetStore() {
      this.$reset();
    },
    resetBaseInfo() {
      this.isHostReady = false;
      this.status = RoomStatus.Waiting;
      this.resultImgData = "";
      this.voteResult = [];
      this.resultMsg = '';
    },
    // 业务
    async onJoinedSuccess(message: any, isPlayer: boolean) {
      const playerStore = usePlayerStoreWithOut();

      // 初始化房间状态
      this.resetBaseInfo();
      let playerId = message?.playerId;
      let roomId = message?.roomId;
      if (isPlayer && playerId) {
        this.addParticipant(message);
        ElMessage.success('玩家：' + playerId + '，加入成功~(*‘ v`*)');
      } else {
        ElMessage.success('创建成功~(*‘ v`*)');
      }
      // goToLink('/room')
      if (playerStore.currentPlayerId === playerId) {
        goToLinkWithParam('room',roomId,playerId)
      }
    },
    onJoinedError(message: any) {
      const webSocketStore = useSocketStoreWithOut();
      const playerStore = usePlayerStoreWithOut();
      let currentPlayerId = playerStore.currentPlayerId;
      if (message.playerId === currentPlayerId) {
        ElMessage.error(message.info);
      }

      webSocketStore.SOCKET_ONCLOSE(false);
      goToLink('/join')
    },
    onChangePlayerState(message: any) {
      this.isHostReady = message.isHostReady
      this.updateParticipant(message);
    },
    onAllPlayerRoles(message: any) {
      this.updatePalyerRoleInfo(message.roleInfo);
    },
    onPlayerRole(message: any) {
      this.updatePalyerRoleInfo(message.roleInfo);
    },
    onPlayerLeft(message: any) {
      this.updateParticipant(message);
    },
    // 创建房间
    async createRoom(createForm: TokenReqParams) {
      const webSocketStore = useSocketStoreWithOut();
      const result = await createNewRoom(createForm);
      const roomId = result?.roomId;

      if (roomId) {
        let wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}?playerId=${createForm.playName}&roomId=${roomId}`;
        if (createForm.isNeedHost) {
          wsUrl += '&isHost=' + createForm.isNeedHost
        }
        localStorage.setItem('websocket_url', wsUrl);
        await webSocketStore.connectWebSocket(wsUrl);
        const playerStore = usePlayerStoreWithOut();
        playerStore.setCurrentPlayerId(createForm.playName);
        // 清空房间
        this.$reset();
        // 重新赋值
        this.setroomInfo(roomId, Number(createForm.roomNum), createForm.isNeedHost, createForm.playName, createForm.isNeedMiddleRole);
      }
      return result;
    },
    // 进入房间
    async joinRoom(roomId, playerId) {
      const webSocketStore = useSocketStoreWithOut();
      const playerStore = usePlayerStoreWithOut();
      playerStore.setCurrentPlayerId(playerId);
      const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}?playerId=${playerId}&roomId=${roomId}`;
      localStorage.setItem('websocket_url', wsUrl);
      if (!webSocketStore.isConnected) {
        try {
          await webSocketStore.connectWebSocket(wsUrl).then(() => { 
            const message = { event: 'join', roomId, playerId };
            app.config.globalProperties.$socket.sendObj(message);
          });
        } catch (error) {
          console.error('Failed to connect WebSocket:', error);
          return;
        }
      }
    },
    // 公布比赛结果
    getGameResult() {
      const webSocketStore = useSocketStoreWithOut();
      const playerStore = usePlayerStoreWithOut();
      let roomId = this.roomId;
      let isComplete = playerStore.isComplete;
      let voteResult = JSON.stringify(this.voteResult);
      if (webSocketStore.isConnected) {
        const message = { event: 'showResult', roomId, isComplete, voteResult };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'showResult', roomId, isComplete, voteResult };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    // 设置游戏结果
    setGameResult(msg: any) {
      this.resultMsg = msg.resultMsg;
      this.status = RoomStatus.Finished;
    },
    // 设置房间信息
    setroomInfo(newRoomId: string, roomNum: number, hasHost: boolean, hostPlayerId: string, isNeedMiddleRole: boolean) {
      this.roomId = newRoomId;
      this.roomNum = roomNum;
      this.hasHost = hasHost;
      if (this.hasHost) {
        this.hostPlayerId = hostPlayerId;
      }
      this.creatorPlayerId = hostPlayerId;
      this.isNeedMiddleRole = isNeedMiddleRole;
    },
    // 设置房间信息
    updateRoomInfo(newRoomId: string, roomNum: number, hasHost: boolean, hostPlayerId: string, creatorPlayerId: string, isHostReady: boolean) {
      this.roomId = newRoomId;
      this.roomNum = roomNum;
      this.hasHost = hasHost;
      if (this.hasHost) {
        this.hostPlayerId = hostPlayerId;
      }
      this.creatorPlayerId = creatorPlayerId;
      this.isHostReady = isHostReady;
    },
    // 加入房间
    addParticipant(msg: any) {
      let hasHost = msg.hasHost;
      let roomNum = msg.roomNum;
      let roomId = msg.roomId;
      let hostPlayerId = msg.hostPlayerId;
      let isHostReady = msg.isHostReady === undefined ? msg.hostReady : msg.isHostReady;
      let creatorPlayerId = msg.creatorPlayerId;
      this.participants = msg.participants.filter(item => item.isHost != 1);
      this.updateRoomInfo(roomId, roomNum, hasHost, hostPlayerId, creatorPlayerId, isHostReady)
    },
    updateParticipant(msg: any) {
      this.participants = msg.participants.filter(item => item.isHost != 1);
    },
    setRoomStatus(msg: any) {
      this.status = msg.info
    },
    setImageData(msg: any) {
      this.resultImgData = msg.data;
    },
    setVotedResult(msg: any) {
      this.updateParticipant(msg);
    },
    updatePalyerRoleInfo(roleInfo: any) {
      // 全部填充
      if (Array.isArray(roleInfo)) {
        this.participants.forEach(item => {
          let roleItem = roleInfo.filter(roleItem => roleItem.playerId === item.playerId)[0]
          item.groupId = roleItem.groupId;
          item.roleName = roleItem.roleName;
        })
      }
      this.status = RoomStatus.AssigningRoles;
    },
    // 开始游戏 
    onChangeRoomStatus(status: string) {
      const webSocketStore = useSocketStoreWithOut();
      let roomId = this.roomId;
      if (webSocketStore.isConnected) {
        const message = { event: 'changeRoomStatus', roomId, status };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'changeRoomStatus', roomId, status };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    // 分配角色
    onAssignRole() {
      const webSocketStore = useSocketStoreWithOut();
      let roomId = this.roomId;
      let isNeedMiddleRole = this.isNeedMiddleRole;
      if (webSocketStore.isConnected) {
        const message = { event: 'assignRole', roomId, isNeedMiddleRole };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'assignRole', roomId, isNeedMiddleRole };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    // 删除玩家
    removeParticipant(participantId: string) {
      this.participants = this.participants.filter(p => p.playerId !== participantId);
    },
    // 玩家继续比赛
    onRestartGame() {
      const webSocketStore = useSocketStoreWithOut();
      const playerStore = usePlayerStore();
      let roomId = this.roomId;
      this.status = RoomStatus.ReStart;

      if (webSocketStore.isConnected) {
        let playerId = playerStore.currentPlayerId;
        let isHost = this.hostPlayerId === playerId;
        let isCreator = this.creatorPlayerId === playerId;
        const message = { event: 'restartGame', roomId, playerId, isHost, isCreator };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            let playerId = playerStore.currentPlayerId;
            let isHost = this.hostPlayerId === playerId;
            let isCreator = this.creatorPlayerId === playerId;
            const message = { event: 'restartGame', roomId, playerId, isHost, isCreator };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });

      }
    },
    // 主持人结束比赛
    onCloseGame() {
      // 取消房间
      const webSocketStore = useSocketStoreWithOut();
      let roomId = this.roomId;
      if (webSocketStore.isConnected) {
        const message = { event: 'closeGame', roomId };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'closeGame', roomId };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    // 移交房主
    onChangeHost(newHostId: string) {
      const webSocketStore = useSocketStoreWithOut();
      let roomId = this.roomId;
      let oldHostId = this.hostPlayerId;
      if (webSocketStore.isConnected) {
        const message = { event: 'changeHost', roomId, oldHostId, newHostId };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'changeHost', roomId, oldHostId, newHostId };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    // 更新房间状态
    onChangeRoom(msg: any) {
      this.hostPlayerId = msg.hostPlayerId;
      this.isHostReady = msg.isHostReady;
      this.updateParticipant(msg);
    }
  },
  persist: {
    key: 'room',
    storage: localStorage,
  },
});

const goToLink = (url) => {
  router.push(url);
};

const goToLinkWithParam = (url, roomId, playerId) => {
  router.push({ name: url, params: { roomId, playerId } } );
}

export function useRoomStoreWithOut() {
  return useRoomStore();
}