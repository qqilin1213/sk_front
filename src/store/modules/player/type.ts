/*
 * @Author: qqilin1213
 * @Date: 2024-06-26 10:09:37
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 18:06:44
 */
export interface PlayerState {
  currentPlayerId: string;
  isReady: boolean;
  isVote: boolean;
  isComplete: boolean,
  isTop:boolean,
}