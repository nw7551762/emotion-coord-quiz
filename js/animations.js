/**
 * AnimationManager - 負責所有動畫效果
 * 包含頁面過場、載入動畫、結果揭曉、打字機效果等
 */
export class AnimationManager {
  constructor() {
    this.loadingScreen = null;
    this.isAnimating = false;
    this.currentDepth = 0; // 當前森林深度 (0-10)
    this.layers = {
      far: null,
      mid: null,
      near: null
    };
    this.preloadedImages = {}; // 預載圖片快取
  }

  /**
   * 淡入效果
   * @param {HTMLElement} element - 要顯示的元素
   * @param {number} duration - 動畫時間（毫秒）
   * @returns {Promise} 動畫完成的 Promise
   */
  fadeIn(element, duration = 300) {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      element.style.display = 'block';
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;

      // 強制重繪
      element.offsetHeight;

      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';

      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  /**
   * 淡出效果
   * @param {HTMLElement} element - 要隱藏的元素
   * @param {number} duration - 動畫時間（毫秒）
   * @returns {Promise} 動畫完成的 Promise
   */
  fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        element.style.display = 'none';
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  /**
   * 滑入效果
   * @param {HTMLElement} element - 要顯示的元素
   * @param {string} direction - 滑入方向 ('left', 'right', 'top', 'bottom')
   * @param {number} duration - 動畫時間（毫秒）
   * @returns {Promise} 動畫完成的 Promise
   */
  slideIn(element, direction = 'right', duration = 400) {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      const transforms = {
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
        top: 'translateY(-100%)',
        bottom: 'translateY(100%)'
      };

      element.style.display = 'block';
      element.style.opacity = '0';
      element.style.transform = transforms[direction] || transforms.right;
      element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;

      element.offsetHeight;

      element.style.opacity = '1';
      element.style.transform = 'translate(0, 0)';

      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  /**
   * 顯示載入畫面
   * @param {string} message - 載入訊息
   */
  showLoadingScreen(message = '正在分析你的情緒座標...') {
    this.loadingScreen = document.getElementById('loadingScreen');
    const loadingText = document.getElementById('loadingText');

    if (this.loadingScreen) {
      if (loadingText) {
        loadingText.textContent = message;
      }
      this.loadingScreen.style.display = 'flex';
      this.fadeIn(this.loadingScreen, 300);
    }
  }

  /**
   * 隱藏載入畫面
   * @returns {Promise} 動畫完成的 Promise
   */
  hideLoadingScreen() {
    return new Promise((resolve) => {
      if (this.loadingScreen) {
        this.fadeOut(this.loadingScreen, 300).then(() => {
          this.loadingScreen.style.display = 'none';
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * 結果揭曉動畫
   * @param {HTMLElement} resultElement - 結果區域元素
   * @param {Function} onComplete - 完成回調函式
   */
  revealResult(resultElement, onComplete) {
    if (!resultElement) {
      if (onComplete) onComplete();
      return;
    }

    // 第一階段：淡入結果畫面
    this.fadeIn(resultElement, 500).then(() => {
      // 添加揭曉動畫類別
      resultElement.classList.add('result-reveal');

      // 第二階段：等待動畫完成
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 800);
    });
  }

  /**
   * 打字機效果
   * @param {HTMLElement} element - 目標元素
   * @param {string} text - 要顯示的文字（可包含 HTML）
   * @param {number} speed - 打字速度（毫秒/字元）
   * @returns {Promise} 動畫完成的 Promise
   */
  typewriterEffect(element, text, speed = 30) {
    return new Promise((resolve) => {
      if (!element || !text) {
        resolve();
        return;
      }

      // 處理 HTML 標籤
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';

      element.textContent = '';
      let index = 0;

      const typeChar = () => {
        if (index < plainText.length) {
          element.textContent += plainText.charAt(index);
          index++;
          setTimeout(typeChar, speed);
        } else {
          // 打字完成後，恢復原始 HTML（包含格式）
          element.innerHTML = text;
          resolve();
        }
      };

      typeChar();
    });
  }

  /**
   * 脈動效果（用於按鈕或強調元素）
   * @param {HTMLElement} element - 目標元素
   */
  pulse(element) {
    if (!element) return;

    element.classList.add('pulse-animation');
    setTimeout(() => {
      element.classList.remove('pulse-animation');
    }, 600);
  }

  /**
   * 震動效果（用於錯誤提示）
   * @param {HTMLElement} element - 目標元素
   */
  shake(element) {
    if (!element) return;

    element.classList.add('shake-animation');
    setTimeout(() => {
      element.classList.remove('shake-animation');
    }, 600);
  }

  /**
   * 背景粒子效果（可選功能）
   * @param {HTMLElement} container - 容器元素
   */
  startParticles(container) {
    if (!container) return;

    // 簡單的粒子效果實作
    const particleCount = 15;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.textContent = ['🌿', '🍃', '✨'][Math.floor(Math.random() * 3)];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.animationDuration = `${10 + Math.random() * 10}s`;

      container.appendChild(particle);
      particles.push(particle);
    }

    this.particles = particles;
  }

  /**
   * 停止背景粒子效果
   */
  stopParticles() {
    if (this.particles) {
      this.particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      this.particles = null;
    }
  }

  /**
   * 數字計數動畫
   * @param {HTMLElement} element - 目標元素
   * @param {number} start - 起始數字
   * @param {number} end - 結束數字
   * @param {number} duration - 動畫時間（毫秒）
   */
  countUp(element, start, end, duration = 1000) {
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.round(current);
    }, 16);
  }

  // ========== 森林探索動畫效果 ==========

  /**
   * 預載圖片
   * @param {string} url - 圖片網址
   * @returns {Promise} 載入完成的 Promise
   */
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      // 檢查快取
      if (this.preloadedImages[url]) {
        resolve(this.preloadedImages[url]);
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.preloadedImages[url] = img;
        resolve(img);
      };
      img.onerror = (err) => {
        console.error(`Failed to load image: ${url}`, err);
        reject(err);
      };
      img.src = url;
    });
  }

  /**
   * 初始化背景層
   */
  async initBackgroundLayers() {
    this.forestBg = document.querySelector('.forest-background');

    // 預載所有背景圖片,避免切換時出現空白
    const images = [
      'images/forest-bg.jpg',
      'images/forest-mid.jpg',
      'images/forest-fg.jpg'
    ];

    try {
      await Promise.all(images.map(url => this.preloadImage(url)));
      console.log('All background images preloaded successfully');
    } catch (err) {
      console.error('Some background images failed to preload', err);
    }

    // 設定初始狀態
    await this.updateForestDepth(0);
  }

  /**
   * 更新森林深度（題號變化時調用）
   * @param {number} questionNumber - 當前題號 (1-10)，0 表示開始畫面
   * @returns {Promise} 更新完成的 Promise
   */
  async updateForestDepth(questionNumber) {
    if (!this.forestBg) return;

    this.currentDepth = questionNumber;

    // 決定背景圖片階段（每3題換一張）
    let newStage = 1;
    if (questionNumber >= 7) {
      newStage = 3; // 第 7-10 題：森林深處
    } else if (questionNumber >= 4) {
      newStage = 2; // 第 4-6 題：森林中段
    } else {
      newStage = 1; // 第 0-3 題：森林入口
    }

    // 檢查是否需要切換圖片
    const currentStage = this.forestBg.classList.contains('stage-3') ? 3 :
      this.forestBg.classList.contains('stage-2') ? 2 : 1;

    if (newStage !== currentStage) {
      // 使用交叉淡化切換圖片(等待圖片載入完成)
      await this.crossfadeBackground(currentStage, newStage);
    }

    // 移除舊的 zoom 類別
    for (let i = 1; i <= 10; i++) {
      this.forestBg.classList.remove(`zoom-${i}`);
    }

    // 添加放大效果（題號越大，放大越多）
    if (questionNumber > 0) {
      this.forestBg.classList.add(`zoom-${questionNumber}`);
    }
  }

  /**
   * 更新 header 顯示狀態（已停用淡出效果）
   * @param {number} questionNumber - 當前題號 (0-10)
   */
  updateHeaderVisibility(questionNumber) {
    const header = document.querySelector('.header');
    if (!header) return;

    // 確保 header 始終完全顯示，移除所有淡出類別
    header.classList.remove('fading', 'faded', 'hidden');
  }

  /**
   * 交叉淡化切換背景圖片
   * @param {number} fromStage - 原本的階段
   * @param {number} toStage - 新的階段
   * @returns {Promise} 切換完成的 Promise
   */
  async crossfadeBackground(fromStage, toStage) {
    if (!this.forestBg) return;

    // 設定 ::before 的背景圖（新圖片）
    const images = {
      1: 'images/forest-bg.jpg',
      2: 'images/forest-mid.jpg',
      3: 'images/forest-fg.jpg'
    };

    const nextImageUrl = images[toStage];

    try {
      // 預載圖片,確保載入完成再切換
      await this.preloadImage(nextImageUrl);

      // 圖片已載入,安全地開始切換
      this.forestBg.style.setProperty('--next-bg', `url('${nextImageUrl}')`);

      // 更新 ::before 的背景圖
      const style = document.createElement('style');
      style.id = 'bg-transition-style';
      const existingStyle = document.getElementById('bg-transition-style');
      if (existingStyle) existingStyle.remove();

      style.textContent = `.forest-background::before { background-image: url('${nextImageUrl}'); }`;
      document.head.appendChild(style);

      // 觸發淡入
      this.forestBg.classList.add('transitioning');

      // 2秒後完成過渡
      return new Promise((resolve) => {
        setTimeout(() => {
          // 更新主背景圖
          this.forestBg.classList.remove('stage-1', 'stage-2', 'stage-3');
          this.forestBg.classList.add(`stage-${toStage}`);

          // 重置過渡狀態
          this.forestBg.classList.remove('transitioning');
          resolve();
        }, 2000);
      });
    } catch (err) {
      // 載入失敗時的處理 - 直接切換不做動畫
      console.error('Background image preload failed, switching without animation', err);
      this.forestBg.classList.remove('stage-1', 'stage-2', 'stage-3');
      this.forestBg.classList.add(`stage-${toStage}`);
    }
  }

  /**
   * 題目切換動畫（森林探索版本）
   * @param {HTMLElement} currentElement - 當前題目元素
   * @param {HTMLElement} nextElement - 下一題元素
   * @param {Function} callback - 動畫完成後的回調
   * @returns {Promise} 動畫完成的 Promise
   */
  transitionToNextQuestion(currentElement, nextElement, callback) {
    if (this.isAnimating) return Promise.resolve();
    this.isAnimating = true;

    return new Promise((resolve) => {
      // 1. 當前題目淡出（向左移動）
      currentElement.classList.add('fade-out-left');

      // 2. 背景放大效果已在 updateForestDepth() 中處理

      setTimeout(() => {
        // 隱藏當前元素
        currentElement.style.display = 'none';
        currentElement.classList.remove('fade-out-left');

        // 執行回調（更新內容）
        if (callback) callback();

        // 3. 新題目淡入（從右側進入）
        nextElement.style.display = 'block';
        nextElement.classList.add('fade-in-right');

        setTimeout(() => {
          nextElement.classList.remove('fade-in-right');
          this.isAnimating = false;
          resolve();
        }, 500);
      }, 500);
    });
  }

  /**
   * 結果揭曉動畫（森林核心版本）
   * @param {string} plantColor - 植物主色
   * @param {HTMLElement} resultElement - 結果區域元素
   * @returns {Promise} 動畫完成的 Promise
   */
  async revealResultWithForest(plantColor, resultElement) {
    return new Promise((resolve) => {
      const container = document.querySelector('.container') || document.body;

      // 1. 建立過場遮罩（插入到 body，而非 container）
      const overlay = document.createElement('div');
      overlay.className = 'result-transition-overlay';
      overlay.innerHTML = '<div class="transition-text">深入森林核心...</div>';
      document.body.appendChild(overlay);

      // 1.5. 隱藏 container（過場期間完全不可見）
      container.style.display = 'none';
      container.offsetHeight; // 觸發 reflow

      // 1.6. 背景放大效果（深入森林核心）
      const forestBg = document.querySelector('.forest-background');
      if (forestBg) {
        // 先設定過渡時間（緩慢放大，營造深入感）
        forestBg.style.transition = 'transform 8s cubic-bezier(0.4, 0, 0.2, 1)';
        // 強制重繪，確保過渡生效
        forestBg.offsetHeight;
        // 觸發放大動畫
        forestBg.style.transform = 'scale(2.0) translate(0, 20%)';
      }

      // 2. 過場動畫（2秒）
      setTimeout(() => {
        // 2.5. 提前恢復 container（避免淡出時閃爍）
        container.style.display = 'block';

        // 延遲 200ms 再開始淡出遮罩（確保 container 已顯示）
        setTimeout(() => {
          overlay.classList.add('fade-out');

          setTimeout(() => {
            overlay.remove();

            // 3. 設定結果背景光暈
            document.documentElement.style.setProperty('--result-color', plantColor);

            // 4. 顯示結果元素
            if (resultElement) {
              resultElement.style.display = 'block';
            }

            // 5. 觸發結果元素的依序動畫
            this.animateResultElements();

            resolve();
          }, 500);
        }, 200);
      }, 2000);
    });
  }

  /**
   * 結果元素依序動畫
   */
  animateResultElements() {
    const selectors = [
      '.plant-icon',
      '.plant-name',
      '.tagline',
      '.description',
      '.coord-container',
      '.relationship-section',
      '.scent-section'
    ];

    selectors.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.classList.add('pop-in');
        }, index * 150); // 錯開 150ms
      }
    });
  }

  /**
   * 更新進度視覺化（森林小徑）
   * @param {number} current - 當前題號
   * @param {number} total - 總題數
   */
  updateProgressTrail(current, total) {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const percentage = (current / total) * 100;
    progressBar.style.width = `${percentage}%`;

    // 新增腳印標記
    const progressContainer = progressBar.parentElement;
    if (progressContainer && !progressContainer.querySelector(`.footprint-${current}`)) {
      const footprint = document.createElement('div');
      footprint.className = `footprint footprint-${current}`;
      footprint.style.left = `${percentage}%`;
      progressContainer.appendChild(footprint);
    }
  }

  /**
   * 重置森林動畫狀態
   */
  resetForest() {
    this.currentDepth = 0;
    this.updateForestDepth(0);

    // 重置背景（回到第一階段，無放大）
    if (this.forestBg) {
      this.forestBg.classList.remove('stage-2', 'stage-3');
      this.forestBg.classList.add('stage-1');

      for (let i = 1; i <= 10; i++) {
        this.forestBg.classList.remove(`zoom-${i}`);
      }
    }

    // 清除腳印
    const footprints = document.querySelectorAll('.footprint');
    footprints.forEach(fp => fp.remove());

    // 重置進度條
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = '0%';
  }
}
