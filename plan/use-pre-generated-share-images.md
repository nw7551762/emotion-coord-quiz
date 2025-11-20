# 改用預先生成的分享圖片

## 目標
將分享功能從「即時生成」改為「使用預先生成的 PNG 圖片」，移除 html2canvas 依賴，提升效能。

## 現況分析

### 目前實作
- 使用 html2canvas 即時生成分享圖片
- 在 index.html 中載入 html2canvas CDN
- ShareManager.generateInstagramImage() 動態建立 DOM 並截圖

### 已準備的資源
- `share/` 目錄下已有 6 種植物的預先生成圖片：
  - chamomile.png
  - cypress.png
  - hinoki.png
  - lavender.png
  - mint.png
  - peony.png

## 實作計畫

### 1. 修改 index.html
**檔案**: `/Users/hezhesheng/project/emotion-coord-quiz/index.html`

**變更內容**:
- 移除 html2canvas CDN 引用（第 14 行）
- 移除 share-card.css 引用（第 12 行，因為不再需要動態建立卡片樣式）

**修改位置**:
```html
<!-- 移除這兩行 -->
<link rel="stylesheet" href="css/share-card.css">
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
```

### 2. 重寫 ShareManager 類別
**檔案**: `/Users/hezhesheng/project/emotion-coord-quiz/js/share.js`

**變更邏輯**:

#### 2.1 新增圖片路徑對應
```javascript
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

  // 保留原有的 shareTemplates 和 baseUrl
}
```

#### 2.2 簡化 generateShareImage() 方法
- 移除 `createShareCardDOM()` 方法（不再需要）
- 移除 `generateInstagramImage()` 方法（不再需要）
- 重寫 `generateShareImage()` 為直接載入預先生成的 PNG

**新邏輯**:
```javascript
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
```

#### 2.3 保留的方法
- `downloadBlob()` - 保持不變
- `copyLink()` - 保持不變
- `shareToInstagram()` - 可以保留或移除（目前未使用）
- `shareNative()` - 可以保留或移除（目前未使用）

#### 2.4 移除的方法
- `createShareCardDOM()` - 完全移除
- `generateInstagramImage()` - 完全移除

### 3. 移除不再需要的檔案（可選）
如果 `css/share-card.css` 僅用於分享卡片樣式，可以考慮移除：
- `css/share-card.css`

## 優點與缺點

### 優點 ✅
1. **效能提升**: 不需要即時渲染 DOM，分享速度更快
2. **減少依賴**: 移除 html2canvas (約 300KB)，減少頁面載入時間
3. **一致性**: 所有使用者看到的分享圖都完全一致
4. **穩定性**: 不會因為瀏覽器相容性問題導致生成失敗

### 缺點 ❌
1. **缺乏靈活性**: 無法動態客製化內容（如加入使用者名稱）
2. **維護成本**: 每次更新設計需要重新生成 6 張圖片
3. **檔案大小**: 需要額外儲存 6 張 PNG 檔案

## 測試檢查項目

實作完成後需測試：
1. ✅ 桌面版點擊「📥 分享結果圖」能正常下載 PNG
2. ✅ 手機版點擊能觸發原生分享或開啟圖片預覽
3. ✅ 6 種植物類型都能正確對應到正確的圖片
4. ✅ 移除 html2canvas 後頁面載入速度有所提升
5. ✅ 確認 share/ 目錄下的 PNG 檔案路徑正確
6. ✅ 「🔗 複製連結」功能仍正常運作

## 向後相容性
此變更不影響：
- 測驗核心邏輯
- UI 顯示
- 其他分享功能（複製連結、追蹤 IG）
