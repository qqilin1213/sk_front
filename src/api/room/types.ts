/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 10:36:44
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-19 10:55:31
 */
export interface TokenReqParams {
  num: string;
  playName: string;
  hasHost: boolean;
}

export interface TokenResResult {
  data?: TokenResResultData;
  code: string;
  info: string;
  gameCode: string;
  gameInfo: string;
}

interface TokenResResultData {
  token?: string;
}
