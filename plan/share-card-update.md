# 分享結果圖優化設計

**狀態：📝 規劃中**

## 需求描述

調整下載結果圖模板的設計：
1. 高度從 1350px 調整為 1600px（保持寬度 1080px）
2. 在「與你相處的植物們」區域中，為每個植物類型（另一半/朋友/仇人）加上對應的植物圖片

## 現況分析

### 目前的分享圖片設計
- 尺寸：1080 × 1350 px（4:5 比例，IG 貼文最佳尺寸）
- 結構（從上到下）：
  1. **頭部區域**：品牌標題「🌿 找到你的情緒座標」
  2. **植物資訊區域**：圖示 emoji + 植物名稱 + tagline
  3. **並排區域**：座標圖（左）+ 香氣推薦（右）
  4. **關係區域**：橫排三欄（另一半/朋友/仇人），只顯示文字
  5. **頁尾 CTA**：網址和引導文字

### 關係區域目前設計
- 三欄橫排，每欄包含：
  - Emoji 圖示（💝、👫、⚡）
  - 關係標籤（另一半、朋友、仇人）
  - 植物名稱（文字）
- **缺少植物圖片**

### 可用的植物圖片
根據檔案系統，在 `images/` 目錄下有以下植物圖片：
- `薰衣草.jpg` → lavender
- `扁柏.jpg` → cypress
- `檜木.jpg` → hinoki
- `洋甘菊.jpg` → chamomile
- `薄荷.jpg` → mint
- `牡丹.jpg` → peony

在 `js/data/plants.js` 中已有 `getPlantImage(key)` 輔助函式可以取得圖片路徑。

## 設計方案

### 1. 調整畫布高度

將分享卡片高度從 1350px 調整為 1600px，增加 250px 空間用於顯示植物圖片。

**修改檔案**：`css/share-card.css`

```css
.ig-share-card {
  width: 1080px;
  height: 1600px; /* 從 1350px 調整為 1600px */
  /* ... 其他樣式保持不變 ... */
}
```

### 2. 關係區域加入植物圖片

在每個關係項目中加入植物圖片，調整設計為垂直排列：
- 植物圖片（圓形裁切，140×140px）
- Emoji 圖示
- 關係標籤
- 植物名稱

**視覺設計**：
```
┌─────────────────────────────┐
│  🌱 與你相處的植物們          │
├─────────────────────────────┤
│    💝      👫      ⚡       │
│   另一半    朋友     仇人     │
│  檜木型   洋甘菊型   薄荷葉型  │
│   [圓形]   [圓形]   [圓形]   │
│   植物圖   植物圖   植物圖   │
└─────────────────────────────┘
```

**修改檔案**：
1. `js/share.js` - 修改 `createShareCardDOM()` 方法
2. `css/share-card.css` - 調整關係區域樣式

### 3. html2canvas 設定更新

調整截圖高度以對應新的畫布尺寸。

**修改檔案**：`js/share.js`

```javascript
const canvas = await html2canvas(shareCard, {
  width: 1080,
  height: 1600, // 從 1350 調整為 1600
  scale: 1,
  backgroundColor: '#fffaf5',
  logging: false,
  useCORS: true,
  allowTaint: true
});
```

## 實作細節

### A. 修改 `js/share.js` - createShareCardDOM() 方法

在關係區域的 HTML 生成部分，加入圖片元素：

```javascript
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
```

**注意**：需要在檔案開頭 import `getPlantImage` 函式：
```javascript
import { getPlantImage } from './data/plants.js';
```

### B. 修改 `css/share-card.css` - 關係區域樣式

新增植物圖片樣式，調整區域高度和間距：

