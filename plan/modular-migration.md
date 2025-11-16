# 模組化架構遷移規劃

## 📋 專案目標

將 `index.html` 從單一檔案架構遷移到模組化架構，同時：
1. **保留** index.html 的視覺設計（綠色系 Nuvayae 品牌風格）
2. **整合** js/ 目錄下的進階功能（動畫、反饋、分享）
3. **修正** 元件與 index.html 設計的不一致之處
4. **統一** 圖片路徑和命名規範

---

## 🎨 Index.html 設計特色分析

### **視覺風格**
- **配色方案**: 深綠色系 + 米白色
  - 主背景: `linear-gradient(135deg, rgba(45,62,45,0.85) 0%, rgba(74,95,74,0.88) 50%, rgba(61,79,61,0.85) 100%)`
  - 品牌 Header: `linear-gradient(135deg, rgba(45,62,45,0.95) 0%, rgba(61,79,61,0.95) 100%)`
  - 按鈕: `linear-gradient(135deg, #3d4f3d 0%, #2d3e2d 100%)`
  - 容器背景: `rgba(255,250,245,0.98)` + `backdrop-filter: blur(10px)`
- **字體**: `'Noto Serif TC', 'Cormorant Garamond', serif`
- **邊框**: 圓角 12-20px，淺棕色邊框 `#d4c5b0`

### **HTML 結構**
```
.container
  ├── .brand-header
  │   ├── .brand-logo (NUVAYAE SCENT LAB)
  │   ├── h1 (🌿 找到你的情緒座標)
  │   └── p (來自台灣的香氣研製所)
  ├── .content
  │   ├── #startScreen (.start-screen)
  │   ├── #questionScreen (.question-screen)
  │   │   ├── .progress-bar > .progress-fill
  │   │   ├── .question-number
  │   │   ├── .question-text
  │   │   └── .options > .option
  │   └── #resultScreen (.result-screen)
  │       ├── .plant-icon / .plant-name / .plant-tagline / .description
  │       ├── .coord-container
  │       ├── .relation-section
  │       ├── .scent-section
  │       └── .share-section
  └── .brand-footer
```

### **與模組化版本的差異**

