import { marked } from 'marked';
import hljs from 'highlight.js';

/**
 * 设置Markdown渲染器
 */
export function setupMarkdownRenderer() {
  // 创建自定义渲染器
  const renderer = new marked.Renderer();
  
  // 自定义代码块渲染，添加行号
  renderer.code = function(code, language) {
    const validLang = !!(language && hljs.getLanguage(language));
    const highlighted = validLang ? hljs.highlight(code, { language }).value : hljs.highlightAuto(code).value;
    
    // 添加行号
    const lines = highlighted.split('\n');
    const lineNumbers = lines.map((_, index) => `<span class="line-number">${index + 1}</span>`).join('');
    
    return `<div class="code-block-wrapper">
              <div class="line-numbers">${lineNumbers}</div>
              <pre><code class="${language || ''}">${highlighted}</code></pre>
            </div>`;
  };
  
  // 自定义表格渲染
  renderer.table = function(header, body) {
    return `<table class="table">
              <thead>${header}</thead>
              <tbody>${body}</tbody>
            </table>`;
  };
  
  // 设置marked选项
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true
  });
}

/**
 * 渲染Markdown内容
 * @param {string} markdown - Markdown文本
 * @param {HTMLElement} targetElement - 目标DOM元素
 */
export function renderMarkdown(markdown, targetElement) {
  try {
    // 处理数学公式，防止被Markdown解析
    let processedData = protectMathFormulas(markdown);
    
    // 渲染Markdown - 确保传入的是文本而不是对象
    const html = marked(processedData.text);
    
    // 恢复数学公式并渲染
    const finalHtml = renderMathFormulas(html, processedData.blockMath, processedData.inlineMath);
    
    // 更新DOM
    targetElement.innerHTML = finalHtml;
    
    // 触发MathJax渲染（如果可用）
    if (window.MathJax) {
      if (typeof window.MathJax.typesetPromise === 'function') {
        // MathJax 3 API
        window.MathJax.typesetPromise([targetElement]).then(() => {
          // MathJax渲染完成后触发自定义事件
          const event = new CustomEvent('renderComplete', { detail: { targetElement } });
          document.dispatchEvent(event);
        }).catch((err) => {
          console.error('MathJax渲染错误:', err);
        });
      } else if (typeof window.MathJax.typeset === 'function') {
        // 某些版本的MathJax 3可能使用此API
        window.MathJax.typeset([targetElement]);
        // 触发渲染完成事件
        setTimeout(() => {
          const event = new CustomEvent('renderComplete', { detail: { targetElement } });
          document.dispatchEvent(event);
        }, 200);
      } else if (typeof window.MathJax.Hub !== 'undefined' && typeof window.MathJax.Hub.Queue === 'function') {
        // MathJax 2 API
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, targetElement]);
        window.MathJax.Hub.Queue(() => {
          // MathJax 2渲染完成后触发自定义事件
          const event = new CustomEvent('renderComplete', { detail: { targetElement } });
          document.dispatchEvent(event);
        });
      } else {
        console.warn("无法找到兼容的MathJax API");
        // 仍然触发事件，确保滚动映射更新
        setTimeout(() => {
          const event = new CustomEvent('renderComplete', { detail: { targetElement } });
          document.dispatchEvent(event);
        }, 200);
      }
    } else {
      // 没有MathJax时也触发渲染完成事件
      setTimeout(() => {
        const event = new CustomEvent('renderComplete', { detail: { targetElement } });
        document.dispatchEvent(event);
      }, 100);
    }
  } catch (error) {
    console.error('Markdown渲染失败:', error);
    targetElement.innerHTML = `<div class="error-message">Markdown渲染失败: ${error.message}</div>`;
    // 出错时也触发事件
    const event = new CustomEvent('renderComplete', { detail: { targetElement, error: true } });
    document.dispatchEvent(event);
  }
}

/**
 * 保护数学公式不被Markdown解析
 */
function protectMathFormulas(text) {
  // 使用占位符替换数学公式
  const blockMath = [];
  const inlineMath = [];
  
  // 替换块级公式 - 支持$$ ... $$ 和 \[ ... \] 格式
  let processedText = text.replace(/(\$\$|\\\[)([\s\S]*?)(\$\$|\\\])/g, (match, open, formula, close) => {
    const id = blockMath.length;
    blockMath.push(formula);
    return `BLOCK_MATH_${id}`;
  });
  
  // 替换行内公式 - 支持$ ... $ 和 \( ... \) 格式
  // 注意: 只匹配单行内的$...$，避免错误匹配
  processedText = processedText.replace(/(\$|\\\\)([^\n$\\]*?)(\$|\\\\)/g, (match, open, formula, close) => {
    // 排除单独的美元符号，比如价格
    if (open === '$' && close === '$') {
      // 检查前后是否有空格或者是行首行尾，避免误匹配货币符号
      const prevChar = match.charAt(0);
      const nextChar = match.charAt(match.length - 1);
      const isSpaceBefore = prevChar === ' ' || prevChar === '\t' || prevChar === '\n';
      const isSpaceAfter = nextChar === ' ' || nextChar === '\t' || nextChar === '\n';
      
      if (!isSpaceBefore && !isSpaceAfter) {
        return match; // 可能是货币符号，不处理
      }
    }
    
    const id = inlineMath.length;
    inlineMath.push(formula);
    return `INLINE_MATH_${id}`;
  });
  
  return {
    text: processedText,
    blockMath,
    inlineMath
  };
}

/**
 * 恢复数学公式并渲染
 * @param {string} html - 已渲染的HTML
 * @param {Array} blockMath - 块级数学公式
 * @param {Array} inlineMath - 行内数学公式
 */
function renderMathFormulas(html, blockMath, inlineMath) {
  // 恢复块级公式
  let processedHtml = html.replace(/BLOCK_MATH_(\d+)/g, (match, id) => {
    const formula = blockMath[parseInt(id)];
    return `<div class="math-block">$$${formula}$$</div>`;
  });
  
  // 恢复行内公式
  processedHtml = processedHtml.replace(/INLINE_MATH_(\d+)/g, (match, id) => {
    const formula = inlineMath[parseInt(id)];
    return `<span class="math-inline">$${formula}$</span>`;
  });
  
  return processedHtml;
}