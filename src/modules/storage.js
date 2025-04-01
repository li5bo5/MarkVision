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