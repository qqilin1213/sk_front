/*
 * @Author: qqilin1213
 * @Date: 2024-06-14 15:18:40
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-24 21:41:05
 */
export interface RequestOptions {
  // Whether to process the request result
  isTransformResponse?: boolean;
}

// 返回res.data的interface
export interface IResponse<T = any> {
  result: T;
  code: string;
  info: string;
  gameCode: string;
  gameInfo: string;
}