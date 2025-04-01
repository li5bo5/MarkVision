import html2pdf from 'html2pdf.js';
import { dialog, fs } from '@tauri-apps/api';

/**
 * 保存Markdown内容到文件
 * @param {string} content - Markdown内容
 * @param {Function} [callback] - 保存成功后的回调函数
 */
export async function saveMarkdownToFile(content, callback) {
  try {
    // 使用Tauri的对话框API选择保存位置
    const filePath = await dialog.save({
      filters: [{
        name: 'Markdown',
        extensions: ['md']
      }]
    });
    
    if (filePath) {
      // 使用Tauri的文件系统API写入文件
      await fs.writeTextFile(filePath, content);
      // 保存最近使用的文件路径
      localStorage.setItem('lastFilePath', filePath);
      if (callback) callback();
    }
  } catch (error) {
    console.error('保存文件失败:', error);
    alert(`保存文件失败: ${error.message}`);
  }
}

/**
 * 打开Markdown文件
 * @param {Function} callback - 加载内容的回调函数
 */
export async function openMarkdownFile(callback) {
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
      if (callback) callback(content);
    }
  } catch (error) {
    console.error('打开文件失败:', error);
    alert(`打开文件失败: ${error.message}`);
  }
}

/**
 * 导出预览内容为PDF
 * @param {HTMLElement} contentElement - 包含预览内容的元素
 */
export async function exportToPDF(contentElement) {
  try {
    // 使用Tauri的对话框API选择保存位置
    const filePath = await dialog.save({
      filters: [{
        name: 'PDF文档',
        extensions: ['pdf']
      }]
    });
    
    if (!filePath) return;
    
    // 克隆内容元素以避免修改原始DOM
    const clonedContent = contentElement.cloneNode(true);
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(clonedContent);
    
    // 应用打印样式
    tempDiv.classList.add('pdf-export');
    document.body.appendChild(tempDiv);
    
    // PDF配置选项
    const options = {
      margin: [15, 15],
      filename: filePath.split('/').pop() || 'markdown-export.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // 使用html2pdf库导出PDF
    html2pdf().set(options).from(clonedContent).save().then(() => {
      // 导出完成后移除临时元素
      document.body.removeChild(tempDiv);
    });
  } catch (error) {
    console.error('导出PDF失败:', error);
    alert(`导出PDF失败: ${error.message}`);
  }
}