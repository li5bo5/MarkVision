# MarkVision

## 项目简介

一个简单易用的Markdown预览和编辑工具，支持便携式运行模式。

## Logo

<div align="center">
  <img src="src-tauri/icons/icon.ico" alt="MarkVision Logo" width="128" height="128">
</div>

## 功能特性

- 实时Markdown预览
- 支持选中文本同步高亮
- 滚动同步
  - 基于标题元素的精准映射同步
  - 平滑滚动体验
- 代码高亮显示
- 导出为PDF
- 便携式运行模式
- 自动发布与版本更新

## 变更日志

### 最新更新
- 移除了文件保存功能
- 移除了内容清空功能
- 优化滚动同步功能
  - 添加基于标题元素的精准映射
  - 改进滚动体验，减少抖动

## 食用

### 便携版

1. 从 [GitHub Releases](https://github.com/li5bo5/MarkVision/releases) 下载最新的便携版压缩包 (`.zip`)
2. 解压到任意位置（如桌面）
3. 双击 `MarkVision.exe` 即可运行，无需安装

## 开发说明

### 技术栈

- 前端: HTML, CSS, JavaScript (Vanilla JS)
- 后端: Tauri (Rust)
- 构建: Vite
- 自动发布: GitHub Actions

### 自动构建与发布

项目使用GitHub Actions实现自动构建与发布：

1. 每当代码推送到`main`分支时，自动触发构建
2. 构建过程会自动递增版本号
3. 生成安装包(`.msi`)和便携版(`.zip`)
4. 自动发布到GitHub Releases

## 运行平台

- Windows 10/11 (x64)

## 许可证

MIT 