# HTML 轉圖片跑版問題修復規劃

## 問題分析

使用 html2canvas 將結果頁面轉為圖片時可能出現的跑版問題：

### 常見跑版原因

1. **背景元素問題**
   - 固定定位 (fixed position) 的森林背景層無法正確渲染
   - 絕對定位元素可能超出邊界
   - 背景圖片未正確載入

2. **字體與樣式問題**
   - 自訂字體 (web fonts) 未載入完成
   - 漸層背景可能渲染異常
   - CSS 變數未正確解析

3. **尺寸與比例問題**
   - 容器沒有固定寬度，導致圖片尺寸不穩定
   - 響應式設計在截圖時可能產生意外尺寸
   - scale 參數設為 2 可能導致部分元素超出邊界

4. **動畫與過渡效果**
   - 動畫進行中截圖會截到中間狀態
   - CSS transition 可能影響元素位置

5. **外部資源載入**
   - 植物圖片 (relation-img) 若未載入完成會顯示空白
   - CORS 問題可能導致圖片無法渲染

## 解決方案

### 方案 1：優化 html2canvas 配置（推薦）

**調整 share.js 中的 html2canvas 設定：**

```javascript
// 等待所有圖片載入
await this.waitForImages(resultElement);

// 生成圖片時使用更穩定的配置
const canvas = await html2canvas(resultElement, {
  backgroundColor: '#fffaf5', // 使用與 container 相同的背景色
  scale: 2, // 保持高解析度
  logging: false,
  useCORS: true,
  allowTaint: true,
  // 忽略某些元素
  ignoreElements: (element) => {
    // 忽略固定定位的背景
    if (element.classList.contains('forest-background')) return true;
    if (element.classList.contains('loading-screen')) return true;
    return false;
  },
  // 確保字體載入
  onclone: (clonedDoc) => {
    const clonedElement = clonedDoc.querySelector('.result-screen');
    if (clonedElement) {
      // 移除可能導致問題的樣式
      clonedElement.style.overflow = 'visible';
      // 確保有固定寬度
      clonedElement.style.width = '720px';
      clonedElement.style.maxWidth = '720px';
      // 移除動畫
      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
      });
    }
  }
});
```

**新增圖片載入等待函式：**

```javascript
/**
 * 等待元素內所有圖片載入完成
 * @param {HTMLElement} element - 要檢查的元素
 */
async waitForImages(element) {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve; // 即使載入失敗也繼續
    });
  });
  await Promise.all(promises);
}
```

### 方案 2：建立專用分享模板

**建立獨立的分享圖卡樣式：**

1. 建立 `share-card.css`，包含簡化的、固定尺寸的分享卡片樣式
2. 在產生圖片時，複製結果資料到專用的分享卡片 DOM
3. 使用固定尺寸 (例如 1080x1920 適合 IG Stories，或 1080x1080 適合貼文)

**優點：**
- 完全控制輸出格式
- 不受主畫面樣式影響
- 可針對社群平台優化尺寸

**缺點：**
- 需要維護兩套樣式
- 開發成本較高

### 方案 3：使用 Canvas API 手動繪製（終極方案）

直接使用 Canvas API 繪製結果卡片，不依賴 html2canvas：

```javascript
async drawResultCard(resultData, plantData) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  // 繪製背景
  ctx.fillStyle = '#fffaf5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 繪製漸層頭部
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 200);
  gradient.addColorStop(0, '#f6d365');
  gradient.addColorStop(1, '#fda085');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, 200);

  // 繪製文字、圖示等...
  // (需要手動處理所有元素的繪製)
}
```

**優點：**
- 100% 可控，不會跑版
- 效能最佳
- 可產生任意尺寸

**缺點：**
- 實作複雜度高
- emoji 和圖片載入需要額外處理
- 維護成本高

## 採用方案：方案 2 - 建立專用分享模板（IG 優化）

### 設計規格

**Instagram 最佳尺寸選擇：**
- **IG 限時動態 (Stories)**：1080 × 1920 px (9:16)
- **IG 貼文 (Post)**：1080 × 1080 px (1:1)

