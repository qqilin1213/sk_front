/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 09:28:09
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 16:44:33
 */
export interface TokenReqParams {
  num: string;
  playName: string;
  hasHost: boolean;
  getIsNeedMiddle: boolean;
}

export interface TokenResResult {
  data?: TokenResResultData;
  code: string;
  info: string;
  gameCode: string;
  gameInfo:string;
}
export interface TokenResResultData {
  token?: string;
  playerId?: string;
}
