/*
 * @Author: qqilin1213
 * @Date: 2024-06-19 09:28:09
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-26 12:34:46
 */
export interface TaskReqParams {
  types: string;
  models: Array<string>;
  gameTypes: Array<string>;
  levels: Array<string>;
}

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