| 特性 | index.html | css/style.css (模組化) |
|------|-----------|----------------------|
| Header 類別名 | `.brand-header` | `.header` |
| 主配色 | 深綠色系 (#2d3e2d) | 橘黃色系 (#f6d365, #fda085) |
| 字體 | Noto Serif TC, Cormorant Garamond | Noto Sans TC |
| 品牌 Logo | 有 `.brand-logo` | 無 |
| Footer | 有 `.brand-footer` | 無 |
| 進度條 ID | `progressFill` | `progressBar` |
| 問題編號文字 | "問題 X / 10" | "第 X 步 / 共 10 步" |

---

## 📦 元件整合策略

### **Phase 1: 準備工作**

#### 1.1 修正圖片路徑不一致問題
**問題**:
- index.html 使用: `images/{key}.png` (如 `images/lavender.png`)
- plants.js 使用: `images/{中文名}.jpg` (如 `images/薰衣草.jpg`)

**解決方案**: 統一使用 JPG 格式與中文名稱（保留 plants.js 的實作）
```javascript
// index.html 需要修改為使用 plants.js 的 getPlantImage 函式
// plants.js 保持不變:
export function getPlantImage(key) {
    const plantNameMap = {
        lavender: "薰衣草",
        cypress: "扁柏",
        hinoki: "檜木",
        chamomile: "洋甘菊",
        mint: "薄荷",
        peony: "牡丹"
    };
    return "images/" + plantNameMap[key] + ".jpg";
}
```

**需要確認**: 確保 `images/` 目錄下有以下圖片檔案：
- `薰衣草.jpg`
- `扁柏.jpg`
- `檜木.jpg`
- `洋甘菊.jpg`
- `薄荷.jpg`
- `牡丹.jpg`

#### 1.2 建立新的 CSS 檔案（保留 index.html 設計）
將 index.html 的 `<style>` 內容提取到:
- `css/index-style.css` - 主樣式（基於 index.html）
- 保留 `css/share-card.css` - Instagram 分享卡片

#### 1.3 更新 UI 元件以適配 index.html 結構
**需要修改的元件**:
- `js/ui.js` - UIManager
  - 修改進度條更新邏輯（ID 從 `progressBar` 改為 `progressFill`）
  - 修改題目編號文字格式（從 "第 X 步 / 共 10 步" 改為 "問題 X / 10"）
  - 保留 feedback 和 progressInsight 相關程式碼（將在 Phase 3.2 整合）

---

### **Phase 2: 核心模組整合**

#### 2.1 建立主應用入口 (js/app.js)
```javascript
import { QuizManager } from './quiz.js';
import { UIManager } from './ui.js';
import { ShareManager } from './share.js';

class App {
  constructor() {
    this.quiz = new QuizManager();
    this.ui = new UIManager();
    this.share = new ShareManager();
    this.currentResultKey = null;

    this.bindEvents();
  }

  bindEvents() {
    // 綁定全域函式到 window（保持與 onclick 屬性相容）
    window.startQuiz = () => this.startQuiz();
    window.restartQuiz = () => this.restartQuiz();
    window.copyLink = () => this.copyLink();
    window.downloadResultImage = () => this.downloadResultImage();
  }

  startQuiz() { /* ... */ }
  selectAnswer(type) { /* ... */ }
  showResult() { /* ... */ }
  restartQuiz() { /* ... */ }
  copyLink() { /* ... */ }
  downloadResultImage() { /* ... */ }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
```

#### 2.2 修改 index.html 結構
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <!-- ... 原有的 meta 和 link ... -->
    <link rel="stylesheet" href="css/index-style.css">
    <link rel="stylesheet" href="css/share-card.css">

    <!-- 載入 html2canvas (用於分享圖片生成) -->
    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
</head>
<body>
    <!-- 原有的 HTML 結構保持不變 -->

    <!-- 移除原有的 <script> 標籤內的所有程式碼 -->
    <!-- 改用模組載入 -->
    <script type="module" src="js/app.js"></script>
</body>
</html>
```

---

### **Phase 3: 進階功能整合（可選）**

#### 3.1 動畫系統整合 - 啟用森林背景動畫
**策略**: 將森林背景整合到 index.html 設計中

**需要的 HTML 修改**:
```html
<body>
  <!-- 新增森林背景層 -->
  <div class="forest-background stage-1"></div>

  <div class="container">
    <!-- 原有內容保持不變 -->
  </div>
</body>
```

**需要的 CSS 新增**:
```css
/* 森林背景層 */
.forest-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: opacity 2s ease, transform 20s ease-out;
}

/* 背景圖片階段 */
.forest-background.stage-1 {
  background-image: url('../images/forest-bg.jpg');
}

.forest-background.stage-2 {
  background-image: url('../images/forest-mid.jpg');
}

.forest-background.stage-3 {
  background-image: url('../images/forest-fg.jpg');
}

/* 背景切換過渡效果 */
.forest-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 2s ease;
}

.forest-background.transitioning::before {
  opacity: 1;
}

/* 放大效果（題號越大，放大越多） */
.forest-background.zoom-1 { transform: scale(1.05); }
.forest-background.zoom-2 { transform: scale(1.08); }
.forest-background.zoom-3 { transform: scale(1.11); }
.forest-background.zoom-4 { transform: scale(1.14); }
.forest-background.zoom-5 { transform: scale(1.17); }
.forest-background.zoom-6 { transform: scale(1.20); }
.forest-background.zoom-7 { transform: scale(1.23); }
.forest-background.zoom-8 { transform: scale(1.26); }
.forest-background.zoom-9 { transform: scale(1.29); }
.forest-background.zoom-10 { transform: scale(1.32); }

/* 確保 container 在背景之上 */
.container {
  position: relative;
  z-index: 1;
}

/* 移除或調整原有的 body 背景漸層 */
body {
  background: #2d3e2d; /* 改為純色，避免與森林背景衝突 */
}

body::before {
  /* 可以保留或移除，視覺效果需測試後決定 */
  opacity: 0.3; /* 降低透明度，避免過度遮蓋森林背景 */
}
```

**需要的圖片資源**:
- `images/forest-bg.jpg` - 森林入口（第 0-3 題）
- `images/forest-mid.jpg` - 森林中段（第 4-6 題）
- `images/forest-fg.jpg` - 森林深處（第 7-10 題）

**實作方式**:
```javascript
// js/app.js
import { AnimationManager } from './animations.js';

