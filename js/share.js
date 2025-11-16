/**
 * ShareManager - 負責分享功能
 * 包含圖卡生成、複製連結、社群分享
 */
import { getPlantImage } from './data/plants.js';

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
   * 建立 Instagram 專用分享卡片 DOM
   * @param {string} resultKey - 植物類型 key
   * @returns {HTMLElement} 分享卡片 DOM 元素
   */
  async createShareCardDOM(resultKey) {
    // 動態載入植物資料
    const { plantData } = await import('./data/plants.js');
    const plant = plantData[resultKey];

    // 建立卡片容器
    const card = document.createElement('div');
    card.className = 'ig-share-card';

    // 頭部區域
    const header = document.createElement('div');
    header.className = 'ig-share-card__header';
    header.innerHTML = `
      <h1 class="ig-share-card__title">🌿 找到你的情緒座標</h1>
      <p class="ig-share-card__subtitle">來自台灣的香氣研製所</p>
    `;
    card.appendChild(header);

    // 主要內容區域
    const body = document.createElement('div');
    body.className = 'ig-share-card__body';

    // 植物資訊區域
    const plantSection = document.createElement('div');
    plantSection.className = 'ig-share-card__plant';
    plantSection.innerHTML = `
      <span class="ig-share-card__icon">${plant.icon}</span>
      <h2 class="ig-share-card__plant-name">${plant.name}</h2>
      <p class="ig-share-card__plant-tagline">${plant.tagline}</p>
    `;
    body.appendChild(plantSection);

    // 並排區域：座標 + 香氣
    const parallelSection = document.createElement('div');
    parallelSection.className = 'ig-share-card__parallel-section';

    // 座標圖區域
    const coordSection = document.createElement('div');
    coordSection.className = 'ig-share-card__coord';
    coordSection.innerHTML = `
      <h3 class="ig-share-card__coord-title">你的情緒座標位置</h3>
      <div class="ig-share-card__coord-map">
        <div class="ig-share-card__axis ig-share-card__axis--vertical"></div>
        <div class="ig-share-card__axis ig-share-card__axis--horizontal"></div>
        <div class="ig-share-card__coord-label ig-share-card__coord-label--right">Warm</div>
        <div class="ig-share-card__coord-label ig-share-card__coord-label--left">Cool</div>
        <div class="ig-share-card__coord-label ig-share-card__coord-label--top">Active</div>
        <div class="ig-share-card__coord-label ig-share-card__coord-label--bottom">Calm</div>
        <div class="ig-share-card__coord-point" style="left: ${plant.coord.x}%; top: ${100 - plant.coord.y}%; background-color: ${plant.color};"></div>
      </div>
    `;
    parallelSection.appendChild(coordSection);

    // 香氣區域
    const scentsSection = document.createElement('div');
    scentsSection.className = 'ig-share-card__scents';
    scentsSection.innerHTML = `
      <h3 class="ig-share-card__scents-title">你需要的香氣能量</h3>
      <div class="ig-share-card__scent-item">
        <span class="ig-share-card__scent-type">相似香氣</span>
        <span class="ig-share-card__scent-name">${plant.scent.similar.name}</span>
        <span class="ig-share-card__scent-text">${plant.scent.similar.text}</span>
      </div>
      <div class="ig-share-card__scent-item">
        <span class="ig-share-card__scent-type">平衡香氣</span>
        <span class="ig-share-card__scent-name">${plant.scent.balance.name}</span>
        <span class="ig-share-card__scent-text">${plant.scent.balance.text}</span>
      </div>
    `;
    parallelSection.appendChild(scentsSection);

    body.appendChild(parallelSection);

    // 關係區域（橫排三欄：另一半/朋友/仇人）
    const relationsSection = document.createElement('div');
    relationsSection.className = 'ig-share-card__relations';

    // 找出另一半、朋友、仇人的植物名稱和圖片
    const partnerPlant = plant.relationships.partner.plants[0];
    const friendPlant = plant.relationships.friend.plants[0];
    const enemyPlant = plant.relationships.enemy.plants[0];
    const partnerName = plantData[partnerPlant]?.name || partnerPlant;
    const friendName = plantData[friendPlant]?.name || friendPlant;
    const enemyName = plantData[enemyPlant]?.name || enemyPlant;

    // 取得植物圖片路徑
    const partnerImage = getPlantImage(partnerPlant);
    const friendImage = getPlantImage(friendPlant);
    const enemyImage = getPlantImage(enemyPlant);

    relationsSection.innerHTML = `
      <h3 class="ig-share-card__relations-title">🌱 與你相處的植物們</h3>
      <div class="ig-share-card__relations-grid">
        <div class="ig-share-card__relation-item">
          <img src="${partnerImage}" class="ig-share-card__relation-image" alt="${partnerName}">
          <span class="ig-share-card__relation-emoji">💝</span>
          <span class="ig-share-card__relation-label">另一半</span>
          <span class="ig-share-card__relation-name">${partnerName}</span>
        </div>
        <div class="ig-share-card__relation-item">
          <img src="${friendImage}" class="ig-share-card__relation-image" alt="${friendName}">
          <span class="ig-share-card__relation-emoji">👫</span>
          <span class="ig-share-card__relation-label">朋友</span>
          <span class="ig-share-card__relation-name">${friendName}</span>
        </div>
        <div class="ig-share-card__relation-item">
          <img src="${enemyImage}" class="ig-share-card__relation-image" alt="${enemyName}">
          <span class="ig-share-card__relation-emoji">⚡</span>
          <span class="ig-share-card__relation-label">仇人</span>
          <span class="ig-share-card__relation-name">${enemyName}</span>
        </div>
      </div>
    `;
    body.appendChild(relationsSection);

    card.appendChild(body);

    // 頁尾 CTA 區域
    const footer = document.createElement('div');
    footer.className = 'ig-share-card__footer';
    footer.innerHTML = `
      <p class="ig-share-card__url">nw7551762.github.io/<br>emotion-coord-quiz</p>
      <p class="ig-share-card__cta">來測測看你的情緒座標！</p>
    `;
    card.appendChild(footer);

    return card;
  }

  /**
   * 生成 Instagram 專用分享圖片
   * @param {string} resultKey - 植物類型 key
   * @returns {Promise<boolean>} 是否成功生成並分享/下載
   */
  async generateInstagramImage(resultKey) {
    // 檢查是否有 html2canvas 函式庫
    if (typeof html2canvas === 'undefined') {
      alert('圖片生成功能需要載入 html2canvas 函式庫。\n請稍後再試或使用其他分享方式。');
      return false;
    }

    try {
      // 1. 建立分享卡片 DOM
      const shareCard = await this.createShareCardDOM(resultKey);
      document.body.appendChild(shareCard);

      // 2. 等待一小段時間確保 DOM 完全渲染
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. 使用 html2canvas 截圖
      const canvas = await html2canvas(shareCard, {
        width: 1080,
        height: 1600,
        scale: 1, // IG 優化尺寸，不需要額外放大
        backgroundColor: '#fffaf5',
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // 4. 移除臨時 DOM
      document.body.removeChild(shareCard);

      // 5. 轉換為 blob 並分享/下載
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            alert('圖片生成失敗，請稍後再試。');
            resolve(false);
            return;
          }

          // 偵測是否為手機裝置
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

          if (isMobile) {
            // 手機優先使用 Web Share API
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
                  resolve(true);
                  return;
                } catch (error) {
                  // 使用者取消或不支援，繼續使用備用方案
                  if (error.name !== 'AbortError') {
                    console.error('分享失敗:', error);
                  }
                }
              }
            }

            // 備用方案：開啟圖片預覽（使用者可長按儲存）
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
            // 桌面裝置：觸發下載
            this.downloadBlob(blob, `emotion-coord-${resultKey}.png`);
          }

          resolve(true);
        });
      });

    } catch (error) {
      console.error('生成圖片失敗:', error);
      alert('圖片生成失敗，請稍後再試。');
      return false;
    }
  }

  /**
   * 生成分享圖片並下載（舊版方法，保留向後相容）
   * @param {HTMLElement} resultElement - 結果畫面元素
   * @param {string} resultKey - 植物類型 key
   */
  async generateShareImage(resultElement, resultKey) {
    // 使用新的 Instagram 專用方法
    return await this.generateInstagramImage(resultKey);
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
      alert('請先點擊「📥 下載結果圖」，\n然後到 Instagram App 中上傳圖片分享！');
      return false;
    } else {
      // 桌面裝置：提示使用者下載圖片並手動上傳
      alert('請先點擊「📥 下載結果圖」，\n然後到 Instagram 網頁版上傳圖片分享！');
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
