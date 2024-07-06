/*
 * @Author: qqilin1213
 * @Date: 2024-07-04 14:48:12
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-04 14:48:13
 */
// src/utils/IndexedDBInterface.ts
import IndexedDBHelper from './IndexedDBHelper';

const IndexedDBInterface = {
  async saveData(key: string, data: any): Promise<void> {
    try {
      await IndexedDBHelper.setItem(key, data);
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  },

  async getData<T>(key: string): Promise<T | undefined> {
    try {
      return await IndexedDBHelper.getItem<T>(key);
    } catch (error) {
      console.error('Failed to get data:', error);
      throw error;
    }
  },

  async removeData(key: string): Promise<void> {
    try {
      await IndexedDBHelper.removeItem(key);
    } catch (error) {
      console.error('Failed to remove data:', error);
      throw error;
    }
  },
};

export default IndexedDBInterface;