```css
/* 關係區域 */
.ig-share-card__relations {
  width: 100%;
  background: #fff3e4;
  padding: 28px 32px 32px; /* 增加內距 */
  border-radius: 16px;
}

.ig-share-card__relations-title {
  font-size: 28px;
  font-weight: 600;
  color: #4a3427;
  margin: 0 0 24px 0; /* 增加下方間距 */
  text-align: center;
}

.ig-share-card__relations-grid {
  display: flex;
  gap: 24px; /* 增加間距 */
  justify-content: space-between;
}

.ig-share-card__relation-item {
  flex: 1;
  text-align: center;
  background: #fffdf8;
  padding: 24px 12px; /* 增加內距 */
  border-radius: 12px;
  border: 2px solid #f0e0d2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; /* 子元素間距 */
}

/* 新增：植物圖片樣式 */
.ig-share-card__relation-image {
  width: 140px;
  height: 140px;
  border-radius: 50%; /* 圓形裁切 */
  object-fit: cover; /* 圖片填滿裁切區域 */
  border: 4px solid #f0e0d2; /* 圖片邊框 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 柔和陰影 */
}

.ig-share-card__relation-emoji {
  font-size: 40px; /* 從 48px 縮小 */
  display: block;
  margin: 0; /* 移除 margin */
}

.ig-share-card__relation-label {
  font-size: 20px;
  color: #a17453;
  font-weight: 600;
  display: block;
  margin: 0; /* 移除 margin */
}

.ig-share-card__relation-name {
  font-size: 24px;
  font-weight: 700;
  color: #4a3427;
  display: block;
}
```

## 尺寸與比例調整

### 原始設計（1080 × 1350 px）
- 比例：4:5（IG 最佳比例）
- 區域分配估算：
  - 頭部：~120px
  - 植物資訊：~250px
  - 並排區域（座標+香氣）：~520px
  - 關係區域：~180px
  - 頁尾：~120px
  - 邊距與間距：~160px

### 新設計（1080 × 1600 px）
- 比例：約 27:40（仍在 IG 支援範圍內）
- 區域分配估算：
  - 頭部：~120px（不變）
  - 植物資訊：~250px（不變）
  - 並排區域（座標+香氣）：~520px（不變）
  - **關係區域：~320px**（+140px，用於圖片）
  - 頁尾：~120px（不變）
  - 邊距與間距：~270px（+110px）

新增的 250px 空間分配：
- 關係區域圖片高度：140px
- 關係區域內距增加：40px（上下各 20px）
- 其他區域間距增加：70px

## CORS 考量

由於 html2canvas 需要載入本地圖片，需確保：
1. 圖片與網頁同源（GitHub Pages，同域名）
2. html2canvas 設定 `useCORS: true` 和 `allowTaint: true`（已設定）
3. 測試時確認圖片正確載入

## 需要修改的檔案

1. **`css/share-card.css`**：
   - 調整 `.ig-share-card` 高度為 1600px
   - 調整關係區域樣式，增加圖片樣式

2. **`js/share.js`**：
   - 在檔案開頭 import `getPlantImage` 函式
   - 修改 `createShareCardDOM()` 方法，加入植物圖片元素
   - 修改 `generateInstagramImage()` 方法中的 html2canvas 高度設定為 1600

## 測試計劃

1. **視覺測試**：
   - 檢查圖片是否正確載入
   - 檢查圓形裁切是否正確
   - 檢查各元素間距是否合理
   - 檢查整體排版是否平衡

2. **功能測試**：
   - 測試所有六種植物類型的分享圖生成
   - 確認圖片尺寸為 1080 × 1600
   - 確認圖片品質清晰

3. **跨瀏覽器測試**：
   - 桌面 Chrome
   - 桌面 Safari
   - iOS Safari
   - Android Chrome

4. **CORS 測試**：
   - 確認圖片在 html2canvas 截圖時正常顯示
   - 如有問題，檢查 console 錯誤訊息

## 備註

- IG 支援多種圖片比例，1080 × 1600 仍在支援範圍內
- 圖片高度增加可能讓內容更豐富，但需注意手機上查看時的完整性
- 植物圖片需使用 `object-fit: cover` 確保在圓形框內正確顯示
- 考慮到不同植物圖片的構圖，可能需要微調裁切位置
