import { isPortable, getFilePath } from './portable.js';

/**
 * 初始化本地存储功能
 */
export function initStorage() {
  // 检查是否需要清除缓存
  const urlParams = new URLSearchParams(window.location.search);
  const shouldClearCache = urlParams.get('clearCache') === 'true';
  
  if (shouldClearCache) {
    clearCache();
  }
  
  // 为window对象添加清除缓存的API
  window.clearMarkdownCache = clearCache;
  
  // 添加应用关闭时自动清除缓存的选项（未来可通过设置启用/禁用）
  // window.addEventListener('beforeunload', () => {
  //   if (shouldAutoClearCache) {
  //     clearCache();
  //   }
  // });
}

/**
 * 清除缓存的Markdown内容
 */
export function clearCache() {
  localStorage.removeItem('markdownContent');
  console.log('缓存已清除');
}

/**
 * 获取存储路径
 * @param {string} filename 文件名
 * @returns {string} 存储路径
 */
export function getStoragePath(filename) {
  return isPortable() ? getFilePath(filename) : filename;
}

/**
 * 保存内容到文件
 * @param {string} filename 文件名
 * @param {string} content 文件内容
 * @returns {Promise<void>}
 */
export async function saveToFile(filename, content) {
  if (window.__TAURI__) {
    try {
      const { writeTextFile } = window.__TAURI__.fs;
      const path = getStoragePath(filename);
      await writeTextFile(path, content);
      return true;
    } catch (error) {
      console.error('保存文件失败:', error);
      return false;
    }
  }
  return false;
}

/**
 * 从文件读取内容
 * @param {string} filename 文件名
 * @returns {Promise<string>} 文件内容
 */
export async function readFromFile(filename) {
  if (window.__TAURI__) {
    try {
      const { readTextFile } = window.__TAURI__.fs;
      const path = getStoragePath(filename);
      return await readTextFile(path);
    } catch (error) {
      console.error('读取文件失败:', error);
      return null;
    }
  }
  return null;
}