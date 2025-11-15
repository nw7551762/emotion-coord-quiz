# 修復背景圖片切換時的空白問題

## 問題描述

每答三題題目切換圖片時,會短暫出現綠色背景而沒有圖片。這是因為:

1. 使用 CSS `::before` 偽元素進行交叉淡化時,新圖片還沒載入完成
2. 瀏覽器在圖片載入期間會顯示背景色(body 的 `#d0e8d5` 綠色)
3. 造成使用者體驗不佳的視覺閃爍

## 根本原因

在 `js/animations.js` 的 `crossfadeBackground()` 方法中:
- 直接設定 `::before` 的 `background-image` 屬性
- 沒有等待圖片載入完成就觸發淡入動畫
- 圖片載入期間顯示綠色背景

## 解決方案

### 方案 1: 預載圖片(建議採用)

**優點:**
- 確保圖片已載入再切換,完全避免空白
- 使用 JavaScript Image 物件預載,可靠性高
- 可以加入載入錯誤處理

**缺點:**
- 需要修改較多程式碼
- 略微增加記憶體使用

**實作步驟:**

1. 在 `AnimationManager` constructor 中新增屬性:
   ```javascript
   this.preloadedImages = {}; // 預載圖片快取
   ```

2. 新增圖片預載方法:
   ```javascript
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
   ```

3. 修改 `crossfadeBackground()` 方法為 async:
   ```javascript
   async crossfadeBackground(fromStage, toStage) {
     if (!this.forestBg) return;

     const images = {
       1: '../images/forest-bg.jpg',
       2: '../images/forest-mid.jpg',
       3: '../images/forest-fg.jpg'
     };

     const nextImageUrl = images[toStage];

     try {
       // 預載圖片
       await this.preloadImage(nextImageUrl);

       // 圖片已載入,安全地開始切換
       // ... 原本的切換程式碼
     } catch (err) {
       // 載入失敗時的處理
       console.error('Background transition failed', err);
     }
   }
   ```

4. 修改 `updateForestDepth()` 呼叫為 await:
   ```javascript
   async updateForestDepth(questionNumber) {
     // ...
     if (newStage !== currentStage) {
       await this.crossfadeBackground(currentStage, newStage);
     }
     // ...
   }
   ```

5. 在 `initBackgroundLayers()` 中預載所有圖片:
   ```javascript
   async initBackgroundLayers() {
     this.forestBg = document.querySelector('.forest-background');

     // 預載所有背景圖片
     const images = [
       '../images/forest-bg.jpg',
       '../images/forest-mid.jpg',
       '../images/forest-fg.jpg'
     ];

     await Promise.all(images.map(url => this.preloadImage(url)));

     this.updateForestDepth(0);
   }
   ```

### 方案 2: 改用雙層 div 交替切換

使用兩個實體 div 元素而非 `::before` 偽元素,交替顯示。

**優點:**
- DOM 結構更清晰
- 更容易控制

**缺點:**
- 需要修改 HTML 結構
- 需要同時修改 CSS 和 JavaScript

(不建議,因為改動範圍較大)

### 方案 3: 使用 CSS `background-blend-mode`

使用 CSS 的混合模式來平滑過渡。

**優點:**
- 純 CSS 解決方案

**缺點:**
- 無法解決圖片未載入的根本問題
- 瀏覽器相容性考量

(不建議,無法根本解決問題)

## 建議實作方案

**採用方案 1: 預載圖片**

這是最可靠的解決方案,可以確保:
1. 圖片完全載入後才開始切換
2. 沒有視覺閃爍或空白
3. 可處理載入錯誤的情況
4. 對使用者體驗影響最小

## 測試計劃

1. **功能測試:**
   - 測試從第 1-3 題切換到第 4 題(stage-1 → stage-2)
   - 測試從第 4-6 題切換到第 7 題(stage-2 → stage-3)
   - 確認沒有綠色背景閃現

2. **效能測試:**
   - 確認圖片預載不會造成初始載入延遲
   - 檢查記憶體使用是否合理

3. **錯誤處理測試:**
   - 模擬圖片載入失敗的情況
   - 確認有適當的降級處理

4. **網路狀況測試:**
   - 測試慢速網路下的表現
   - 確認預載機制正常運作

## 需要修改的檔案

- `js/animations.js` - 主要修改檔案
- `index.html` - 可能需要調整 initBackgroundLayers() 的呼叫方式(改為 await)
