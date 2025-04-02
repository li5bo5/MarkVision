# 项目变更记录

## [日期] v1.0

**发布内容：** 优化公式及字体的显示

**具体变更：**
- 修复了 MathJax 公式无法在预览区域正确渲染的问题。
- 修改了公式处理逻辑，使用 HTML 注释作为占位符，避免 Markdown 解析器干扰。
- 确保公式在 Markdown 解析后能被正确恢复并传递给 MathJax 处理。

## 24-03-28 #6 v1.0.0-initial

### 版本标记
- 将当前版本标记为初始版本 v1.0.0-initial
- 创建Git标签，方便将来回退到此版本
- 完成了基本功能开发，包括Markdown编辑与预览、滚动同步、单文件打包等功能

### 修复的文件
- package.json

### 变更内容
- 添加单文件可执行程序打包功能
- 修改electron-builder配置，使用portable模式创建单个exe文件
- 设置输出文件名为"MarkVision.exe"
- 添加npm脚本命令"portable"用于生成单文件可执行程序

## 24-03-28 #4 无版本号

### 修复的文件
- index.html

### 变更内容
- 删除了顶部标题栏中的"MarkVision"文本
- 保留了header区域的结构，只移除了显示的文本内容

## 24-03-28 #3 无版本号

### 修复的文件
- index.html

### 变更内容
- 修复了右侧预览内容不显示的问题
- 将bundle.js的引用路径从"bundle.js"修改为"./dist-web/bundle.js"
- 确保资源文件路径正确，使预览功能正常工作

## 23-03-28-1-ab4f23e

1. 使用现代模块管理工具重构项目
   - 采用ESM模块系统
   - 添加webpack打包支持
   - 拆分代码为模块化结构

2. 规范代码一致性
   - 统一命名规范
   - 添加JSDoc注释
   - 统一错误处理方式

3. 解决代码重复问题
   - 将功能封装为独立模块
   - 消除重复初始化代码
   - 优化资源加载策略

4. 添加错误处理机制
   - 实现错误弹窗通知系统
   - 统一错误处理流程
   - 添加全局错误监听

5. 实现PDF导出功能
   - 替换原来的HTML导出功能
   - 使用html2pdf.js库处理PDF生成
   - 优化导出内容布局

6. 解决全局作用域污染
   - 使用模块隔离功能代码
   - 减少全局变量使用
   - 通过预加载脚本实现进程间通信

# 变更记录

## 25-03-27#02
- 项目更名为MarkVision：
  - 将package.json中的项目名称从"markdown-preview-tool"改为"markvision"
  - 更新appId为"com.yourcompany.markvision"
  - 修改productName为"MarkVision"
  - 更新index.html中的页面标题和Logo显示
  - 更新README.md的标题和项目描述
  - 完善了项目的品牌标识
  - 为GitHub仓库提交准备，添加了.gitignore文件

## 25-03-27#01
- 成功将应用打包为可分发的格式：
  - 添加了icon.ico作为应用图标
  - 解决了中文路径下打包的问题，使用zip格式替代安装包
  - 配置了package.json的build选项，适应Electron打包需求
  - 完成了应用的离线打包，可以作为独立应用分发
  - 在dist目录生成了可分发的zip文件和解压后的应用程序

## 23-08-10#03
- 添加了清除缓存功能：
  - 在应用关闭时自动清除localStorage中保存的内容
  - 在菜单中添加"清除缓存"选项，可手动清除缓存
  - 增加了URL参数方式(?clearCache=true)清除缓存的支持
  - 优化了应用启动时的内容加载逻辑
  - 添加window.clearMarkdownCache()API，允许编程方式清除缓存
  - 添加了自动保存功能，实时保存编辑内容

## 23-08-10#02
- 修复了"Markdown渲染失败: marked库不可用或格式不正确"的问题：
  - 重构了marked库的加载和初始化逻辑
  - 添加了多层错误处理和备用方案
  - 改进了库加载失败时的用户提示
  - 增强了与Electron环境的兼容性
  - 添加了错误消息的样式美化
  - 修复了渲染函数的作用域问题

