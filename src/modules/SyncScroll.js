/**
 * 同步滚动管理类
 * 用于实现 Markdown 编辑器与预览区域之间的同步滚动功能
 * 基于 MarkdownParser 生成的带 data-index 属性的 HTML 元素进行精确同步
 */
class SyncScroll {
  /**
   * 初始化同步滚动功能
   * @param {HTMLElement} editor - Markdown 编辑区域元素
   * @param {HTMLElement} preview - 预览区域元素
   * @param {Object} options - 配置选项
   * @param {number} options.throttleTime - 滚动事件节流时间(ms)，默认 50ms
   * @param {number} options.offsetAdjustment - 滚动位置偏移量调整，默认 50px
   */
  constructor(editor, preview, options = {}) {
    this.editor = editor;
    this.preview = preview;
    
    // 配置项
    this.options = {
      throttleTime: options.throttleTime || 50,
      offsetAdjustment: options.offsetAdjustment || 50,
    };
    
    // 状态标记，防止滚动事件循环触发
    this.syncingEditor = false;
    this.syncingPreview = false;
    
    // 是否启用同步滚动
    this.isSyncEnabled = true;
    
    // 节流计时器
    this.scrollSyncTimer = null;
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化同步滚动
   */
  init() {
    // 绑定滚动事件
    this.bindEvents();
    
    // 初始同步一次
    this.syncPreviewFromEditor();
  }
  
  /**
   * 绑定事件监听
   */
  bindEvents() {
    // 编辑区滚动时同步预览区
    this.editor.addEventListener('scroll', this.throttle(this.handleEditorScroll.bind(this), this.options.throttleTime));
    
    // 预览区滚动时同步编辑区
    this.preview.addEventListener('scroll', this.throttle(this.handlePreviewScroll.bind(this), this.options.throttleTime));
  }
  
  /**
   * 处理编辑区滚动事件
   */
  handleEditorScroll() {
    // 如果滚动同步被禁用，或当前是由预览区触发的编辑区滚动，则不进行同步
    if (!this.isSyncEnabled || this.syncingEditor) {
      this.syncingEditor = false;
      return;
    }
    
    // 设置状态标记，防止循环触发
    this.syncingPreview = true;
    
    // 执行同步
    this.syncPreviewFromEditor();
    
    // 重置状态标记，延时确保滚动动画完成
    setTimeout(() => {
      this.syncingPreview = false;
    }, 100);
  }
  
  /**
   * 处理预览区滚动事件
   */
  handlePreviewScroll() {
    // 如果滚动同步被禁用，或当前是由编辑区触发的预览区滚动，则不进行同步
    if (!this.isSyncEnabled || this.syncingPreview) {
      this.syncingPreview = false;
      return;
    }
    
    // 设置状态标记，防止循环触发
    this.syncingEditor = true;
    
    // 执行同步
    this.syncEditorFromPreview();
    
    // 重置状态标记，延时确保滚动动画完成
    setTimeout(() => {
      this.syncingEditor = false;
    }, 100);
  }
  
  /**
   * 根据编辑区滚动位置同步预览区
   */
  syncPreviewFromEditor() {
    // 优先使用基于 data-index 的同步方法
    const syncResult = this.syncByDataIndex('editor-to-preview');
    
    // 如果基于 data-index 的同步失败（没有匹配的元素），则使用百分比同步
    if (!syncResult) {
      this.syncByPercentage('editor-to-preview');
    }
  }
  
  /**
   * 根据预览区滚动位置同步编辑区
   */
  syncEditorFromPreview() {
    // 优先使用基于 data-index 的同步方法
    const syncResult = this.syncByDataIndex('preview-to-editor');
    
    // 如果基于 data-index 的同步失败（没有匹配的元素），则使用百分比同步
    if (!syncResult) {
      this.syncByPercentage('preview-to-editor');
    }
  }
  
  /**
   * 基于 data-index 属性进行精确同步
   * @param {string} direction - 同步方向：'editor-to-preview' 或 'preview-to-editor'
   * @returns {boolean} - 同步是否成功
   */
  syncByDataIndex(direction) {
    if (direction === 'editor-to-preview') {
      // 获取编辑区当前可见的第一个元素的 data-index
      const editorElements = this.editor.querySelectorAll('[data-index]');
      if (editorElements.length === 0) return false;
      
      const viewportTop = this.editor.scrollTop;
      
      // 找到第一个可见的元素
      let targetElement = null;
      let targetIndex = null;
      
      for (const element of editorElements) {
        const elementTop = element.offsetTop;
        if (elementTop >= viewportTop) {
          targetElement = element;
          targetIndex = element.dataset.index;
          break;
        }
      }
      
      // 如果没找到可见元素，就取最接近的元素
      if (!targetElement && editorElements.length > 0) {
        let minDistance = Infinity;
        for (const element of editorElements) {
          const distance = Math.abs(element.offsetTop - viewportTop);
          if (distance < minDistance) {
            minDistance = distance;
            targetElement = element;
            targetIndex = element.dataset.index;
          }
        }
      }
      
      // 如果找到了对应索引，就在预览区查找并滚动
      if (targetIndex !== null) {
        const previewElement = this.preview.querySelector(`[data-index="${targetIndex}"]`);
        if (previewElement) {
          // 计算相对位置偏移
          const editorElementOffset = targetElement.offsetTop - viewportTop;
          const elementRelativePos = editorElementOffset / this.editor.clientHeight;
          
          // 设置预览区滚动位置，稍微偏移一点，提升用户体验
          this.preview.scrollTop = previewElement.offsetTop - (elementRelativePos * this.preview.clientHeight);
          return true;
        }
      }
    } else { // 'preview-to-editor'
      // 获取预览区当前可见的第一个元素的 data-index
      const previewElements = this.preview.querySelectorAll('[data-index]');
      if (previewElements.length === 0) return false;
      
      const viewportTop = this.preview.scrollTop;
      
      // 找到第一个可见的元素
      let targetElement = null;
      let targetIndex = null;
      
      for (const element of previewElements) {
        const elementTop = element.offsetTop;
        if (elementTop >= viewportTop) {
          targetElement = element;
          targetIndex = element.dataset.index;
          break;
        }
      }
      
      // 如果没找到可见元素，就取最接近的元素
      if (!targetElement && previewElements.length > 0) {
        let minDistance = Infinity;
        for (const element of previewElements) {
          const distance = Math.abs(element.offsetTop - viewportTop);
          if (distance < minDistance) {
            minDistance = distance;
            targetElement = element;
            targetIndex = element.dataset.index;
          }
        }
      }
      
      // 如果找到了对应索引，就在编辑区查找并滚动
      if (targetIndex !== null) {
        const editorElement = this.editor.querySelector(`[data-index="${targetIndex}"]`);
        if (editorElement) {
          // 计算相对位置偏移
          const previewElementOffset = targetElement.offsetTop - viewportTop;
          const elementRelativePos = previewElementOffset / this.preview.clientHeight;
          
          // 设置编辑区滚动位置，稍微偏移一点，提升用户体验
          this.editor.scrollTop = editorElement.offsetTop - (elementRelativePos * this.editor.clientHeight);
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * 基于滚动百分比进行同步（备用方法）
   * @param {string} direction - 同步方向：'editor-to-preview' 或 'preview-to-editor'
   */
  syncByPercentage(direction) {
    if (direction === 'editor-to-preview') {
      // 计算编辑区滚动比例
      const editorScrollRatio = this.editor.scrollTop / (this.editor.scrollHeight - this.editor.clientHeight || 1);
      
      // 根据比例设置预览区滚动位置
      const previewScrollTop = editorScrollRatio * (this.preview.scrollHeight - this.preview.clientHeight || 1);
      this.preview.scrollTop = previewScrollTop;
    } else { // 'preview-to-editor'
      // 计算预览区滚动比例
      const previewScrollRatio = this.preview.scrollTop / (this.preview.scrollHeight - this.preview.clientHeight || 1);
      
      // 根据比例设置编辑区滚动位置
      const editorScrollTop = previewScrollRatio * (this.editor.scrollHeight - this.editor.clientHeight || 1);
      this.editor.scrollTop = editorScrollTop;
    }
  }
  
  /**
   * 获取最近的可视元素
   * 在视窗中找到最接近中心位置的元素
   * @param {HTMLElement} container - 容器元素
   * @returns {HTMLElement|null} - 找到的最近元素
   */
  getNearestVisibleElement(container) {
    const elements = container.querySelectorAll('[data-index]');
    if (elements.length === 0) return null;
    
    const containerCenter = container.scrollTop + (container.clientHeight / 2);
    let nearestElement = null;
    let minDistance = Infinity;
    
    for (const element of elements) {
      const elementCenter = element.offsetTop + (element.offsetHeight / 2);
      const distance = Math.abs(elementCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestElement = element;
      }
    }
    
    return nearestElement;
  }
  
  /**
   * 启用同步滚动
   */
  enable() {
    this.isSyncEnabled = true;
  }
  
  /**
   * 禁用同步滚动
   */
  disable() {
    this.isSyncEnabled = false;
  }
  
  /**
   * 切换同步滚动状态
   * @returns {boolean} - 切换后的状态
   */
  toggle() {
    this.isSyncEnabled = !this.isSyncEnabled;
    return this.isSyncEnabled;
  }
  
  /**
   * 节流函数，限制函数的执行频率
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间间隔(ms)
   * @returns {Function} - 节流后的函数
   */
  throttle(func, wait) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= wait) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }
}

export default SyncScroll; 