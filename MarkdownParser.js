import { marked } from 'marked'; // Import marked if it's not already imported, otherwise remove this line if marked is passed externally.

/**
 * 简单的MarkdownParser类
 * 负责提供对占位符的处理
 */
class MarkdownParser {
  // Modify constructor to accept marked instance
  constructor(markedInstance) {
    // Ensure markedInstance is provided
    if (!markedInstance || typeof markedInstance.parse !== 'function') {
      throw new Error('MarkdownParser requires a valid marked instance.');
    }
    this.marked = markedInstance;
  }

  /**
   * 编译Markdown节点
   * @param {NodeList} nodes - 包含Markdown文本的DOM节点列表
   * @returns {string} - 转换后的HTML
   */
  compile(nodes) {
    if (!nodes || nodes.length === 0) return '';
    
    // 将节点集合转换为数组
    const nodeArray = Array.from(nodes);
    let html = '';
    
    // 处理每个节点
    nodeArray.forEach(node => {
      if (node.textContent) {
        // 使用传入的 marked 实例解析Markdown文本
        const parsedHtml = this.marked.parse(node.textContent);
        
        // 保留data-index属性
        if (node.dataset && node.dataset.index !== undefined) {
          // 将解析后的HTML包装在带有data-index的div中
          html += `<div data-index=\"${node.dataset.index}\">${parsedHtml}</div>`;
        } else {
          html += parsedHtml;
        }
      }
    });
    
    return html;
  }
}

// Export the class for module usage
export default MarkdownParser; 