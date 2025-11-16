# 結果過場動畫隱藏 Container 規劃

## 需求分析

在 `revealResultWithForest` 方法（js/animations.js:503-535）的 2 秒過場動畫期間，需要隱藏 `.container` 元素，以營造更沉浸的過場體驗。

## 現況分析

### 當前流程（js/animations.js:503-535）

```javascript
async revealResultWithForest(plantColor, resultElement) {
  return new Promise((resolve) => {
    const container = document.querySelector('.container') || document.body;

    // 1. 建立過場遮罩
    const overlay = document.createElement('div');
    overlay.className = 'result-transition-overlay';
    overlay.innerHTML = '<div class="transition-text">深入森林核心...</div>';
    container.appendChild(overlay);

    // 2. 過場動畫（2秒）
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
    }, 2000);
  });
}
```

### 現有 CSS（style.css:1005-1066）

- `.result-transition-overlay`：全螢幕遮罩，z-index: 9999
- 動畫 `expandLight`：2 秒展開光芒效果
- `.result-transition-overlay.fade-out`：0.5 秒淡出
- `.transition-text`：「深入森林核心...」文字脈動

### 問題點

1. **Container 仍然可見**：過場遮罩雖然蓋住畫面，但 container 仍在背後渲染
2. **效能浪費**：隱藏的 container 仍佔用渲染資源
3. **體驗不連貫**：遮罩淡出後直接跳到結果畫面，缺乏平滑過渡

## 解決方案

### 方案一：在過場期間隱藏 Container（推薦）

**優點**：
- 最簡單直接
- 效能最佳（不渲染隱藏元素）
- 符合使用者需求

**缺點**：
- 需要確保遮罩正確插入到 body，而非 container 內部

**實作步驟**：

1. **修改遮罩插入位置**（js/animations.js:505-511）
   ```javascript
   // 將遮罩插入到 body，而非 container
   // 原本：container.appendChild(overlay);
   // 改為：document.body.appendChild(overlay);
   ```

2. **在過場開始時隱藏 container**（js/animations.js:511 後新增）
   ```javascript
   // 隱藏 container（過場期間完全不可見）
   container.style.opacity = '0';
   container.style.transition = 'opacity 0.3s ease-out';
   ```

3. **在過場結束前恢復 container**（js/animations.js:514-518 之間）
   ```javascript
   setTimeout(() => {
     // 在遮罩淡出前，先恢復 container（避免閃爍）
     container.style.opacity = '1';

     overlay.classList.add('fade-out');

     setTimeout(() => {
       overlay.remove();
       // ... 其餘邏輯
     }, 500);
   }, 2000);
   ```

### 方案二：使用 visibility + pointer-events（備選）

**優點**：
- 保留 DOM 結構
- 可配合其他動畫效果

**缺點**：
- 較複雜
- 仍會佔用部分渲染資源

**實作步驟**：

1. 過場開始時：
   ```javascript
   container.style.visibility = 'hidden';
   container.style.pointerEvents = 'none';
   ```

2. 過場結束前：
   ```javascript
   container.style.visibility = 'visible';
   container.style.pointerEvents = 'auto';
   ```

## 時間軸規劃

```
t=0ms     建立遮罩 + 隱藏 container
          ↓
          expandLight 動畫開始（2秒）
          「深入森林核心...」文字脈動
          ↓
t=1700ms  恢復 container 可見性（提前 300ms，避免閃爍）
          ↓
t=2000ms  遮罩開始淡出（fadeOutOverlay, 0.5秒）
          ↓
t=2500ms  移除遮罩
          顯示結果元素
          觸發 animateResultElements()
          ↓
          resolve()
```

## 程式碼修改清單

### 檔案：js/animations.js

**修改位置：revealResultWithForest 方法（第 503-535 行）**

```javascript
async revealResultWithForest(plantColor, resultElement) {
  return new Promise((resolve) => {
    const container = document.querySelector('.container') || document.body;

    // 1. 建立過場遮罩（插入到 body，而非 container）
    const overlay = document.createElement('div');
    overlay.className = 'result-transition-overlay';
    overlay.innerHTML = '<div class="transition-text">深入森林核心...</div>';
    document.body.appendChild(overlay); // 改為插入到 body

    // 1.5. 隱藏 container
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease-out';

    // 2. 過場動畫（2秒）
    setTimeout(() => {
      // 2.5. 提前恢復 container（避免淡出時閃爍）
      container.style.opacity = '1';

      // 延遲 200ms 再開始淡出遮罩（確保 container 已淡入）
      setTimeout(() => {
        overlay.classList.add('fade-out');

        setTimeout(() => {
          overlay.remove();

          // 清除 inline style，恢復 CSS 控制
          container.style.opacity = '';
          container.style.transition = '';

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
    }, 1800); // 原本 2000ms，提前 200ms 開始恢復
  });
}
```

### 檔案：css/style.css

**無需修改**（現有 CSS 已足夠）

## 測試計劃

1. **視覺檢查**：
   - [ ] 過場開始時，container 是否完全不可見
   - [ ] 過場期間，遮罩是否覆蓋整個螢幕
   - [ ] 遮罩淡出時，container 是否已恢復可見（無閃爍）
   - [ ] 結果元素是否順利彈出

2. **時間軸驗證**：
   - [ ] 過場動畫是否準確維持 2 秒
   - [ ] 恢復時機是否自然（無跳躍感）

3. **邊界情況**：
   - [ ] container 為 null 時是否正常運作
   - [ ] 快速重複觸發時是否穩定
   - [ ] 不同裝置/瀏覽器是否一致

4. **效能檢查**：
   - [ ] 使用 DevTools Performance 確認過場期間 container 未渲染

## 風險評估

| 風險項目 | 影響程度 | 應對措施 |
|---------|---------|---------|
| 遮罩插入到 body 導致樣式問題 | 低 | 遮罩使用 fixed 定位，不受父元素影響 |
| 時間軸不同步導致閃爍 | 中 | 提前恢復 container，預留緩衝時間 |
| 舊瀏覽器不支援 opacity 過渡 | 低 | 現代瀏覽器皆支援，舊版可降級為直接切換 |

## 備註

- 此修改不影響其他動畫方法
- 保持向後相容性（container 為 null 時使用 body）
- 遵循專案「模組化、無外部相依」原則
