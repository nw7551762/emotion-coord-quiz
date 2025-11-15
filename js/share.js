/**
 * ShareManager - 負責分享功能
 * 包含圖卡生成、複製連結、社群分享
 */
export class ShareManager {
  constructor() {
    // 各植物類型的分享文字模板
    this.shareTemplates = {
      lavender: '我是「薰衣草型」🌿 在情緒座標的安定靜心區，需要更多靜謐時刻。你是哪種植物？',
      cypress: '我是「扁柏型」🌲 在情緒座標的安定靜心區，步調穩定而踏實。你是哪種植物？',
      hinoki: '我是「檜木型」🌳 在情緒座標的溫潤和諧區，溫暖療癒著周圍。你是哪種植物？',
      chamomile: '我是「洋甘菊型」🌼 在情緒座標的溫潤和諧區，溫柔關懷著他人。你是哪種植物？',
      mint: '我是「薄荷葉型」🍃 在情緒座標的光合啟動區，行動力強而清晰。你是哪種植物？',
      peony: '我是「牡丹型」🌺 在情緒座標的光芒區，熱情綻放著光彩。你是哪種植物？'
    };

    this.baseUrl = window.location.origin + window.location.pathname;
  }

  /**
   * 生成分享圖片並下載
   * @param {HTMLElement} resultElement - 結果畫面元素
   * @param {string} resultKey - 植物類型 key
   */
  async generateShareImage(resultElement, resultKey) {
    // 檢查是否有 html2canvas 函式庫
    if (typeof html2canvas === 'undefined') {
      alert('圖片生成功能需要載入 html2canvas 函式庫。\n請稍後再試或使用其他分享方式。');
      return;
    }

    try {
      // 暫時隱藏不需要的元素（如分享按鈕區）
      const shareSection = resultElement.querySelector('.share-section');
      const restartBtn = resultElement.querySelector('.restart-btn');

      const hiddenElements = [];
      if (shareSection) {
        shareSection.style.display = 'none';
        hiddenElements.push(shareSection);
      }
      if (restartBtn) {
        restartBtn.style.display = 'none';
        hiddenElements.push(restartBtn);
      }

      // 生成圖片
      const canvas = await html2canvas(resultElement, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高解析度
        logging: false,
        useCORS: true
      });

      // 恢復隱藏的元素
      hiddenElements.forEach(el => {
        el.style.display = '';
      });

      // 轉換為圖片並下載
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `emotion-coord-${resultKey}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });

    } catch (error) {
      console.error('生成圖片失敗:', error);
      alert('圖片生成失敗，請稍後再試。');

      // 恢復隱藏的元素
      const shareSection = resultElement.querySelector('.share-section');
      const restartBtn = resultElement.querySelector('.restart-btn');
      if (shareSection) shareSection.style.display = '';
      if (restartBtn) restartBtn.style.display = '';
    }
  }

  /**
   * 複製測驗連結到剪貼簿
   * @returns {Promise<boolean>} 是否成功複製
   */
  async copyLink() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this.baseUrl);
        return true;
      } else {
        // 備用方案：使用舊版 API
        const textArea = document.createElement('textarea');
        textArea.value = this.baseUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('複製連結失敗:', error);
      return false;
    }
  }

  /**
   * 分享到 Line
   * @param {string} resultKey - 植物類型 key
   */
  shareToLine(resultKey) {
    const text = this.shareTemplates[resultKey] || '來測測看你的情緒座標！';
    const url = this.baseUrl;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank', 'width=600,height=400');
  }

  /**
   * 分享到 Facebook
   * @param {string} resultKey - 植物類型 key
   */
  shareToFacebook(resultKey) {
    const url = this.baseUrl;
    const quote = this.shareTemplates[resultKey] || '來測測看你的情緒座標！';
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  }

  /**
   * 分享到 Twitter
   * @param {string} resultKey - 植物類型 key
   */
  shareToTwitter(resultKey) {
    const text = this.shareTemplates[resultKey] || '來測測看你的情緒座標！';
    const url = this.baseUrl;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }

  /**
   * 使用 Web Share API 分享（行動裝置原生分享）
   * @param {string} resultKey - 植物類型 key
   * @returns {Promise<boolean>} 是否支援且成功分享
   */
  async shareNative(resultKey) {
    if (!navigator.share) {
      return false; // 不支援 Web Share API
    }

    try {
      await navigator.share({
        title: '找到你的情緒座標',
        text: this.shareTemplates[resultKey] || '來測測看你的情緒座標！',
        url: this.baseUrl
      });
      return true;
    } catch (error) {
      // 使用者取消分享或發生錯誤
      if (error.name !== 'AbortError') {
        console.error('分享失敗:', error);
      }
      return false;
    }
  }
}
