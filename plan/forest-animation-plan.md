# 森林探索動畫效果規劃

## 設計概念

透過漸進式的視覺動畫，營造「從森林外圍逐步深入，最終找到自我」的探索旅程感。每答一題，使用者彷彿往森林更深處前進，最終在森林核心發現屬於自己的植物人格。

---

## 視覺層次設計

### 1. 背景層次結構
使用多層次視差效果模擬森林深度：

- **Layer 1（最遠景）**：淡色樹影剪影
- **Layer 2（中景）**：漸層霧氣效果
- **Layer 3（近景）**：葉片/枝條裝飾元素
- **Layer 4（前景）**：測驗內容區塊

### 2. 進度視覺化
- 進度條改為「森林小徑」設計
- 每完成一題，小徑上出現腳印或發光點
- 題號顯示為「第 N 步/共 10 步」

---

## 動畫效果規劃

### A. 開始畫面
**主題**：森林入口，陽光灑落

**動效**：
- 背景：淡色森林剪影，輕微搖曳動畫
- 光線：柔和光束從上方射入（CSS gradient animation）
- 按鈕：hover 時產生漣漪擴散效果

---

### B. 題目切換動畫
**主題**：往森林深處前進

**每題切換時的效果**（題號 1→10 漸進變化）：

#### 視覺變化
1. **背景漸深**：
   - 第 1-3 題：明亮森林入口（淺綠色系）
   - 第 4-6 題：林間小徑（中綠色系，增加樹影）
   - 第 7-9 題：深林探索（深綠色系，霧氣增加）
   - 第 10 題：森林核心（神秘光暈，等待揭曉）

2. **霧氣密度**：
   - 使用 CSS `backdrop-filter: blur()` 或半透明層
   - 霧氣透明度隨題號遞增：`opacity: 0.1 * questionNumber`

3. **樹影數量**：
   - 遠景樹木剪影逐漸增多
   - 使用絕對定位的 SVG 或 CSS shapes

#### 切換動效
**方向感設計**：
- 上一題內容：向左淡出（fade-out-left）+ 縮小 (scale 0.95)
- 新題目內容：從右淡入（fade-in-right）+ 放大 (scale 1.05 → 1)
- 背景層：緩慢向左平移（視差效果）

**動畫時序**：
```
使用者點擊選項
  ↓
選項高亮確認 (0.3s)
  ↓
當前題目淡出 + 背景變深 (0.5s)
  ↓
新題目淡入 (0.5s)
```

---

### C. 結果揭曉動畫
**主題**：抵達森林核心，發現真實自我

**動效序列**：
1. **過場動畫**（2-3 秒）：
   - 第 10 題完成後，畫面整體漸暗
   - 出現「深入森林核心...」文字提示
   - 光芒從中心擴散（radial gradient animation）

2. **植物現身**：
   - 植物 icon 從小到大彈出（scale 0 → 1.2 → 1）
   - 使用 `cubic-bezier` 緩動函數營造彈性感

3. **資訊展開**：
   - 植物名稱、描述、座標圖依序淡入
   - 使用 stagger animation（錯開 0.1-0.2s）

4. **背景效果**：
   - 根據植物類型顯示對應色調的光暈
   - 細微的粒子飄散效果（optional，可用 CSS animation）

---

## 技術實作方案

### 1. 新增檔案
建立 `js/animations.js` 模組，負責所有動畫邏輯：

```javascript
export class AnimationManager {
  constructor() {
    this.currentDepth = 0; // 當前森林深度 (0-10)
  }

  // 初始化背景層
  initBackgroundLayers() { }

  // 更新森林深度（題號變化時調用）
  updateForestDepth(questionNumber) { }

  // 題目切換動畫
  transitionToNextQuestion(direction = 'forward') { }

  // 結果揭曉動畫
  revealResult(plantType) { }
}
```

### 2. 修改現有檔案

#### `css/style.css`
新增動畫相關樣式：
- CSS 變數：`--forest-depth`、`--fog-opacity`
- Keyframes：`fadeInRight`、`fadeOutLeft`、`expandLight`、`popIn`
- 背景層類別：`.bg-layer-far`、`.bg-layer-mid`、`.bg-layer-near`

#### `js/ui.js`
- 導入 `AnimationManager`
- 在 `showQuestionScreen()` 中調用動畫
- 在 `showResultScreen()` 中調用揭曉動畫

#### `index.html`
新增背景層 DOM 結構：
```html
<div class="forest-background">
  <div class="bg-layer bg-layer-far"></div>
  <div class="bg-layer bg-layer-mid"></div>
  <div class="bg-layer bg-layer-near"></div>
</div>
```

---

## 效能考量

### 優化策略
1. **使用 CSS transforms**：
   - 避免觸發 layout/paint，只用 `transform` 和 `opacity`
   - 利用 GPU 加速 (`will-change` 屬性)

2. **減少 DOM 操作**：
   - 背景層在初始化時就建立，僅修改 CSS 變數
   - 使用 `requestAnimationFrame` 協調動畫

3. **圖片優化**：
   - 若使用 PNG/SVG 背景圖，確保檔案壓縮
   - 考慮使用 CSS 繪製簡單形狀（減少網路請求）

### 效能目標
- 動畫流暢度：60 FPS
- 頁面載入時間：< 2 秒
- 行動裝置相容性：iOS Safari / Android Chrome

---

## 響應式設計

### 螢幕尺寸調整
- **桌面版（>520px）**：完整多層背景 + 視差效果
- **行動版（≤520px）**：簡化背景層，減少霧氣模糊效果

### 動畫降級
- 使用 `prefers-reduced-motion` 媒體查詢
- 偵測到使用者偏好時，關閉複雜動畫，保留基本淡入淡出

---

## 實作步驟

1. **Phase 1：背景系統**
   - 建立 `animations.js` 檔案
   - 在 `style.css` 新增背景層樣式
   - 在 `index.html` 新增 DOM 結構

2. **Phase 2：題目切換動畫**
   - 實作 `transitionToNextQuestion()`
   - 整合到 `ui.js` 的 `showQuestionScreen()`
   - 加入深度漸進邏輯

3. **Phase 3：結果揭曉動畫**
   - 實作 `revealResult()`
   - 整合到 `showResultScreen()`

4. **Phase 4：細節優化**
   - 調整動畫時序與緩動函數
   - 新增進度視覺化（森林小徑）
   - 測試效能與響應式表現

---

## 未來擴充可能

- **音效整合**：森林環境音、腳步聲（需使用者互動後播放）
- **粒子系統**：飄落的葉片、光點（使用 Canvas 或 CSS animation）
- **互動彩蛋**：點擊背景樹木出現小動物
- **深色模式**：夜間森林主題

---

## 相容性確認

**目標瀏覽器**：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

**測試要點**：
- CSS `backdrop-filter` 支援度（iOS Safari 需 `-webkit-` 前綴）
- ES6 模組在舊版 Safari 的表現
- 動畫在低階行動裝置的流暢度
