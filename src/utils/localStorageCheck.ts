/*
 * @Author: qqilin1213
 * @Date: 2024-07-04 13:22:24
 * @LastEditors: qqilin1213
 * @LastEditTime: 2024-07-04 13:25:09
 */
export function checkLocalStorage(): void {
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem('localStorage', '1');
      localStorage.removeItem('localStorage');
    } catch (e) {
      (Storage.prototype as any)._setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function () { };
      ElMessage.warning('您处于无痕浏览，无法为您保存');
    }
  }
  
}


// 检查用户代理字符串
export function checkIphoneSafari():void {
  const userAgent = navigator.userAgent;
  const isIphone = /iPhone/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/CriOS|Chrome/.test(userAgent);
  if (isIphone && isSafari) {
    ElMessage.warning('网站在Safari存在问题，请使用谷歌浏览器');
 }
};
