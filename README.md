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
- 代码高亮显示
- 导出为PDF
- 便携式运行模式
- 自动发布与版本更新

## 下载与安装

MarkVision提供两种使用方式：

### 安装版

1. 从 [GitHub Releases](https://github.com/用户名/MarkVision/releases) 下载最新的安装包 (`.msi`)
2. 双击安装包进行安装
3. 安装完成后，从开始菜单启动MarkVision

### 便携版

1. 从 [GitHub Releases](https://github.com/用户名/MarkVision/releases) 下载最新的便携版压缩包 (`.zip`)
2. 解压到任意位置（如U盘）
3. 双击 `MarkVision.exe` 即可运行，无需安装
4. 所有配置和数据将保存在应用程序目录的 `config` 和 `data` 文件夹中

## 开发说明

### 技术栈

- 前端: HTML, CSS, JavaScript (Vanilla JS)
- 后端: Tauri (Rust)
- 构建: Vite
- 自动发布: GitHub Actions

### 本地开发环境搭建

1. 安装必要的依赖：
   - [Node.js](https://nodejs.org/) (v16+)
   - [Rust](https://www.rust-lang.org/)
   - [Visual Studio C++ 构建工具](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

2. 克隆仓库：
   ```
   git clone https://github.com/用户名/MarkVision.git
   cd MarkVision
   ```

3. 安装依赖：
   ```
   npm install
   ```

4. 开发模式启动：
   ```
   npm run tauri dev
   ```

5. 构建应用：
   ```
   npm run tauri build
   ```

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