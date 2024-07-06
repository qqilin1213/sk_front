/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 10:56:29
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 16:18:08
 */
export interface Participant {
  groupId: string;
  playerId: string;
  roleName: string;
  isReady: boolean;
  isVoted: boolean;
  isAlive: boolean;
  isHost: number;
}

export interface RoomState {
  isNeedMiddleRole: boolean,
  roomNum: number,
  hasHost: boolean,
  isHostReady: boolean,
  hostPlayerId: string,
  creatorPlayerId: string,
  roomId: string;
  participants: Participant[];
  status: RoomStatus;
  resultImgData: string;
  voteResult: any,
  resultMsg: string,
}

// 定义房间状态的枚举
export enum RoomStatus {
  Waiting = 'waiting',
  AssigningRoles = 'assigning_roles',
  AssigningTasks = 'assigning_tasks',
  StartGame = 'start_game',
  Discussing = 'discussing',
  Discussed = 'discussed',
  Voting = 'voting',
  Finished = 'finished',
  ReStart = 'restart'
}
