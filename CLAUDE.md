# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個 GitHub Pages 靜態網站專案，用於託管「找到你的情緒座標」心理測驗應用程式。這個應用程式透過 10 道情境題，將使用者對應到不同的植物人格類型，並呈現其情緒座標位置。

## 架構說明

**單一檔案應用結構**：每個測驗版本都是一個獨立的 HTML 檔案，包含：
- 內嵌 CSS 樣式（`<style>` 標籤內）
- 內嵌 JavaScript 邏輯（`<script>` 標籤內）
- 無外部相依套件，無需建置流程

**測驗流程**：
1. 開始畫面：介紹測驗概念
2. 10 題問答：每題 4 個選項，對應不同植物類型
3. 答案累計：根據選項類型進行計分
4. 結果呈現：
   - 植物人格類型（薰衣草/扁柏/檜木/洋甘菊/薄荷葉/牡丹）
   - 情緒座標視覺化（Energy 能量 × Temperature 溫度二維座標）
   - 關係相容性（另一半/朋友/仇人植物類型）
   - 香氣推薦（相似香氣/平衡香氣）

**六種植物類型與座標**：
- `lavender` (薰衣草型)：低能量 × 偏涼 (30%, 70%) - 安定靜心區
- `cypress` (扁柏型)：低能量 × 偏涼 (40%, 65%) - 安定靜心區
- `hinoki` (檜木型)：穩定 × 溫暖 (58%, 65%) - 溫潤和諧區
- `chamomile` (洋甘菊型)：穩定 × 溫暖 (68%, 60%) - 溫潤和諧區
- `mint` (薄荷葉型)：高能量 × 偏涼 (40%, 30%) - 光合啟動區
- `peony` (牡丹型)：高能量 × 溫暖 (76%, 28%) - 光芒區

**圖片引用**：程式碼會從 `images/{plantKey}.png` 路徑載入植物圖片，用於關係卡片顯示。

## 部署方式

**GitHub Pages 網址格式**：`https://nw7551762.github.io/emotion-coord-quiz/{檔名}` (不含 `.html` 副檔名)

**新增測驗版本**：
1. 在專案根目錄建立新的 `.html` 檔案
2. 提交到 `main` 分支
3. 透過 `https://nw7551762.github.io/emotion-coord-quiz/{檔名}` 即可存取

**無需建置**：檔案直接作為靜態 HTML 提供服務，推送到 `main` 分支後立即生效。

## 程式碼修改指南

**修改測驗題目**：編輯 `questions` 陣列（test3.html 約第 447 行起）。每個問題的選項必須對應到六種植物類型之一。

**更新植物資料**：編輯 `plantData` 物件（test3.html 約第 545 行起）。每種植物類型需包含：
- `coord`: {x, y} 情緒座標百分比位置
- `color`: 十六進位色碼，用於座標點視覺化
- `relationships`: partner/friend/enemy 對應的植物 key
- `scent`: similar/balance 香氣推薦資訊

**樣式調整**：所有樣式位於 `<style>` 區塊內。設計使用暖色調漸層主題 (#f6d365 到 #fda085)，在 520px 有響應式斷點。

**語言**：整個介面使用繁體中文 (zh-TW)。新增或修改內容時請保持語言一致性。

## HTML/CSS/JS 解耦架構建議

**目前架構限制**：
- 所有程式碼集中在單一 HTML 檔案中（約 920 行）
- CSS、JavaScript 與 HTML 結構混合，不易維護
- 程式碼重複使用性低，多個測驗版本需重複編輯
- 難以進行版本控制和協作開發

**建議的解耦檔案結構**：
```
emotion-coord-quiz/
├── index.html              # 主要 HTML 結構
├── css/
│   └── style.css          # 所有樣式
├── js/
│   ├── data/
│   │   ├── questions.js   # 題目資料
│   │   └── plants.js      # 植物類型資料
│   ├── quiz.js            # 測驗邏輯
│   └── ui.js              # UI 渲染與互動
└── images/
    ├── lavender.png
    ├── cypress.png
    └── ...
```

**重構步驟**：

1. **提取 CSS**：
   - 將 `<style>` 標籤內的所有樣式移至 `css/style.css`
   - 在 HTML `<head>` 中引入：`<link rel="stylesheet" href="css/style.css">`

2. **拆分 JavaScript 資料與邏輯**：
   - `js/data/questions.js`：匯出 `questions` 陣列
   - `js/data/plants.js`：匯出 `plantData` 物件
   - `js/quiz.js`：測驗核心邏輯（計分、狀態管理）
   - `js/ui.js`：畫面渲染函式（`showQuestion`, `showResult` 等）

3. **模組化 JavaScript 範例**：
   ```javascript
   // js/data/questions.js
   export const questions = [
     { question: "...", options: [...] },
     // ...
   ];

   // js/data/plants.js
   export const plantData = {
     lavender: { icon: "🌾", name: "薰衣草型", ... },
     // ...
   };

   // js/quiz.js
   import { questions } from './data/questions.js';
   import { plantData } from './data/plants.js';

   export class QuizManager {
     constructor() {
       this.currentQuestion = 0;
       this.answers = {};
     }
     // 測驗邏輯方法...
   }

   // js/ui.js
   export class UIManager {
     showQuestion(question) { /* ... */ }
     showResult(plantType) { /* ... */ }
   }
   ```

4. **HTML 引入模組**：
   ```html
   <script type="module">
     import { QuizManager } from './js/quiz.js';
     import { UIManager } from './js/ui.js';

     const quiz = new QuizManager();
     const ui = new UIManager();
     // 初始化應用...
   </script>
   ```

**解耦後的優勢**：
- **可維護性**：每個檔案職責單一，易於定位和修改
- **可重用性**：題目資料、植物資料可獨立更新，不影響邏輯
- **協作友善**：多人可同時編輯不同檔案，減少衝突
- **測試性**：邏輯與 UI 分離後，更容易撰寫單元測試
- **效能**：瀏覽器可快取 CSS/JS 檔案，提升載入速度

**注意事項**：
- 使用 ES6 模組時，需透過 HTTP(S) 協定存取（不能直接用 `file://`）
- GitHub Pages 自動支援，本機開發可用 `python -m http.server` 或 `npx serve`
- 若需支援舊瀏覽器，考慮使用打包工具（Vite、Webpack 等）