class App {
  constructor() {
    // ...
    this.animations = new AnimationManager();
    this.initAnimations();
  }

  async initAnimations() {
    // 初始化背景層
    await this.animations.initBackgroundLayers();
  }

  async showQuestion() {
    const questionNumber = this.quiz.getCurrentQuestionNumber();

    // 更新森林深度（背景圖切換 + 放大效果）
    await this.animations.updateForestDepth(questionNumber);

    // 顯示題目
    this.ui.updateQuestion(
      this.quiz.getCurrentQuestion(),
      questionNumber,
      this.quiz.getTotalQuestions(),
      this.quiz.getProgress()
    );

    // 淡入動畫
    await this.animations.fadeIn(this.ui.questionScreen, 300);
  }

  async showResult() {
    // ...
    const resultKey = this.quiz.calculateResult();
    const plantColor = plantData[resultKey].color;

    // 森林核心揭曉動畫
    await this.animations.revealResultWithForest(plantColor, this.ui.resultScreen);

    // 渲染結果
    this.ui.renderResult(resultKey);
  }

  restartQuiz() {
    // ...
    // 重置森林背景
    this.animations.resetForest();
  }
}
```

**啟用的動畫效果**:
- ✅ 森林背景層隨題號切換（每 3 題換一張圖）
- ✅ 背景逐漸放大效果（模擬深入森林）
- ✅ 背景圖片交叉淡化過渡
- ✅ 題目切換淡入淡出
- ✅ 結果揭曉森林核心動畫
- ✅ 結果元素依序彈出動畫

#### 3.2 即時反饋系統整合 - 啟用完整反饋功能
**策略**: 新增反饋元素到 index.html，提供更好的互動體驗

**需要的 HTML 修改**:
```html
<!-- 在 .question-screen 中新增 -->
<div class="question-screen" id="questionScreen">
  <div class="progress-bar">
    <div class="progress-fill" id="progressFill"></div>
  </div>

  <!-- 新增：階段性提示 -->
  <div id="progressInsight" class="progress-insight"></div>

  <div class="question-number" id="questionNumber">問題 1 / 10</div>
  <div class="question-text" id="questionText"></div>
  <div class="options" id="optionsContainer"></div>

  <!-- 新增：即時反饋訊息 -->
  <div id="feedbackMessage" class="feedback-message"></div>
</div>
```

**需要的 CSS 新增**:
```css
/* 即時反饋訊息（選項點擊後出現） */
.feedback-message {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(45, 62, 45, 0.95) 0%, rgba(61, 79, 61, 0.95) 100%);
  color: #f5ebe0;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1000;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 115, 85, 0.3);
  pointer-events: none;
}

.feedback-message.show {
  opacity: 1;
  transform: translateX(-50%) translateY(-10px);
}

/* 階段性提示（每 3 題出現一次） */
.progress-insight {
  text-align: center;
  font-size: 14px;
  color: #8b7355;
  margin-bottom: 12px;
  min-height: 20px;
  opacity: 0;
  transition: opacity 0.4s ease;
  letter-spacing: 0.3px;
  font-style: italic;
}

.progress-insight.show {
  opacity: 1;
}
```

**實作方式**:
```javascript
// js/app.js
import { FeedbackManager } from './feedback.js';

class App {
  constructor() {
    // ...
    this.feedback = new FeedbackManager();
  }

  async selectAnswer(type) {
    // 記錄答案
    this.quiz.recordAnswer(type);

    // 顯示即時反饋
    const feedbackText = this.feedback.getAnswerFeedback(type);
    this.ui.showFeedback(feedbackText);

    // 檢查是否需要顯示階段性提示
    const questionNumber = this.quiz.getCurrentQuestionNumber();
    const insightText = this.feedback.getProgressInsight(questionNumber);
    if (insightText) {
      setTimeout(() => {
        this.ui.showProgressInsight(insightText);
      }, 500);
    }

    // 等待反饋顯示完畢後再繼續
    await new Promise(resolve => setTimeout(resolve, 2200));

    if (this.quiz.hasNextQuestion()) {
      await this.showQuestion();
    } else {
      await this.showResult();
    }
  }

