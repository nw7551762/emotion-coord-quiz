/**
 * ShareManager - 負責分享功能
 * 使用預先生成的分享圖片，不需要 html2canvas
 */

export class ShareManager {
  constructor() {
    // 預先生成的分享圖片路徑對應
    this.shareImages = {
      lavender: 'share/lavender.png',
      cypress: 'share/cypress.png',
      hinoki: 'share/hinoki.png',
      chamomile: 'share/chamomile.png',
      mint: 'share/mint.png',
      peony: 'share/peony.png'
    };

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
   * 載入預先生成的分享圖片並提供下載/分享
   * @param {HTMLElement} resultElement - 結果畫面元素（保留參數以保持向後相容，但不使用）
   * @param {string} resultKey - 植物類型 key
   * @returns {Promise<boolean>} 是否成功載入並分享/下載
   */
  async generateShareImage(resultElement, resultKey) {
    try {
      // 1. 取得對應的分享圖片路徑
      const imagePath = this.shareImages[resultKey];
      if (!imagePath) {
        alert('找不到分享圖片，請稍後再試。');
        return false;
      }

      // 2. 使用 fetch 載入圖片
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error('圖片載入失敗');
      }
      const blob = await response.blob();

      // 3. 判斷裝置類型並執行對應分享邏輯
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // 手機：優先使用 Web Share API
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], `emotion-coord-${resultKey}.png`, { type: 'image/png' });
          const shareData = {
            files: [file],
            title: '我的情緒座標測驗結果',
            text: this.shareTemplates[resultKey] || '來測測看你的情緒座標！'
          };

          if (navigator.canShare(shareData)) {
            try {
              await navigator.share(shareData);
              return true;
            } catch (error) {
              if (error.name !== 'AbortError') {
                console.error('分享失敗:', error);
              }
            }
          }
        }

        // 備用方案：開啟圖片預覽（長按儲存）
        const url = URL.createObjectURL(blob);
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="zh-TW">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>情緒座標測驗結果</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  background: #f0f0f0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  border-radius: 8px;
                }
                .hint {
                  margin-top: 20px;
                  padding: 12px 20px;
                  background: white;
                  border-radius: 8px;
                  text-align: center;
                  color: #666;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <img src="${url}" alt="情緒座標測驗結果">
              <div class="hint">📱 長按圖片可儲存到相簿</div>
            </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          // 無法開啟新視窗，fallback 到下載
          this.downloadBlob(blob, `emotion-coord-${resultKey}.png`);
        }
      } else {
        // 桌面裝置：直接下載
        this.downloadBlob(blob, `emotion-coord-${resultKey}.png`);
      }

      return true;

    } catch (error) {
      console.error('載入分享圖片失敗:', error);
      alert('圖片載入失敗，請稍後再試。');
      return false;
    }
  }

  /**
   * 下載 blob 為檔案
   * @param {Blob} blob - 要下載的 blob
   * @param {string} filename - 檔案名稱
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
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
   * 分享到 Instagram
   * Instagram 不支援直接透過 URL 分享連結，需使用以下方式：
   * 1. 在行動裝置：使用 Web Share API 或引導使用者下載圖片後手動分享
   * 2. 在桌面裝置：提示使用者下載圖片後上傳至 Instagram 網頁版
   * @param {HTMLElement} resultElement - 結果畫面元素
   * @param {string} resultKey - 植物類型 key
   */
  async shareToInstagram(resultElement, resultKey) {
    // 偵測是否為行動裝置
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 行動裝置：嘗試使用 Web Share API 分享文字
      if (navigator.share) {
        try {
          const shareText = this.shareTemplates[resultKey] || '來測測看你的情緒座標！';
          await navigator.share({
            title: '找到你的情緒座標',
            text: shareText + '\n\n' + this.baseUrl
          });
          return true;
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('分享失敗:', error);
          }
        }
      }

      // 備用方案：提示使用者下載圖片
      alert('請先點擊「📥 分享結果圖」，\n然後到 Instagram App 中上傳圖片分享！');
      return false;
    } else {
      // 桌面裝置：提示使用者下載圖片並手動上傳
      alert('請先點擊「📥 分享結果圖」，\n然後到 Instagram 網頁版上傳圖片分享！');
      return false;
    }
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
