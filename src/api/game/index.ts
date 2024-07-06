/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 09:32:11
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-19 09:44:44
 */

import { post } from '@/utils/http/axios';
import { TokenReqParams } from './types';

enum URL {
  create = '/room/create',
}

const createRoom = async(data: TokenReqParams) => post<any>({ url: URL.create, data });
export { createRoom };