## 23-08-10#01
- 添加了Electron打包支持：
  - 创建了main.js作为Electron主进程入口文件
  - 配置了package.json文件支持打包
  - 修改了index.html以支持离线使用（本地资源引用）
  - 增加了assets目录用于存放本地库文件
  - 添加了自定义菜单和相关功能

## 清除缓存功能


## 23-08-09#01

- 修复了右侧渲染出错 "marked is not a function" 的问题：
  - 更新了marked.js的引入方式，使用固定版本4.3.0的CDN
  - 添加了备用CDN，在主CDN加载失败时自动尝试
  - 修改了代码以兼容不同版本的marked库
  - 改进了renderer的初始化方式，增加了错误处理
  - 重构了renderMarkdown函数，增强了兼容性和错误处理
  - 添加了更多的调试日志，方便追踪问题

## 23-08-08#01

- 修复了右侧预览内容消失的问题：
  - 为预览面板和预览内容容器添加了明确的可见性样式（visibility和opacity）
  - 添加了错误处理和调试信息，以便追踪渲染过程中的问题
  - 修复了媒体查询中的样式，确保在小屏幕上预览面板也能正确显示
  - 增加了预览面板和内容容器的最小高度，防止内容不可见
  - 优化了Markdown渲染过程，添加了更多的错误处理和日志记录
  - 添加了全局错误处理器，捕获可能的JavaScript错误

## 23-08-06#01

- 修复了滚动同步功能的问题：
  - 重构了script.js的代码结构，将所有初始化逻辑统一放在DOMContentLoaded事件中
  - 修正了滚动事件监听对象，从editorPanel改为直接监听markdownInput（textarea元素）
  - 优化了滚动同步算法，确保滚动百分比计算准确
  - 修改了styles.css中.editor-panel和#markdown-input的overflow属性，确保滚动条正常显示
  - 添加了更多调试信息，方便追踪滚动状态
  - 解决了初始化顺序问题，确保DOM元素加载完成后再绑定事件

## 23-08-05#01

- 添加了左右两侧同步滚动功能：
  - 当左侧编辑区滚动时，右侧预览区会同步滚动到对应位置
  - 当右侧预览区滚动时，左侧编辑区也会同步滚动
  - 采用百分比滚动算法，保证在内容长度不同的情况下也能保持位置对应
  - 通过防抖和锁定机制防止滚动循环触发

## 23-08-04#01

- 添加了数学公式渲染支持：
  - 集成MathJax库用于LaTeX公式渲染
  - 支持行内公式（$E=mc^2$）和块级公式（$$...$$）
  - 优化了公式处理逻辑，防止Markdown解析干扰
  - 添加了公式相关CSS样式
- 扩展了示例内容：
  - 添加了数学公式示例
  - 包含简单行内公式和复杂块级公式示例

## 23-08-03#01

- 优化了预览样式，参考markdown.com.cn网站：
  - 改进了nice-sidebar-preview-type的样式
  - 完善了Markdown元素的显示样式
  - 添加了表格、链接等更多元素的样式
- 增强了Markdown渲染功能：
  - 添加了自定义渲染器
  - 增加了表格的处理逻辑
  - 为代码块添加了行号显示
  - 添加了防抖函数优化实时预览性能
- 调整了整体界面：
  - 更改了标题为"Markdown预览红菊"
  - 优化了预览区域的布局
  - 添加了更多菜单交互功能
- 提高了响应式支持，改进移动设备显示效果

## 23-08-02#01

- 创建了基础项目结构
- 添加了以下文件：
  - index.html：主页面，包含编辑器布局和基本功能
  - styles.css：样式文件，实现左右分栏编辑器界面
  - script.js：JavaScript逻辑，实现Markdown转换功能
  - README.md：项目说明文档
- 实现功能：
  - Markdown实时预览
  - 保存到本地存储
  - 下载Markdown文件
  - 初始化示例内容
