# MarkVision

MarkVision是一个简洁高效的Markdown编辑与预览工具，提供实时渲染、数学公式支持和优雅的预览样式，模仿Markdown.com.cn的界面风格和功能。

## To Do

- 输出html
- 输出pdf
- 链接本地图片
- 其他
- 如果有其他建议，欢迎issue

## 功能特点

- 实时预览：在左侧编辑Markdown文本，右侧即时显示渲染效果
- 美观的预览样式：还原Markdown.com.cn的nice-sidebar-preview-type样式
- 支持丰富的Markdown语法：标题、列表、代码块、表格、引用等
- 数学公式支持：使用LaTeX语法，支持行内公式和块级公式
- 优化的渲染体验：代码行号、表格样式增强、链接新窗口打开等
- 本地存储：自动保存编辑内容到浏览器本地存储
- 文件导出：将Markdown内容下载为.md文件
- 响应式设计：适配桌面和移动设备

## 如何使用

### 1.下载源码

1. 下载该仓库内容
2. 直接在浏览器中打开`index.html`文件
3. 在左侧编辑区域输入或粘贴Markdown文本
4. 右侧预览区域会实时显示渲染后的HTML效果
5. 使用顶部工具栏按钮进行保存、预览或下载操作

### 2.下载可执行文件

1. 下载链接：https://li5bo5.lanzn.com/ihTWb2rskdpg
2. 解压，运行.exe文件

## 技术说明

- 使用纯HTML/CSS/JavaScript构建
- 使用[marked.js](https://marked.js.org/)库进行Markdown转换
- 使用[MathJax](https://www.mathjax.org/)库渲染数学公式
- 无需后端服务器，完全在浏览器中运行
- 自定义渲染器优化输出HTML效果

## 支持的Markdown语法

- 标题（#、##、###等）
- 文本格式（粗体、斜体、删除线等）
- 列表（有序和无序）
- 链接和图片
- 代码（行内和代码块）
- 表格
- 引用
- 水平线
- 数学公式（使用LaTeX语法）
  - 行内公式：`$E=mc^2$`
  - 块级公式：`$$\frac{d}{dx}(\int_{0}^{x} f(u)\,du)=f(x)$$`

## 参考实现

本工具的设计和样式参考了以下资源：
- [Markdown.com.cn](https://markdown.com.cn/editor/)官方编辑器
- 参考示例截图中的nice-sidebar-preview-type样式

## 本地开发

1. 克隆项目到本地
2. 用浏览器打开`index.html`文件
3. 修改`styles.css`调整样式
4. 修改`script.js`扩展功能

## 变更记录

查看[History.md](./History.md)获取详细变更记录。

## 许可证

MIT 