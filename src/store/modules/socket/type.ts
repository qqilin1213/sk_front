/*
 * @Author: qqilin1213
 * @Date: 2024-06-26 09:31:28
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-26 09:31:29
 */
export type SocketStore = {
  // 连接状态
  isConnected: boolean;
  // 消息内容
  message: string;
  // 重新连接错误
  reconnectError: boolean;
  // 心跳消息发送时间
  heartBeatInterval: number;
  // 心跳定时器
  heartBeatTimer: number;
};