  restartQuiz() {
    // ...
    // 重置反饋系統
    this.feedback.reset();
    this.ui.clearFeedback();
  }
}
```

**修改 UIManager** (`js/ui.js`):
```javascript
// UIManager 類別已有以下方法，確保正確綁定元素即可
constructor() {
  // ...
  // 新增元素綁定（已存在於 ui.js）
  this.feedbackMessage = document.getElementById('feedbackMessage');
  this.progressInsight = document.getElementById('progressInsight');
}

// 這些方法已存在於 ui.js，無需修改
showFeedback(text) { /* ... */ }
showProgressInsight(text) { /* ... */ }
clearFeedback() { /* ... */ }
```

**啟用的反饋功能**:
- ✅ 選項點擊後顯示即時鼓勵文字（根據植物類型）
- ✅ 第 3、6、9 題顯示階段性提示
- ✅ 避免重複顯示相同反饋（智慧隨機）
- ✅ 重新測驗時重置反饋記錄

**反饋文字範例**:
- 薰衣草型: "🌙 你需要更多靜謐的時刻"
- 扁柏型: "🌲 你的步調很穩定"
- 洋甘菊型: "🌼 你的溫柔被看見了"
- 薄荷葉型: "⚡ 你的行動力很強"
- 牡丹型: "🌺 你的光芒正在綻放"

**階段性提示文字**:
- 第 3 題後: "💭 你的情緒輪廓正在浮現..."
- 第 6 題後: "🧭 我們越來越接近你的座標了"
- 第 9 題後: "🌟 最後一步，你的植物人格即將揭曉"

#### 3.3 Instagram 分享卡片生成
**整合方式**:
```javascript
// js/app.js
async downloadResultImage() {
  if (!this.currentResultKey) {
    alert('請先完成測驗！');
    return;
  }

  const success = await this.share.generateInstagramImage(this.currentResultKey);
  if (success) {
    console.log('分享圖片生成成功');
  }
}
```

**需要的 HTML 依賴**:
- html2canvas 函式庫（已在 Phase 2.2 加入）
- share-card.css 樣式（已存在）

---

## 🔄 資料流程圖

```
使用者操作
    ↓
window.startQuiz() / window.selectAnswer() 等
    ↓
App 類別處理
    ↓
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│              │              │              │              │              │
QuizManager    UIManager      ShareManager   AnimationMgr   FeedbackMgr
(狀態管理)     (畫面渲染)     (分享功能)     (動畫效果)     (即時反饋)
│              │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
            ↓
      plantData / questions (資料來源)
