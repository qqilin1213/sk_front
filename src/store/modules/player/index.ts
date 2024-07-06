/*
 * @Author: qqilin1213
 * @Date: 2024-06-26 10:10:16
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 18:08:18
 */
import { defineStore } from 'pinia';
import { PlayerState } from "./type";
import { useSocketStoreWithOut } from "@/store/modules/socket";
import { useRoomStoreWithOut } from "@/store/modules/room";
import app from '@/main';

export const usePlayerStore = defineStore('player', {
  state: (): PlayerState => ({
    currentPlayerId: '',
    isReady: false,
    isVote: false,
    isComplete: false,
    isTop:false,
  }),
  actions: {
    resetStore() {
      this.$reset();
    },
    updatePlayerInfo(msg:any) {
      this.currentPlayerId = msg.playerId;
      this.isReady = msg.isReady;
      this.isVote = msg.isVote;
      this.isComplete = msg.isComplete;
      this.isTop =  msg.isTop;
    },
    resetBaseInfo(playerId: string) {
      this.$reset();
      this.currentPlayerId = playerId;
    },
    setCurrentPlayerId(playerId: string) {
      this.currentPlayerId = playerId;
      this.isReady = false;
      this.isVote = false;
      this.isComplete = false;
      this.isTop = false;
    },
    setIsVoted(msg: any) {
      let playerId = msg.playerId
      if (this.currentPlayerId === playerId) {
        this.isVote = true
      }
    },
    // 业务
    // 准备
    onReady(isReady: boolean) {
      const webSocketStore = useSocketStoreWithOut();
      const roomSocketStore = useRoomStoreWithOut();
      this.isReady = isReady;
      let roomId = roomSocketStore.roomId;
      let playerId = this.currentPlayerId;
      let isReadyStr = isReady ? 1 : 0;
      if (webSocketStore.isConnected) {
        const message = { event: 'ready', roomId, playerId, isReady: isReadyStr };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'ready', roomId, playerId, isReady: isReadyStr };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    // 投票
    onVote(item) {
      const votedPlayerId = item.playerId;
      const webSocketStore = useSocketStoreWithOut();
      const roomSocketStore = useRoomStoreWithOut();
      let roomId = roomSocketStore.roomId;
      let playerId = this.currentPlayerId;
      let isTop = this.isTop;
      if (webSocketStore.isConnected) {
        const message = { event: 'voted', roomId, playerId, votedPlayerId, isTop};
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'voted', roomId, playerId, votedPlayerId, isTop };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });

      }
    },
    // 离开房间
    async onLeaveRoom() {
      const webSocketStore = useSocketStoreWithOut();
      const roomSocketStore = useRoomStoreWithOut();
      let roomId = roomSocketStore.roomId;
      let playerId = this.currentPlayerId;
      if (webSocketStore.isConnected) {
        const message = { event: 'leave', roomId, playerId };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'leave', roomId, playerId };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    // 退出游戏
    onLeaveGame() {
      const webSocketStore = useSocketStoreWithOut();
      const roomSocketStore = useRoomStoreWithOut();
      let roomId = roomSocketStore.roomId;
      let playerId = this.currentPlayerId;
      if (webSocketStore.isConnected) {
        const message = { event: 'leaveGame', roomId, playerId };
        app.config.globalProperties.$socket.sendObj(message);
      } else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'leaveGame', roomId, playerId };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }

    },
    // 玩家发言
    onSpeck(speckPlayerId: string) {
      const webSocketStore = useSocketStoreWithOut();
      const roomSocketStore = useRoomStoreWithOut();
      let roomId = roomSocketStore.roomId;
      let hostId = roomSocketStore.hasHost ? roomSocketStore.hostPlayerId : '';
      if (webSocketStore.isConnected) {
        const message = { event: 'playerSpeck', roomId, hostId, speckPlayerId };
        app.config.globalProperties.$socket.sendObj(message);
      }
      else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'playerSpeck', roomId, hostId, speckPlayerId };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    },
    setComplete(isComplete: boolean) {
      this.isComplete = isComplete;
      const webSocketStore = useSocketStoreWithOut();
      const roomSocketStore = useRoomStoreWithOut();
      const playerStore = usePlayerStoreWithOut();

      let roomId = roomSocketStore.roomId;
      let playerId = playerStore.currentPlayerId;
      if (webSocketStore.isConnected) {
        const message = { event: 'taskStatus', roomId, playerId, isComplete };
        app.config.globalProperties.$socket.sendObj(message);
      }
      else {
        webSocketStore.SOCKET_RECONNECT((success) => {
          if (success) {
            const message = { event: 'taskStatus', roomId, isComplete };
            app.config.globalProperties.$socket.sendObj(message);
          }
        });
      }
    }
  },
  persist: {
    key: 'player',
    storage: localStorage,
  },
}
);


export function usePlayerStoreWithOut() {
  return usePlayerStore();
}