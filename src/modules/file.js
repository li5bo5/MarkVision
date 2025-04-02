import { dialog, fs } from '@tauri-apps/api';

/**
 * 打开Markdown文件
 * @returns {Promise<string|null>} - 返回文件内容或 null
 */
export async function openMarkdownFile() {
  try {
    // 使用Tauri的对话框API选择文件
    const filePath = await dialog.open({
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'markdown', 'txt']
      }],
      multiple: false
    });
    
    if (filePath) {
      // 使用Tauri的文件系统API读取文件
      const content = await fs.readTextFile(filePath);
      // 保存最近使用的文件路径
      localStorage.setItem('lastFilePath', filePath);
      return content;
    }
    return null;
  } catch (error) {
    console.error('打开文件失败:', error);
    throw error;
  }
}