/**
 * 初始化UI相关功能
 */
export function initUI() {
  // 设置编辑器和预览区域高度
  const resizeEditors = () => {
    const header = document.querySelector('.app-header');
    const container = document.querySelector('.editor-container');
    const headerHeight = header.offsetHeight;
    const windowHeight = window.innerHeight;
    
    container.style.height = `${windowHeight - headerHeight}px`;
  };
  
  // 初始调整大小
  resizeEditors();
  
  // 监听窗口大小变化
  window.addEventListener('resize', resizeEditors);
  
  // 设置暗黑模式切换(未来功能)
  // const toggleDarkMode = document.getElementById('toggle-dark-mode');
  // if (toggleDarkMode) {
  //   toggleDarkMode.addEventListener('click', () => {
  //     document.body.classList.toggle('dark-mode');
  //   });
  // }
}