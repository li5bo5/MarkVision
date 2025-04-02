import { marked } from 'marked';
import hljs from 'highlight.js';
import SyncScroll from './SyncScroll.js';
import MarkdownParser from '../../MarkdownParser.js';

// Instantiate MarkdownParser with the imported marked instance
const markdownParser = new MarkdownParser(marked);

// 用于存储被保护的公式
let protectedBlockMath = [];
let protectedInlineMath = [];

/**
 * 设置 Markdown 渲染器
 */
export function setupMarkdownRenderer() {
  const markdownInput = document.getElementById('markdown-input');
  const previewContent = document.getElementById('preview-content');
  
  // 确保元素存在
  if (!markdownInput || !previewContent) {
    console.error('找不到必要的 DOM 元素');
    return;
  }
  
  // 初始化同步滚动
  let syncScroll = null;
  
  // 监听输入变化，渲染预览
  markdownInput.addEventListener('input', () => {
    renderMarkdown();
  
    // 如果同步滚动实例不存在，则创建
    // 延迟创建，确保 DOM 结构已更新
    setTimeout(() => {
      // Simplified check: just need previewContent
      if (!syncScroll && previewContent.innerHTML) {
        syncScroll = new SyncScroll(markdownInput, previewContent);
      }
    }, 100); // 延迟 100ms
  });
  
  // Initial render on load (optional but good practice)
  renderMarkdown();
}

/**
 * 渲染 Markdown 内容为 HTML
 */
export function renderMarkdown() {
  const markdownInput = document.getElementById('markdown-input');
  const previewContent = document.getElementById('preview-content');
  
  if (!markdownInput || !previewContent) return;
  
  let markdown = markdownInput.value;
  
  // 1. 保护公式
  markdown = protectMathFormulas(markdown);
  
  let html = '';
  
  // Use the instantiated markdownParser directly
  try {
    // 创建临时容器，将 Markdown 文本按行分割并转换为 DOM 元素
    const tempContainer = document.createElement('div');
    const lines = markdown.split('\n');
    
    // 为每行创建带 data-index 的 DOM 元素
    lines.forEach((line, index) => {
      const lineElement = document.createElement('div');
      lineElement.textContent = line;
      lineElement.dataset.index = index;
      tempContainer.appendChild(lineElement);
    });
    
    // 2. 使用 MarkdownParser 解析 (处理占位符)
    html = markdownParser.compile(tempContainer.childNodes);
    
    // 3. 恢复公式
    html = restoreMathFormulas(html);
    
    previewContent.innerHTML = html;
    
    // 处理代码高亮
    processCodeBlocks();
    
    // 处理数学公式
    if (window.MathJax) {
      window.MathJax.typesetPromise && window.MathJax.typesetPromise([previewContent]).catch(err => console.error('MathJax typesetting error:', err));
    }
    
    // console.log('使用 MarkdownParser 渲染完成'); // Keep log if needed
  } catch (error) {
    // Log error if parsing fails, but don't fallback
    console.error('Markdown 渲染失败:', error);
    // Display error in preview area
    previewContent.innerHTML = `<pre style="color: red;">Markdown 渲染出错:\n${error}\n\n原始 Markdown:\n${markdownInput.value}</pre>`;
  }
}

/**
 * 保护数学公式不被Markdown解析
 * @param {string} text - 输入的 Markdown 文本
 * @returns {string} - 将公式替换为占位符后的文本
 */
function protectMathFormulas(text) {
  protectedBlockMath = [];
  protectedInlineMath = [];
  
  // 替换块级公式 $$...$$ 和 \[...\]
  let processedText = text.replace(/(\$\$|\\\[)([\s\S]*?)(\$\$|\\\])/g, (match, open, formula, close) => {
    const id = protectedBlockMath.length;
    protectedBlockMath.push(formula);
    // 使用 HTML 注释作为占位符
    return `<!-- MATH_BLOCK_${id} -->`;
  });

  // 替换行内公式 $...$ 和 \(...\)
  // 增强正则，避免匹配代码块内的 `$`
  processedText = processedText.replace(/(^|[^`])(?:(\$|\\\()([^$`\n][\s\S]*?[^$`\n])(\$|\\\)))/g, (match, prefix, open, formula, close) => {
    // 检查是否是 \$ 或 \\(
    if (match.startsWith('\\$') || match.startsWith('\\\\(')) {
        return match; // 如果是转义的，则不处理
    }
    const id = protectedInlineMath.length;
    protectedInlineMath.push(formula);
    // 将前面的非 ` 字符加回去，并使用 HTML 注释作为占位符
    return `${prefix}<!-- MATH_INLINE_${id} -->`;
  });

  return processedText;
}

/**
 * 恢复 HTML 中的数学公式
 * @param {string} html - 包含占位符的 HTML
 * @returns {string} - 恢复公式后的 HTML
 */
function restoreMathFormulas(html) {
  // 恢复块级公式 - 匹配 HTML 注释占位符
  let processedHtml = html.replace(/<!--\s*MATH_BLOCK_(\d+)\s*-->/g, (match, id) => {
    const formula = protectedBlockMath[parseInt(id)];
    // 使用 MathJax 能识别的块级定界符
    return `\\[${formula}\\]`; 
  });

  // 恢复行内公式 - 匹配 HTML 注释占位符
  processedHtml = processedHtml.replace(/<!--\s*MATH_INLINE_(\d+)\s*-->/g, (match, id) => {
    const formula = protectedInlineMath[parseInt(id)];
    // 使用 MathJax 能识别的行内定界符
    return `\\(${formula}\\)`;
  });

  // 移除之前的调试日志
  // console.log('HTML after restoring formulas:', processedHtml);

  return processedHtml;
}

/**
 * 处理代码块高亮
 */
function processCodeBlocks() {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

// 导出 ESM 兼容的默认导出
export default {
  setupMarkdownRenderer,
  renderMarkdown
};