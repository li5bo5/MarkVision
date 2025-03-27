const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

// 保持对window对象的全局引用，避免JavaScript对象被垃圾回收时窗口关闭
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // 允许加载本地资源
    }
  });

  // 加载应用的index.html
  mainWindow.loadFile('index.html');

  // 创建应用菜单
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '清除缓存',
          click() {
            // 向渲染进程发送清除缓存的消息
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript('localStorage.removeItem("savedMarkdown");window.location.reload();');
              console.log('缓存已清除');
            }
          }
        },
        {
          label: '导出为HTML',
          click() {
            mainWindow.webContents.executeJavaScript(`
              const markdownText = document.getElementById('markdown-input').value;
              const htmlContent = document.getElementById('preview-content').innerHTML;
              
              // 使用Electron的ipcRenderer或其他方式处理导出
              // 这里简化处理，仅作示例
              console.log('导出HTML内容');
            `);
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          click() { app.quit(); }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '刷新' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click() {
            // 可以创建一个关于对话框
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              title: 'Markdown预览工具',
              message: 'Markdown预览工具 V1.0.0',
              detail: '一个简单易用的Markdown编辑和预览工具'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // 当窗口将要关闭时清除缓存
  mainWindow.on('close', function () {
    if (mainWindow) {
      console.log('窗口关闭，清除缓存');
      mainWindow.webContents.executeJavaScript('localStorage.removeItem("savedMarkdown");console.log("缓存已清除");');
    }
  });

  // 当窗口关闭时触发
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  // 在macOS上，应用及其菜单栏通常会保持活跃状态，
  // 直到用户使用Cmd + Q明确退出
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // 在macOS上，当点击dock图标并且没有其他窗口打开时，
  // 通常会在应用程序中重新创建一个窗口
  if (mainWindow === null) createWindow();
}); 