**採用策略：**
使用 **1080 × 1350 px (4:5)** 作為主要分享格式
- 原因：這是 IG 貼文的最大尺寸比例，在動態牆顯示最完整
- 可同時適用於貼文和限時動態（上下會有少許裁切）

### 實作步驟

#### 步驟 1：建立 `css/share-card.css`

設計專用於截圖的分享卡片樣式：
- 固定尺寸：1080 × 1350 px
- 包含品牌識別（測驗標題、網址）
- 優化資訊密度，確保在手機上清晰可讀
- 使用簡化版座標圖（更大更清楚）
- 精選重點資訊：植物類型、座標、最佳關係（另一半/朋友）、推薦香氣

#### 步驟 2：修改 `js/share.js`

新增方法：
```javascript
async generateInstagramImage(resultKey) {
  // 1. 動態建立分享卡片 DOM
  const shareCard = this.createShareCardDOM(resultKey);
  document.body.appendChild(shareCard);

  // 2. 使用 html2canvas 截圖（固定尺寸，無背景干擾）
  const canvas = await html2canvas(shareCard, {
    width: 1080,
    height: 1350,
    scale: 1,
    backgroundColor: '#fffaf5',
    logging: false
  });

  // 3. 移除臨時 DOM
  document.body.removeChild(shareCard);

  // 4. 轉為圖片並下載/分享
  return canvas;
}
```

#### 步驟 3：整合到現有流程

修改下載按鈕事件，使用新的 IG 專用方法：
- 桌面裝置：直接下載 PNG
- 手機裝置：優先使用 Web Share API，備用開啟預覽視窗

### 分享卡片內容設計

**版面配置（1080 × 1350 px）：**

```
┌─────────────────────────────────┐
│  🌿 找到你的情緒座標              │ ← 標題區 (120px)
├─────────────────────────────────┤
│                                  │
│        🌺 (大型 emoji)           │ ← 植物圖示 (180px)
│                                  │
│         牡丹型                   │ ← 植物名稱 (80px)
│   高能量 × 溫暖 | 光芒四射區      │ ← 副標題 (60px)
│                                  │
├─────────────────────────────────┤
│    [座標圖 - 放大版本]           │ ← 座標視覺化 (400px)
│    標示溫度 × 能量               │
├─────────────────────────────────┤
│  💝 最適合的另一半：檜木型        │ ← 關鍵關係 (120px)
│  👫 最適合的朋友：薰衣草型        │
├─────────────────────────────────┤
│  🔮 推薦香氣：                   │ ← 香氣推薦 (180px)
│  相似香氣：玫瑰、天竺葵           │
│  平衡香氣：薰衣草、佛手柑         │
├─────────────────────────────────┤
│  nw7551762.github.io/            │ ← 網址 CTA (80px)
│  emotion-coord-quiz              │
│  來測測看你的情緒座標！           │
└─────────────────────────────────┘
```

### 優勢

1. **100% 可控**：不受主畫面樣式影響
2. **固定尺寸**：確保輸出一致，不會跑版
3. **IG 優化**：尺寸、字體大小、資訊密度都針對社群分享優化
4. **品牌識別**：包含測驗網址，利於傳播
5. **簡潔清晰**：精選重點資訊，避免過度擁擠

## 測試檢查清單

- [ ] 所有文字是否正確顯示（無截斷、無重疊）
- [ ] 植物圖示 emoji 是否正確顯示
- [ ] 關係卡片的植物圖片是否正確載入
- [ ] 座標圖是否正確渲染（座標點、軸線）
- [ ] 漸層背景是否正常
- [ ] 圖片尺寸是否符合預期
- [ ] 不同裝置（桌面/手機）是否都正常
- [ ] 分享按鈕和重新測驗按鈕是否正確隱藏

## 預期成果

修復後，使用者點擊「📥 下載結果圖」時：
- 桌面裝置：下載完整、無跑版的 PNG 圖片
- 手機裝置：可透過系統分享選單分享或儲存圖片
- 圖片包含所有測驗結果資訊，排版整齊
