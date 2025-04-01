import { marked } from 'marked';
import hljs from 'highlight.js';
import { initUI } from './modules/ui.js';
import { initEvents } from './modules/events.js';
import { setupMarkdownRenderer } from './modules/renderer.js';
import { initStorage } from './modules/storage.js';
import { initPortableMode } from './modules/portable.js';

// 初始化代码高亮
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// 应用初始化
document.addEventListener('DOMContentLoaded', async () => {
  // 初始化便携式模式检测
  await initPortableMode();
  
  // 初始化UI
  initUI();
  
  // 设置Markdown渲染器
  setupMarkdownRenderer();
  
  // 初始化事件处理
  initEvents();
  
  // 初始化存储
  initStorage();
  
  // 添加示例内容
  const exampleContent = localStorage.getItem('markdownContent') || getExampleContent();
  document.getElementById('markdown-input').value = exampleContent;
  
  // 触发初始预览
  document.getElementById('markdown-input').dispatchEvent(new Event('input'));
});

// 示例Markdown内容
function getExampleContent() {
  return `# MarkVision

## 欢迎使用MarkVision

这是一个简单易用的**Markdown**预览工具。

### 功能特点

- 实时预览
- 滚动同步
- 代码高亮
- 导出PDF
- 便携模式支持

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, MarkVision!");
}
\`\`\`

### 表格示例

| 功能 | 支持情况 |
|------|----------|
| 实时预览 | ✅ |
| 滚动同步 | ✅ |
| 代码高亮 | ✅ |
| 导出PDF | ✅ |
| 便携模式 | ✅ |

### 数学公式

行内公式: $E=mc^2$

块级公式:

$$
\\frac{d}{dx}\\left( \\int_{a}^{x} f(u)\\,du\\right)=f(x)
$$

> 开始使用MarkVision，享受高效的Markdown编辑体验！
`;
}