```

---


## ⚠️ 注意事項

### **必須保留的設計元素**
1. ✅ 深綠色配色方案（品牌識別）
2. ✅ `.brand-header` 結構和樣式
3. ✅ `.brand-footer`
4. ✅ 圓角設計和半透明效果
5. ✅ Noto Serif TC 字體

### **需要避免的改動**
1. ❌ 不要改變整體配色為橘黃色（這是 css/style.css 的配色）
2. ❌ 不要改變座標標籤名稱（保持 "Energy" 和 "Temperature"）
3. ❌ 不要破壞原有的視覺層次和版面配置

### **潛在問題與解決方案**

**問題 1**: html2canvas 可能無法正確渲染模糊效果 (backdrop-filter)
- **解決方案**: 在生成分享圖片時使用簡化版樣式，移除 blur 效果

**問題 2**: ES6 模組在舊版瀏覽器不支援
- **解決方案**:
  - 文件說明最低支援版本 (Chrome 61+, Firefox 60+, Safari 11+)
  - 或使用 Babel + Webpack 打包（超出此次範圍）

**問題 3**: onclick 內聯事件處理在模組中需要 window 綁定
- **解決方案**: 已在 App 類別的 bindEvents() 中處理

---

## 📊 預期成果

### **功能對比表**

| 功能 | 遷移前 | 遷移後 |
|------|--------|--------|
| 測驗流程 | ✅ | ✅ |
| 結果顯示 | ✅ | ✅ |
| 基礎分享 | ✅ | ✅ |
| Instagram 分享卡 | ❌ | ✅ |
| 森林背景動畫 | ❌ | ✅ |
| 即時反饋系統 | ❌ | ✅ |
| 階段性提示 | ❌ | ✅ |
| 結果揭曉動畫 | ❌ | ✅ |
| 程式碼可維護性 | ⚠️ 低 | ✅ 高 |
| 模組化 | ❌ | ✅ |
| 視覺設計 | ✅ | ✅ 深綠色 + 森林背景 |

### **程式碼品質改善**

- **單一職責**: 每個模組只負責一項功能
- **可測試性**: 類別化後可單獨測試
- **可擴展性**: 新增功能只需新增模組，不影響現有程式碼
- **可讀性**: 程式碼結構清晰，易於理解


---

## ✅ 驗收標準

1. ✅ 所有原有功能正常運作（測驗、結果、分享）
2. ✅ 深綠色視覺設計保持不變
3. ✅ 森林背景動畫流暢運作（背景切換、放大效果）
4. ✅ 即時反饋系統正常顯示（答題反饋、階段提示）
5. ✅ Instagram 分享卡片可正確生成（1080×1600px）
6. ✅ 圖片路徑正確（使用中文名稱 .jpg 檔案）
7. ✅ 程式碼符合 ES6 模組規範
8. ✅ 無 console 錯誤
9. ✅ 在主流瀏覽器和手機裝置上正常運作
10. ✅ CLAUDE.md 文件已更新

---
## 📝 實作檢查清單（更新版）

### **準備階段**
- [ ] 建立 `plan/` 目錄和本規劃文件 ✅
- [ ] 備份當前 index.html

### **Phase 1: 準備工作**
- [ ] 確認 `images/` 目錄下有所需的植物圖片（中文名.jpg）：
  - [ ] 薰衣草.jpg
  - [ ] 扁柏.jpg
  - [ ] 檜木.jpg
  - [ ] 洋甘菊.jpg
  - [ ] 薄荷.jpg
  - [ ] 牡丹.jpg
- [ ] 確認森林背景圖片存在：
  - [ ] forest-bg.jpg（森林入口）
  - [ ] forest-mid.jpg（森林中段）
  - [ ] forest-fg.jpg（森林深處）
- [ ] 將 index.html 的 `<style>` 提取到 `css/index-style.css`
- [ ] 修改 `js/ui.js`:
  - [ ] 修改進度條 ID 為 `progressFill`
  - [ ] 修改題目編號格式為 "問題 X / 10"
  - [ ] 確認 feedbackMessage 和 progressInsight 元素綁定正確

### **Phase 2: 核心模組整合**
- [ ] 建立 `js/app.js` 主應用檔案：
  - [ ] import 所有必要模組
  - [ ] 建立 App 類別
  - [ ] 實作 bindEvents() 方法（window 綁定）
  - [ ] 實作 startQuiz() 方法
  - [ ] 實作 selectAnswer() 方法
  - [ ] 實作 showQuestion() 方法
  - [ ] 實作 showResult() 方法
  - [ ] 實作 restartQuiz() 方法
  - [ ] 實作 copyLink() 方法
  - [ ] 實作 downloadResultImage() 方法
- [ ] 修改 index.html:
  - [ ] 移除 `<style>` 內容
  - [ ] 加入 `<link rel="stylesheet" href="css/index-style.css">`
  - [ ] 加入 `<link rel="stylesheet" href="css/share-card.css">`
  - [ ] 加入 html2canvas CDN: `<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>`
  - [ ] 移除 `<script>` 內的所有 JavaScript
  - [ ] 加入 `<script type="module" src="js/app.js"></script>`
- [ ] 測試基本功能:
  - [ ] 開始測驗按鈕運作
  - [ ] 答題流程正常
  - [ ] 進度條更新正確
  - [ ] 顯示結果頁面
  - [ ] 重新測驗功能
  - [ ] 複製連結功能

### **Phase 3: 進階功能整合**
#### **3.1 森林背景動畫**
- [ ] 修改 index.html HTML 結構：
  - [ ] 在 `<body>` 開頭加入 `<div class="forest-background stage-1"></div>`
- [ ] 修改 `css/index-style.css`：
  - [ ] 加入 `.forest-background` 基礎樣式
  - [ ] 加入 `.stage-1`, `.stage-2`, `.stage-3` 背景圖樣式
  - [ ] 加入 `.zoom-1` 到 `.zoom-10` 放大效果
  - [ ] 加入 `.transitioning` 過渡效果
  - [ ] 調整 `body` 背景為純色 `#2d3e2d`
  - [ ] 調整 `body::before` 透明度為 0.3
  - [ ] 確保 `.container` 的 z-index 為 1
