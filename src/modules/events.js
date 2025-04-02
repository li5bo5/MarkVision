import { renderMarkdown } from './renderer.js';
import { openMarkdownFile } from './file.js';
import SyncScroll from './SyncScroll.js';

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 初始化所有事件监听
 */
export function initEvents() {
  const markdownInput = document.getElementById('markdown-input');
  const previewContent = document.getElementById('preview-content');
  const editorPanel = document.querySelector('.editor-panel');
  const previewPanel = document.querySelector('.preview-panel');
  
  // 按钮元素
  const openBtn = document.getElementById('open-btn');
  
  // 状态栏元素
  const wordCount = document.getElementById('word-count');
  
  // 滚动同步相关变量
  let unsavedChanges = false;
  
  // 创建滚动条占位元素
  const editorScrollbarPlaceholder = document.createElement('div');
  editorScrollbarPlaceholder.className = 'scrollbar-placeholder';
  editorScrollbarPlaceholder.style.display = 'none';
  
  const previewScrollbarPlaceholder = document.createElement('div');
  previewScrollbarPlaceholder.className = 'scrollbar-placeholder';
  previewScrollbarPlaceholder.style.display = 'none';
  
  // 将占位元素添加到面板
  editorPanel.appendChild(editorScrollbarPlaceholder);
  previewPanel.appendChild(previewScrollbarPlaceholder);
  
  // 检测水平滚动条并同步占位
  function checkHorizontalScrollbars() {
    // 检查编辑器是否有水平滚动条
    const editorHasScrollbar = markdownInput.scrollWidth > markdownInput.clientWidth;
    // 检查预览区是否有水平滚动条
    const previewHasScrollbar = previewContent.scrollWidth > previewContent.clientWidth;
    
    console.log(`编辑器滚动条: ${editorHasScrollbar}, 预览区滚动条: ${previewHasScrollbar}`);
    
    if (editorHasScrollbar && !previewHasScrollbar) {
      // 编辑器有水平滚动条，预览区没有，添加占位
      previewScrollbarPlaceholder.style.display = 'block';
      editorScrollbarPlaceholder.style.display = 'none';
    } else if (!editorHasScrollbar && previewHasScrollbar) {
      // 预览区有水平滚动条，编辑器没有，添加占位
      editorScrollbarPlaceholder.style.display = 'block';
      previewScrollbarPlaceholder.style.display = 'none';
    } else {
      // 两侧都有或都没有，不需要占位
      editorScrollbarPlaceholder.style.display = 'none';
      previewScrollbarPlaceholder.style.display = 'none';
    }
  }
  
  // 监听内容变化，检查水平滚动条
  const resizeObserver = new ResizeObserver(debounce(checkHorizontalScrollbars, 100));
  resizeObserver.observe(markdownInput);
  resizeObserver.observe(previewContent);
  
  // 监听滚动事件，可能会显示/隐藏滚动条
  markdownInput.addEventListener('scroll', debounce(checkHorizontalScrollbars, 100));
  previewContent.addEventListener('scroll', debounce(checkHorizontalScrollbars, 100));
  
  // 窗口大小改变时检查水平滚动条
  window.addEventListener('resize', debounce(checkHorizontalScrollbars, 200));
  
  // 初始检查
  setTimeout(checkHorizontalScrollbars, 500);
  
  // 更新字数统计
  function updateWordCount() {
    const text = markdownInput.value;
    const charCount = text.length;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    document.getElementById('word-count').textContent = `${charCount} 字符 | ${wordCount} 单词`;
  }
  
  // 初始化同步滚动
  let syncScroll = null;
  
  // 输入事件监听
  markdownInput.addEventListener('input', debounce(() => {
    const content = markdownInput.value;
    
    // 保存到本地存储
    localStorage.setItem('markdownContent', content);
    
    // 标记有未保存的更改
    unsavedChanges = true;
    
    // 更新字数统计
    updateWordCount();
    
    // 渲染 Markdown
    renderMarkdown();
    
    // 延迟创建同步滚动实例，确保 DOM 已更新
    setTimeout(() => {
      if (!syncScroll) {
        // 初始化同步滚动
        syncScroll = new SyncScroll(markdownInput, previewContent);
      }
    }, 100);
  }, 300));
  
  // 文件导入事件
  openBtn.addEventListener('click', async () => {
    try {
      if (unsavedChanges) {
        const confirm = window.confirm('当前有未保存的更改，确定要打开新文件吗？');
        if (!confirm) return;
      }
      
      const content = await openMarkdownFile();
      if (content !== null) {
        markdownInput.value = content;
        // 触发 input 事件以更新预览
        markdownInput.dispatchEvent(new Event('input'));
        unsavedChanges = false;
      }
    } catch (error) {
      console.error('打开文件失败:', error);
      alert(`打开文件失败: ${error.message}`);
    }
  });
  
  // 关闭窗口前确认
  window.addEventListener('beforeunload', (event) => {
    if (unsavedChanges) {
      // 标准的关闭确认信息
      event.preventDefault();
      event.returnValue = '有未保存的更改，确定要离开吗？';
      return event.returnValue;
    }
  });
  
  // 首次加载时更新字数统计
  updateWordCount();
}

// 导出默认对象
export default {
  initEvents
};