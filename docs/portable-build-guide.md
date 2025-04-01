# MarkVision 便携版构建指南

本文档介绍如何手动构建MarkVision的便携版本，以及如何配置GitHub Actions自动构建和发布便携版。

## 手动构建便携版

### 准备工作

1. 确保已安装所有必要的依赖：
   - Node.js (v16+)
   - Rust (最新版)
   - Visual Studio C++ 构建工具

2. 克隆项目代码：
   ```bash
   git clone https://github.com/用户名/MarkVision.git
   cd MarkVision
   ```

3. 安装项目依赖：
   ```bash
   npm install
   ```

### 构建步骤

1. 构建前端资源：
   ```bash
   npm run build
   ```

2. 构建Tauri应用程序：
   ```bash
   npm run tauri:build
   ```

3. 创建便携版目录：
   ```powershell
   # 设置版本号和目录名
   $version = "1.0.0" # 根据实际版本修改
   $appName = "MarkVision"
   $portableDir = "portable-$appName-v$version"
   
   # 创建目录
   New-Item -Path $portableDir -ItemType Directory -Force
   New-Item -Path "$portableDir/config" -ItemType Directory -Force
   New-Item -Path "$portableDir/data" -ItemType Directory -Force
   
   # 复制可执行文件
   Copy-Item -Path "src-tauri/target/release/$appName.exe" -Destination "$portableDir/"
   
   # 创建说明文件
   @"
   $appName 便携版 v$version
   
   使用说明:
   1. 解压后直接运行 $appName.exe
   2. 程序会在当前目录的config文件夹中保存配置
   3. 用户数据将存储在data文件夹中
   
   此便携版无需安装，可直接在U盘等移动设备上运行。
   "@ | Out-File -FilePath "$portableDir/readme.txt" -Encoding utf8
   
   # 压缩便携版文件夹
   Compress-Archive -Path "$portableDir/*" -DestinationPath "$appName-portable-v$version.zip" -Force
   ```

## GitHub Actions 自动构建配置

项目已配置了GitHub Actions工作流，可以自动构建和发布便携版和安装版。

### 工作流程文件

工作流程定义在 `.github/workflows/build.yml` 文件中，主要包括以下步骤：

1. 自动更新版本号
2. 构建前端资源
3. 构建Tauri应用程序
4. 创建便携版压缩包
5. 将便携版和安装版上传到GitHub Releases

### 触发构建

自动构建可以通过以下方式触发：

1. 推送代码到 `main` 或 `master` 分支
2. 手动触发（在GitHub仓库的Actions页面中）

### 发布版本

每次成功构建后，工作流程会：

1. 自动递增补丁版本号（如1.0.0 -> 1.0.1）
2. 创建对应版本号的Git标签
3. 发布新版本到GitHub Releases
4. 上传安装包和便携版压缩包

## 便携版运行原理

MarkVision的便携版通过以下机制实现：

1. 启动时检测应用程序目录中是否存在 `config` 文件夹
2. 如果存在，则使用该目录进行配置存储，否则使用系统默认位置
3. 用户数据存储在应用程序目录的 `data` 文件夹中

这种设计使得应用程序可以在不同计算机之间迁移，同时保留所有配置和数据。

## 常见问题

### 便携版无法启动

- 检查是否已安装Microsoft WebView2运行时，可以从 [微软官网](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) 下载安装
- 确保便携版目录具有写入权限

### 缺少DLL文件

Tauri应用程序会将所需的DLL文件打包到可执行文件中，但以下情况可能需要额外的DLL：

- Visual C++ 运行时库
- WebView2运行时

### 版本号更新失败

如果自动版本号更新失败，可以手动修改以下文件中的版本号：
- `package.json`
- `src-tauri/tauri.conf.json` 