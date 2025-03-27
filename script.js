// 检查marked库的版本和初始化方式
if (typeof marked === 'function') {
    // 旧版本的marked是一个函数
    marked.setOptions({
        gfm: true, // 启用GitHub风格的Markdown
        breaks: true, // 将回车转换为<br>
        sanitize: false, // 不进行HTML标签过滤
        smartLists: true, // 使用更智能的列表行为
        smartypants: true, // 使用更漂亮的标点符号
        highlight: function(code, lang) {
            // 如果需要代码高亮可以在此扩展
            return code;
        }
    });
    console.log('使用旧版本marked库初始化完成');
} else if (typeof marked === 'object' && typeof marked.parse === 'function') {
    // 新版本的marked是一个带有parse方法的对象
    marked.setOptions({
        gfm: true,
        breaks: true,
        sanitize: false,
        smartLists: true,
        smartypants: true,
        highlight: function(code, lang) {
            return code;
        }
    });
    console.log('使用新版本marked库初始化完成');
} else {
    console.error('marked库加载失败或不兼容');
}

// 添加全局错误处理器，捕获可能的错误
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.message, e.filename, e.lineno, e.colno, e.error);
});

console.log('Marked.js已初始化');

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，初始化应用...');
    
    // 获取DOM元素
    const markdownInput = document.getElementById('markdown-input');
    const previewContent = document.getElementById('preview-content');
    // 移除按钮相关的DOM变量，但保留这些变量名以避免后续代码报错
    const saveBtn = null;
    const previewBtn = null;
    const downloadBtn = null;
    const editorPanel = document.querySelector('.editor-panel');
    const previewPanel = document.querySelector('.preview-panel');
    
    // 调试信息：检查DOM元素是否正确获取
    console.log('检查DOM元素：', {
        markdownInput: markdownInput ? '已获取' : '未找到',
        previewContent: previewContent ? '已获取' : '未找到',
        editorPanel: editorPanel ? '已获取' : '未找到',
        previewPanel: previewPanel ? '已获取' : '未找到'
    });
    
    // 确保预览面板可见
    if (previewPanel) {
        previewPanel.style.visibility = 'visible';
        previewPanel.style.opacity = '1';
        console.log('已设置预览面板为可见');
    }
    
    // 确保预览内容容器可见
    if (previewContent) {
        previewContent.style.visibility = 'visible';
        previewContent.style.opacity = '1';
        console.log('已设置预览内容容器为可见');
    }
    
    // 示例Markdown内容
    const exampleMarkdown = `# Markdown 示例

这是一个 **Markdown** 格式的示例文档。

## 文本格式

*斜体文本* 和 **粗体文本**

~~删除线~~ 和 __下划线__

## 列表

无序列表:
- 项目 1
- 项目 2
  - 子项目 A
  - 子项目 B

有序列表:
1. 第一项
2. 第二项
3. 第三项

## 链接和图片

[Markdown.com.cn](https://www.markdown.com.cn)

![图片示例](https://www.markdown.com.cn/assets/img/philly-magic-garden.9c0b4415.jpg)

## 代码

行内代码 \`console.log('Hello World')\`

代码块:
\`\`\`javascript
function sayHello() {
  console.log("Hello, world!");
}
\`\`\`

## 表格

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |

## 引用

> 这是一段引用文本。
> 
> 这是引用的第二行。

## 分隔线

---

## 数学公式

行内公式: $E=mc^2$

行间公式:

$$
\\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}
$$
`;

    // 加载内容：优先使用本地存储，如没有则显示示例
    const savedContent = localStorage.getItem('savedMarkdown');
    
    // 检查查询字符串中是否有清除缓存的参数
    const urlParams = new URLSearchParams(window.location.search);
    const clearCache = urlParams.get('clearCache');
    
    if (clearCache === 'true') {
        // 如果URL参数要求清除缓存，则删除存储并加载示例
        localStorage.removeItem('savedMarkdown');
        markdownInput.value = exampleMarkdown;
        console.log('通过URL参数清除了缓存');
    } else if (savedContent && savedContent.trim().length > 0) {
        // 尝试从本地存储加载保存的内容
        markdownInput.value = savedContent;
        console.log('从localStorage加载了上次的内容');
    } else {
        // 没有保存的内容或内容为空，则显示示例
        markdownInput.value = exampleMarkdown;
        console.log('加载了示例内容');
    }
    
    // 自定义渲染器，支持更多的Markdown特性
    let renderer;
    try {
        if (typeof marked === 'function') {
            // 旧版本的marked
            renderer = new marked.Renderer();
        } else if (typeof marked === 'object' && typeof marked.Renderer === 'function') {
            // 新版本的marked
            renderer = new marked.Renderer();
        } else {
            throw new Error('无法创建marked渲染器');
        }
        
        // 修改表格渲染，添加Bootstrap样式
        renderer.table = function(header, body) {
            return '<table class="table table-bordered">\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + '<tbody>\n'
                + body
                + '</tbody>\n'
                + '</table>\n';
        };
        
        // 修改代码块渲染，添加语言类
        renderer.code = function(code, language) {
            return '<pre><code class="language-' + language + '">'
                + code
                + '</code></pre>';
        };
        
        // 设置渲染器选项
        if (typeof marked.setOptions === 'function') {
            marked.setOptions({
                renderer: renderer
            });
            console.log('成功设置marked渲染器选项');
        } else {
            console.warn('无法设置marked渲染器选项，将使用默认渲染');
        }
    } catch (err) {
        console.error('初始化渲染器失败:', err);
    }
    
    // 渲染Markdown函数
    window.renderMarkdown = function() {
        try {
            console.log('开始渲染Markdown...');
            const markdownText = markdownInput.value;
            
            if (!markdownText) {
                console.log('Markdown文本为空，清空预览区域');
                previewContent.innerHTML = '';
                return;
            }
            
            if (typeof marked === 'undefined') {
                console.error('marked库未加载，无法渲染Markdown');
                previewContent.innerHTML = '<div class="error-message">Markdown渲染失败: marked库不可用或格式不正确</div>';
                return;
            }
            
            // 根据marked库的版本使用不同的渲染方法
            let htmlContent;
            try {
                if (typeof marked === 'function') {
                    // 旧版本的marked
                    htmlContent = marked(markdownText);
                    console.log('使用旧版本marked库渲染完成');
                } else if (typeof marked === 'object' && typeof marked.parse === 'function') {
                    // 新版本的marked
                    htmlContent = marked.parse(markdownText);
                    console.log('使用新版本marked库渲染完成');
                } else {
                    throw new Error('marked库格式不正确');
                }
                
                previewContent.innerHTML = htmlContent;
                console.log('Markdown渲染成功');
                
                // 触发MathJax重新渲染数学公式
                if (typeof MathJax !== 'undefined' && typeof MathJax.typesetPromise === 'function') {
                    MathJax.typesetPromise([previewContent]).catch(function(err) {
                        console.error('MathJax渲染错误:', err);
                    });
                    console.log('MathJax公式渲染完成');
                } else {
                    console.warn('MathJax不可用，公式不会被渲染');
                }
            } catch (error) {
                console.error('Markdown渲染过程中出错:', error);
                previewContent.innerHTML = '<div class="error-message">Markdown渲染失败: ' + error.message + '</div>';
            }
        } catch (e) {
            console.error('渲染Markdown时发生错误:', e);
            if (previewContent) {
                previewContent.innerHTML = '<div class="error-message">Markdown渲染失败: ' + e.message + '</div>';
            }
        }
    };
    
    // 初始化完成后，立即渲染一次Markdown
    // 如果marked已加载完成，直接渲染；否则等待marked加载完成
    if (typeof marked !== 'undefined') {
        renderMarkdown();
    }
    
    // 监听输入变化，自动保存内容到localStorage
    if (markdownInput) {
        markdownInput.addEventListener('input', debounce(function() {
            // 自动保存当前内容到localStorage
            if (markdownInput.value.trim().length > 0) {
                localStorage.setItem('savedMarkdown', markdownInput.value);
                console.log('内容已自动保存到localStorage');
            }
            // 调用渲染函数
            renderMarkdown();
        }, 300));
        console.log('已添加Markdown输入监听事件');
    }
    
    // 添加清除缓存功能，可通过JavaScript API调用
    window.clearMarkdownCache = function() {
        localStorage.removeItem('savedMarkdown');
        markdownInput.value = exampleMarkdown;
        renderMarkdown();
        console.log('已清除Markdown缓存并重置为示例内容');
    };

    // 添加关闭窗口前的事件监听，可以在关闭前保存最终状态
    window.addEventListener('beforeunload', function() {
        // 可以在此处添加关闭前的保存逻辑，但这里我们选择不做任何操作，
        // 因为应用将在关闭时自动清除缓存
        console.log('窗口即将关闭');
    });
    
    // 设置滚动同步功能
    console.log('正在初始化滚动同步功能...');
    
    // 确保DOM元素存在
    if (!markdownInput || !previewPanel) {
        console.error('无法找到编辑区或预览区DOM元素');
        return;
    }
    
    let isEditorScrolling = false;
    let isPreviewScrolling = false;
    
    // 编辑区滚动事件 - 直接监听textarea元素
    markdownInput.addEventListener('scroll', function() {
        if (isPreviewScrolling) return; // 如果预览区正在滚动，不处理此事件避免循环
        
        isEditorScrolling = true;
        console.log('编辑区滚动中...', markdownInput.scrollTop);
        
        // 计算滚动百分比
        const scrollPercentage = markdownInput.scrollTop / (markdownInput.scrollHeight - markdownInput.clientHeight || 1);
        
        // 预览区设置相同的滚动百分比位置
        previewPanel.scrollTop = scrollPercentage * (previewPanel.scrollHeight - previewPanel.clientHeight || 1);
        
        // 使用setTimeout确保事件处理完成后才重置标志
        setTimeout(() => {
            isEditorScrolling = false;
        }, 50);
    });
    
    // 预览区滚动事件
    previewPanel.addEventListener('scroll', function() {
        if (isEditorScrolling) return; // 如果编辑区正在滚动，不处理此事件避免循环
        
        isPreviewScrolling = true;
        console.log('预览区滚动中...', previewPanel.scrollTop);
        
        // 计算滚动百分比
        const scrollPercentage = previewPanel.scrollTop / (previewPanel.scrollHeight - previewPanel.clientHeight || 1);
        
        // 编辑区设置相同的滚动百分比位置
        markdownInput.scrollTop = scrollPercentage * (markdownInput.scrollHeight - markdownInput.clientHeight || 1);
        
        // 使用setTimeout确保事件处理完成后才重置标志
        setTimeout(() => {
            isPreviewScrolling = false;
        }, 50);
    });
    
    console.log('滚动同步功能初始化完成');
});

// 防抖函数，避免过于频繁的渲染
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
} 