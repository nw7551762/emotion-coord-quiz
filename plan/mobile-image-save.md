# 手機圖片儲存功能優化

**狀態：📝 規劃中**

## 需求描述

優化現有的「下載結果圖」功能，讓手機使用者可以更直覺地將結果圖片保存到相簿。

## 現況分析

目前 `js/share.js` 中的 `generateShareImage()` 方法已經實作了基本的圖片下載功能：
- 使用 html2canvas 將結果畫面轉換成圖片
- 使用 `<a>` 標籤的 download 屬性觸發下載
- **問題**：在某些手機瀏覽器（如 iOS Safari）中，這種方式可能不會直接保存到相簿，而是開啟圖片預覽

## 優化目標

### 桌面裝置
保持現有行為：觸發下載，圖片存到下載資料夾

### 手機裝置
提供更好的體驗：
1. **優先方案**：使用 Web Share API 分享圖片 blob，讓使用者可以選擇「儲存圖片」
2. **備用方案**：開啟圖片預覽，引導使用者長按儲存

## 實作方案

### 1. 修改 `generateShareImage()` 方法

在 `js/share.js` 中優化手機端的處理邏輯：

```javascript
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
      useCORS: true,
      allowTaint: true
    });

    // 恢復隱藏的元素
    hiddenElements.forEach(el => {
      el.style.display = '';
    });

    // 轉換為 blob
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('圖片生成失敗，請稍後再試。');
          resolve(false);
          return;
        }

        // === 新增：手機裝置優化處理 ===
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

    // 恢復隱藏的元素
    const shareSection = resultElement.querySelector('.share-section');
    const restartBtn = resultElement.querySelector('.restart-btn');
    if (shareSection) shareSection.style.display = '';
    if (restartBtn) restartBtn.style.display = '';

    return false;
  }
}
```

### 2. 新增輔助方法 `downloadBlob()`

在 `ShareManager` 類別中新增：

```javascript
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
```

## 使用者體驗流程

### 桌面裝置使用者
1. 點擊「📥 下載結果圖」
2. 圖片自動下載到下載資料夾
3. ✅ 完成

### 手機使用者（支援 Web Share API）
1. 點擊「📥 下載結果圖」
2. 系統彈出原生分享選單
3. 選擇「儲存圖片」或其他分享選項（Line、Instagram 等）
4. ✅ 完成

### 手機使用者（不支援 Web Share API）
1. 點擊「📥 下載結果圖」
2. 開啟新頁面顯示圖片預覽
3. 長按圖片，選擇「儲存圖片」
4. ✅ 完成

## 瀏覽器相容性

| 功能 | iOS Safari | Android Chrome | 桌面 Chrome | 桌面 Safari |
|------|-----------|----------------|-------------|-------------|
| Web Share API (檔案) | ✅ iOS 15+ | ✅ | ❌ | ❌ |
| 長按儲存圖片 | ✅ | ✅ | N/A | N/A |
| 下載連結 | ✅ | ✅ | ✅ | ✅ |

## 優勢

1. **手機友善**：優先使用系統原生分享功能，體驗更流暢
2. **多種備用方案**：確保所有裝置都能順利保存圖片
3. **清晰引導**：圖片預覽頁面提供明確的操作提示
4. **一鍵多用**：除了保存，還可以直接分享到社群 App

## 需要修改的檔案

1. **`js/share.js`**：
   - 修改 `generateShareImage()` 方法
   - 新增 `downloadBlob()` 輔助方法

## 測試計劃

1. **iOS Safari 測試**：
   - 測試 Web Share API 是否正常運作
   - 測試圖片預覽備用方案
   - 測試長按儲存功能

2. **Android Chrome 測試**：
   - 測試 Web Share API 是否正常運作
   - 測試圖片預覽備用方案

3. **桌面瀏覽器測試**：
   - 測試下載功能是否正常

4. **跨瀏覽器測試**：
   - Line 內建瀏覽器
   - Instagram 內建瀏覽器
   - Facebook 內建瀏覽器

## 備註

- Web Share API 的 `files` 支援需要 HTTPS 環境（GitHub Pages 預設支援）
- 部分較舊的行動裝置可能不支援 Web Share API，會自動降級到圖片預覽方案
- 圖片預覽頁面會在使用者關閉後自動清理 blob URL
