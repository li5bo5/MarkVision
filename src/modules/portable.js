/**
 * 便携式模式支持模块
 */

let isPortableMode = false;
let dataDir = '';

/**
 * 初始化便携式模式检测
 */
export async function initPortableMode() {
  // 只有在Tauri环境下才需要检测便携式模式
  if (window.__TAURI__) {
    try {
      // 检查是否为便携式模式
      isPortableMode = await window.__TAURI__.invoke('check_portable_mode');
      console.log('便携式模式:', isPortableMode ? '启用' : '禁用');

      // 获取数据目录路径
      dataDir = await window.__TAURI__.invoke('get_data_dir');
      console.log('数据目录:', dataDir);
    } catch (error) {
      console.error('便携式模式检测失败:', error);
    }
  }
}

/**
 * 检查当前是否处于便携式模式
 * @returns {boolean} 是否为便携式模式
 */
export function isPortable() {
  return isPortableMode;
}

/**
 * 获取数据存储目录
 * @returns {string} 数据目录路径
 */
export function getDataDirectory() {
  return dataDir;
}

/**
 * 获取文件的完整存储路径
 * @param {string} filename 文件名
 * @returns {string} 完整文件路径
 */
export function getFilePath(filename) {
  if (!dataDir || !isPortableMode) {
    return filename;
  }
  
  // 使用便携式路径
  const { join } = window.__TAURI__.path;
  return join(dataDir, filename);
}

/**
 * 获取应用程序的运行模式描述
 * @returns {string} 运行模式描述
 */
export function getModeDescription() {
  return isPortableMode 
    ? '便携模式 (配置和数据存储在程序目录)' 
    : '标准模式 (配置和数据存储在用户目录)';
} 