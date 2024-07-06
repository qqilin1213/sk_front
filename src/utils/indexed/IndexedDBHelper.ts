/*
 * @Author: qqilin1213
 * @Date: 2024-07-04 14:47:43
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-04 14:47:44
 */
// src/utils/IndexedDBHelper.ts
import { get, set, del } from 'idb-keyval';

class IndexedDBHelper {
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await set(key, value);
      console.log(`Data saved to IndexedDB with key: ${key}`);
    } catch (error) {
      console.error(`Failed to save data to IndexedDB with key: ${key}`, error);
      throw error; // 可以根据需要处理错误
    }
  }

  static async getItem<T>(key: string): Promise<T | undefined> {
    try {
      const value = await get<T>(key);
      console.log(`Data loaded from IndexedDB with key: ${key}`, value);
      return value;
    } catch (error) {
      console.error(`Failed to load data from IndexedDB with key: ${key}`, error);
      throw error; // 可以根据需要处理错误
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await del(key);
      console.log(`Data removed from IndexedDB with key: ${key}`);
    } catch (error) {
      console.error(`Failed to remove data from IndexedDB with key: ${key}`, error);
      throw error; // 可以根据需要处理错误
    }
  }
}

export default IndexedDBHelper;