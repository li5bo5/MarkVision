import { renderMarkdown } from './renderer.js';
import { saveMarkdownToFile, exportToPDF, openMarkdownFile } from './file.js';

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
  const exportPdfBtn = document.getElementById('export-pdf-btn');
  const clearBtn = document.getElementById('clear-btn');
  
  // 状态栏元素
  const wordCount = document.getElementById('word-count');
  const saveStatus = document.getElementById('save-status');
  
  // 滚动同步相关变量
  let isScrolling = false;
  let isSyncEnabled = true;
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
  
  // 标记有未保存的更改
  function markUnsaved() {
    unsavedChanges = true;
    saveStatus.textContent = '未保存';
  }
  
  // 标记已保存
  function markSaved() {
    unsavedChanges = false;
    saveStatus.textContent = '已保存';
    setTimeout(() => {
      saveStatus.textContent = '';
    }, 2000);
  }
  
  // 根据映射关系获取对应的滚动位置
  function getCorrespondingPosition(sourcePos, sourceType) {
    // 使用百分比同步
    if (sourceType === 'editor') {
      const editorScrollable = markdownInput.scrollHeight - markdownInput.clientHeight;
      const previewScrollable = previewContent.scrollHeight - previewContent.clientHeight;
      if (editorScrollable <= 0 || previewScrollable <= 0) return 0;
      
      const scrollPercentage = sourcePos / editorScrollable;
      return scrollPercentage * previewScrollable;
    } else {
      const editorScrollable = markdownInput.scrollHeight - markdownInput.clientHeight;
      const previewScrollable = previewContent.scrollHeight - previewContent.clientHeight;
      if (editorScrollable <= 0 || previewScrollable <= 0) return 0;
      
      const scrollPercentage = sourcePos / previewScrollable;
      return scrollPercentage * editorScrollable;
    }
  }
  
  // Markdown输入更新
  markdownInput.addEventListener('input', debounce(function() {
    const markdown = this.value;
    renderMarkdown(markdown, previewContent);
    
    // 保存到localStorage
    localStorage.setItem('markdownContent', markdown);
    
    // 更新字数统计
    updateWordCount();
    
    // 标记未保存
    markUnsaved();
  }, 300));
  
  // 监听渲染完成事件
  document.addEventListener('renderComplete', (event) => {
    // 渲染完成后检查水平滚动条
    setTimeout(checkHorizontalScrollbars, 100);
    console.log('渲染完成');
  });
  
  // 编辑器滚动同步到预览
  markdownInput.addEventListener('scroll', function() {
    if (isScrolling || !isSyncEnabled) return;
    
    isScrolling = true;
    const previewScrollTop = getCorrespondingPosition(this.scrollTop, 'editor');
    previewContent.scrollTop = previewScrollTop;
    
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  });
  
  // 预览滚动同步到编辑器
  previewContent.addEventListener('scroll', function() {
    if (isScrolling || !isSyncEnabled) return;
    
    isScrolling = true;
    const editorScrollTop = getCorrespondingPosition(this.scrollTop, 'preview');
    markdownInput.scrollTop = editorScrollTop;
    
    setTimeout(() => {
      isScrolling = false;
    }, 100);
  });
  
  // 打开文件
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (unsavedChanges && !confirm('您有未保存的更改，确定要打开其他文件吗？')) {
        return;
      }
      openMarkdownFile((content) => {
        markdownInput.value = content;
        renderMarkdown(content, previewContent);
        updateWordCount();
        localStorage.setItem('markdownContent', content);
        markUnsaved();
      });
    });
  }
  
  // 导出PDF
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      exportToPDF(previewContent);
    });
  }
  
  // 清空按钮
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (markdownInput.value.trim() === '' || confirm('确定要清空当前内容吗？')) {
        markdownInput.value = '';
        renderMarkdown('', previewContent);
        updateWordCount();
        localStorage.removeItem('markdownContent');
        markUnsaved();
      }
    });
  }
  
  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    // Tab缩进处理
    if (e.key === 'Tab') {
      e.preventDefault();
      // 在列表中增加缩进功能
      const cursorPos = markdownInput.selectionStart;
      const lineStart = markdownInput.value.lastIndexOf('\n', cursorPos - 1) + 1;
      const currentLine = markdownInput.value.substring(lineStart, cursorPos);
      
      // 检查是否在列表项中
      if (/^(\s*)([-*+]|\d+\.)\s/.test(currentLine)) {
        const beforeCursor = markdownInput.value.substring(0, lineStart);
        const afterCursor = markdownInput.value.substring(lineStart);
        
        if (e.shiftKey) {
          // 减少缩进
          if (afterCursor.startsWith('  ')) {
            // 删除两个空格
            markdownInput.value = beforeCursor + afterCursor.substring(2);
            markdownInput.selectionStart = markdownInput.selectionEnd = cursorPos - 2;
          }
        } else {
          // 增加缩进
          markdownInput.value = beforeCursor + '  ' + afterCursor;
          markdownInput.selectionStart = markdownInput.selectionEnd = cursorPos + 2;
        }
        // 触发内容更新
        markdownInput.dispatchEvent(new Event('input'));
      } else {
        // 常规Tab行为 - 插入两个空格
        const beforeCursor = markdownInput.value.substring(0, cursorPos);
        const afterCursor = markdownInput.value.substring(cursorPos);
        markdownInput.value = beforeCursor + '  ' + afterCursor;
        markdownInput.selectionStart = markdownInput.selectionEnd = cursorPos + 2;
        markdownInput.dispatchEvent(new Event('input'));
      }
    }
  });
  
  // 初始化字数统计
  updateWordCount();
  
  // 初始加载文档内容
  const savedContent = localStorage.getItem('markdownContent');
  if (savedContent) {
    markdownInput.value = savedContent;
    renderMarkdown(savedContent, previewContent);
    updateWordCount();
  }
}