- [ ] 修改 `js/app.js`:
  - [ ] import AnimationManager
  - [ ] 在 constructor 中初始化 AnimationManager
  - [ ] 加入 initAnimations() 方法
  - [ ] 在 showQuestion() 中調用 updateForestDepth()
  - [ ] 在 showResult() 中調用 revealResultWithForest()
  - [ ] 在 restartQuiz() 中調用 resetForest()
- [ ] 測試森林動畫:
  - [ ] 開始測驗時顯示第一階段背景
  - [ ] 第 4 題時切換到第二階段背景
  - [ ] 第 7 題時切換到第三階段背景
  - [ ] 每題背景逐漸放大效果正常
  - [ ] 結果揭曉動畫流暢
  - [ ] 重新測驗時背景重置正確

#### **3.2 即時反饋系統**
- [ ] 修改 index.html HTML 結構：
  - [ ] 在 `.question-screen` 中加入 `<div id="progressInsight" class="progress-insight"></div>`
  - [ ] 在 `.question-screen` 中加入 `<div id="feedbackMessage" class="feedback-message"></div>`
- [ ] 修改 `css/index-style.css`：
  - [ ] 加入 `.feedback-message` 樣式
  - [ ] 加入 `.feedback-message.show` 樣式
  - [ ] 加入 `.progress-insight` 樣式
  - [ ] 加入 `.progress-insight.show` 樣式
- [ ] 修改 `js/app.js`:
  - [ ] import FeedbackManager
  - [ ] 在 constructor 中初始化 FeedbackManager
  - [ ] 在 selectAnswer() 中調用 getAnswerFeedback()
  - [ ] 在 selectAnswer() 中調用 getProgressInsight()
  - [ ] 在 restartQuiz() 中調用 feedback.reset()
- [ ] 測試反饋系統:
  - [ ] 選擇選項後顯示即時反饋
  - [ ] 反饋文字符合植物類型
  - [ ] 第 3、6、9 題後顯示階段提示
  - [ ] 重新測驗時反饋記錄重置
  - [ ] 避免重複顯示相同反饋

#### **3.3 Instagram 分享卡片**
- [ ] 測試分享功能:
  - [ ] 點擊「📷 下載結果圖」按鈕
  - [ ] 分享卡片正確生成（1080×1600px）
  - [ ] 卡片包含所有資訊（植物、座標、關係、香氣）
  - [ ] 手機裝置上可正常分享或下載
  - [ ] 桌面裝置觸發下載

### **Phase 4: 測試與優化**
- [ ] 瀏覽器相容性測試:
  - [ ] Chrome (最新版)
  - [ ] Firefox (最新版)
  - [ ] Safari (最新版)
  - [ ] Edge (最新版)
- [ ] 手機裝置測試:
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] 響應式設計正常
- [ ] 功能完整性測試:
  - [ ] 完整跑完一次測驗流程
  - [ ] 測試所有 6 種植物類型結果
  - [ ] 分享功能全部正常
  - [ ] 動畫效果流暢無卡頓
- [ ] 效能檢查:
  - [ ] 首次載入時間 < 3 秒
  - [ ] 背景圖片預載正常
  - [ ] 記憶體使用合理
  - [ ] 無 console 錯誤或警告
- [ ] 視覺回歸測試:
  - [ ] 深綠色配色保持一致
  - [ ] 字體、間距、圓角正確
  - [ ] 森林背景與容器層次正確
  - [ ] 反饋訊息位置和樣式正確

### **Phase 5: 文件更新**
- [ ] 更新 `CLAUDE.md`:
  - [ ] 反映新的模組化架構
  - [ ] 更新檔案結構說明
  - [ ] 更新圖片路徑說明（中文名.jpg）
  - [ ] 說明森林背景動畫功能
  - [ ] 說明即時反饋系統功能
- [ ] 建立變更日誌（如需要）
- [ ] 更新 README.md（如存在）

---