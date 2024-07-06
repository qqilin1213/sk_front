/*
 * @Author: qqilin1213
 * @Date: 2024-06-26 11:35:59
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-06-29 12:15:40
 */
export type TaskState = {
  currentTask?:Task,
  tasks:Array<Task>,
};


export type Task = {
  taskId: string,
  type: string,
  typeInfo: string,
  subType: string,
  subTypeInfo: string,
  level: number,
  title: string,
  subTitle: string,
  createName: string,
  isChoose: boolean,
}