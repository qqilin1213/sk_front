/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 09:32:11
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-26 15:57:11
 */

import { post } from '@/utils/http/axios';
import {TaskReqParams} from "@/api/task/types"


// export interface TaskReqParams {
//   types: string;
//   models: string;
//   gameTypes: string;
//   levels: string;
// }

export interface TaskResResult {
  data: Array<TaskResResultData>;
  code: string;
  info: string;
}

export interface TaskResResultData {
  type: string;
  typeInfo: string;
  subType: string;
  subTypeInfo: string;
  level: number;
  title: string;
  subTitle: string;
  createName: string;
}

enum URL {
  getTasks = '/task/getTasks',
}

const getTaskList = async (data: TaskReqParams) => post<any>({ url: URL.getTasks, data });
export { getTaskList };
