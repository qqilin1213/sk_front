/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 10:36:13
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-05 16:47:02
 */

import { post } from '@/utils/http/axios';

export interface TokenReqParams {
  roomNum: string;
  playName: string;
  isNeedHost: boolean;
  isNeedMiddleRole: boolean;
}

export interface TokenResResult {
  data: TokenResResultData;
  code: string;
  info: string;
  gameCode: string;
  gameInfo: string;
}

interface TokenResResultData {
  token: string;
}

enum URL {
  create = '/room/create',
}

const createNewRoom = async (data: TokenReqParams) => post<any>({ url: URL.create, data });
export { createNewRoom };