- 根据参考截图，确保3号区域只保留nice-sidebar-preview-type的内容

## 23-08-07#01

- 简化界面，移除顶部菜单和按钮：
  - 移除了顶部导航栏中的"文件"、"格式"、"功能"、"指南手册"、"代码手册"菜单项
  - 移除了"保存"、"预览"、"下载"按钮
  - 移除了相关的JavaScript事件监听代码
  - 保留了核心功能的实现逻辑，以便将来可能的恢复

## 23-03-28-01

### 修改文件: .gitignore
- 添加针对大文件的忽略规则
- 忽略dist目录下的MarkVision.zip文件
- 忽略所有.zip文件和dist/*.exe文件
- 忽略dist/win-unpacked/目录

### 处理: 大文件Git上传问题
- 从Git缓存中移除了超过50MB的文件
- 配置忽略规则防止大文件被提交

# 23-03-28-1

修改文件：
- main.js
- preload.js
- optimize-deps.js
- webpack.config.js
- package.json

变更内容：
- 将所有ES模块语法(import/export)转换为CommonJS语法(require/module.exports)
- 从package.json中移除"type": "module"配置
- 修复了"Error [ERR_REQUIRE_ESM]: require() of ES Module"错误

功能变更情况：
- 修复了预览功能不起作用的问题，现在应用可以正常启动并显示Markdown预览

# 23-03-28-2

修改文件：
- src/index.js
- src/modules/markdown.js
- src/modules/renderer.js
- src/modules/ui.js
- src/modules/events.js
- src/modules/pdf.js

变更内容：
- 将src目录下所有模块文件从ES模块语法转换为CommonJS语法
- 修改了各个模块的导入导出方式，使用module.exports替代export
- 修复了模块间互相引用的问题

功能变更情况：
- 修复了左侧输入Markdown文本右侧不显示预览的问题
- 恢复了正常的渲染和预览功能

# MarkVision 变更历史

## 23-03-28-1

### 修复预览不显示问题

- 创建本地化marked库，彻底解决外部依赖问题
- 增强渲染器的容错性，确保即使marked库失败也能显示内容
- 添加强制预览模块，使用多重渲染方法保障内容显示
- 修改样式确保预览面板始终可见
- 增加诊断工具帮助分析渲染问题
- 去除对外部CDN资源的依赖，解决SSL错误问题

### 具体变更

- 新增 `src/modules/marked-local.js`：创建内置的marked解析库，避免网络依赖
- 新增 `src/force-preview.js`：强制预览显示模块
- 新增 `src/debug.js`：调试辅助模块
- 修改 `src/modules/markdown.js`：使用本地marked库
- 修改 `src/modules/renderer.js`：增强错误处理和备用渲染方案
- 修改 `index.html`：移除CDN依赖，简化渲染逻辑
- 修改 `styles.css`：确保预览面板可见性
- 修改 `src/index.js`：整合新模块，提高应用可靠性

# 24-03-28 #2 无版本号

## 修复的文件
- src/force-preview.js
- index.html 

## 变更内容
1. 修复右侧预览区域不显示内容的问题
2. 在index.html中直接引入marked.min.js和tex-svg.js
3. 增强force-preview.js中的错误处理和动态加载能力
4. 为预览区域添加强制显示样式
5. 添加更多的日志记录以便调试

## 功能变更
- 右侧预览区域现在能够正确显示左侧编辑区域的Markdown内容
- 增强了渲染的稳定性和可靠性

## 25-03-28#01

- 修复了左右两侧内容不能同步滚动的问题：
  - 创建了独立的滚动同步脚本文件 scroll-sync.js
  - 优化了滚动事件监听和处理机制
  - 修改了 index.html 引入新的滚动同步脚本
  - 修改了 styles.css 中的滚动相关样式，强制设置overflow为auto
  - 添加了防止滚动事件循环触发的机制
  - 增加了滚动同步的初始化、窗口大小变化和内容变化处理
  - 优化了滚动百分比计算方法，确保同步精确