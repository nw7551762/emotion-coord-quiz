# Header 隨森林深度漸進淡出

**狀態：❌ 已取消 - 改為保持 header 始終顯示**

使用者要求 header 在所有情況下都保持完全顯示，不進行淡出效果。

## 問題描述

當使用者深入森林（第 7-10 題）時，header「🌿 找到你的情緒座標」仍然完全顯示，破壞了沉浸式的森林探索體驗。背景已經放大到 zoom-10（深處），但 header 依然清晰可見，視覺上不協調。

## 設計目標

實作漸進式 header 淡出效果，**只在答題畫面**配合森林深度動畫：

- **第 1-3 題**：header 完全顯示（opacity: 1）
- **第 4-6 題**：header 開始淡出（opacity: 0.6 → 0.3）
- **第 7-10 題**：header 完全隱藏（opacity: 0，並設定 pointer-events: none）
- **結果畫面**：header 恢復完全顯示（opacity: 1）✨

## 實作方案

### 1. CSS 調整（`css/style.css`）

在 `.header` 樣式中新增過渡效果：

```css
.header {
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    color: #5c3b2a;
    padding: 28px 24px;
    text-align: center;
    /* 新增過渡效果 */
    transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
                transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 1;
    transform: translateY(0);
}

/* Header 淡出狀態 */
.header.fading {
    opacity: 0.6;
}

.header.faded {
    opacity: 0.3;
}

.header.hidden {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
}
```

**設計說明**：
- 使用與森林背景相同的 `cubic-bezier(0.4, 0, 0.2, 1)` 緩動函數，保持動畫一致性
- `transform: translateY(-10px)` 讓 header 在淡出時微微上移，模擬「消失在森林上方」的感覺
- `pointer-events: none` 確保完全隱藏時不會阻擋點擊

### 2. JavaScript 調整（`js/animations.js`）

在 `updateForestDepth()` 方法中新增 header 控制邏輯：

```javascript
/**
 * 更新森林深度（題號變化時調用）
 * @param {number} questionNumber - 當前題號 (1-10)，0 表示開始畫面
 * @returns {Promise} 更新完成的 Promise
 */
async updateForestDepth(questionNumber) {
    if (!this.forestBg) return;

    this.currentDepth = questionNumber;

    // === 新增：控制 header 淡出 ===
    this.updateHeaderVisibility(questionNumber);

    // 決定背景圖片階段（每3題換一張）
    let newStage = 1;
    if (questionNumber >= 7) {
        newStage = 3; // 第 7-10 題：森林深處
    } else if (questionNumber >= 4) {
        newStage = 2; // 第 4-6 題：森林中段
    } else {
        newStage = 1; // 第 0-3 題：森林入口
    }

    // ... 其餘程式碼保持不變
}

/**
 * 更新 header 顯示狀態（配合森林深度）
 * @param {number} questionNumber - 當前題號 (0-10)
 */
updateHeaderVisibility(questionNumber) {
    const header = document.querySelector('.header');
    if (!header) return;

    // 移除所有淡出類別
    header.classList.remove('fading', 'faded', 'hidden');

    if (questionNumber === 0) {
        // 開始畫面：完全顯示
        // 不需要加任何類別
    } else if (questionNumber >= 1 && questionNumber <= 3) {
        // 第 1-3 題：完全顯示
        // 不需要加任何類別
    } else if (questionNumber >= 4 && questionNumber <= 5) {
        // 第 4-5 題：開始淡出 (opacity: 0.6)
        header.classList.add('fading');
    } else if (questionNumber === 6) {
        // 第 6 題：更淡 (opacity: 0.3)
        header.classList.add('faded');
    } else if (questionNumber >= 7) {
        // 第 7-10 題：完全隱藏
        header.classList.add('hidden');
    }
}
```

### 3. 重置邏輯調整（`js/animations.js`）

在 `resetForest()` 方法中新增 header 重置：

```javascript
/**
 * 重置森林動畫狀態
 */
resetForest() {
    this.currentDepth = 0;
    this.updateForestDepth(0);

    // === 新增：重置 header 狀態 ===
    const header = document.querySelector('.header');
    if (header) {
        header.classList.remove('fading', 'faded', 'hidden');
    }

    // 重置背景（回到第一階段，無放大）
    if (this.forestBg) {
        this.forestBg.classList.remove('stage-2', 'stage-3');
        this.forestBg.classList.add('stage-1');

        for (let i = 1; i <= 10; i++) {
            this.forestBg.classList.remove(`zoom-${i}`);
        }
    }

    // ... 其餘程式碼保持不變
}
```

## 視覺效果時間軸

```
題號 0 (開始畫面):
  - Header: 完全顯示 (opacity: 1)
  - 背景: forest-bg.jpg, 無放大

題號 1-3:
  - Header: 完全顯示 (opacity: 1)
  - 背景: forest-bg.jpg, zoom-1 → zoom-3

題號 4:
  - Header: 開始淡出 (opacity: 0.6) ← 新增
  - 背景: 切換至 forest-mid.jpg, zoom-4

題號 5:
  - Header: 持續淡出 (opacity: 0.6)
  - 背景: forest-mid.jpg, zoom-5

題號 6:
  - Header: 更淡 (opacity: 0.3) ← 新增
  - 背景: forest-mid.jpg, zoom-6

題號 7:
  - Header: 完全隱藏 (opacity: 0) ← 新增
  - 背景: 切換至 forest-fg.jpg, zoom-7

題號 8-10:
  - Header: 完全隱藏 (opacity: 0)
  - 背景: forest-fg.jpg, zoom-8 → zoom-10
```

## 優勢

1. **漸進式體驗**：使用者不會感到突兀，header 隨著森林深入自然消失
2. **視覺一致性**：過渡時間（1.2s）和緩動函數與背景動畫相同
3. **沉浸感提升**：第 7-10 題完全無干擾，使用者專注於測驗內容
4. **可逆性**：重新測驗時 header 會平滑恢復

## 需要修改的檔案

1. **`css/style.css`**：新增 `.header.fading`、`.header.faded`、`.header.hidden` 樣式
2. **`js/animations.js`**：
   - 新增 `updateHeaderVisibility()` 方法
   - 在 `updateForestDepth()` 中呼叫
   - 在 `resetForest()` 中重置 header 狀態

## 測試計劃

1. **功能測試**：
   - 測試第 1-3 題 header 保持完全顯示
   - 測試第 4-5 題 header 淡出至 0.6
   - 測試第 6 題 header 淡出至 0.3
   - 測試第 7-10 題 header 完全隱藏
   - 測試重新測驗時 header 正確恢復

2. **動畫流暢度測試**：
   - 確認 header 淡出與背景放大同步進行
   - 確認過渡時間（1.2s）感覺自然

3. **響應式測試**：
   - 測試行動版（< 520px）效果是否正常

## 預期結果

使用者在答題過程中，會感受到「逐漸深入森林」的沉浸式體驗：
- 初期（第 1-3 題）：在森林入口，頂部標題清晰可見
- 中期（第 4-6 題）：走向森林深處，標題逐漸模糊消失
- 深處（第 7-10 題）：完全沉浸在森林中，標題已經看不見

完美配合既有的背景圖片切換（forest-bg → forest-mid → forest-fg）和放大效果（zoom-1 → zoom-10）。
