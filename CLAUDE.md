# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個 GitHub Pages 靜態網站專案，用於託管「找到你的情緒座標」心理測驗應用程式。這個應用程式透過 10 道情境題，將使用者對應到不同的植物人格類型，並呈現其情緒座標位置。

## 架構說明

**模組化應用結構**：專案使用 ES6 模組分離關注點，無外部相依套件，無需建置流程。

**檔案結構**：
```
emotion-coord-quiz/
├── index.html              # 主要應用（模組化版本）
├── test3.html              # 舊版單一檔案版本（保留作為參考）
├── css/
│   └── style.css          # 所有樣式定義
├── js/
│   ├── data/
│   │   ├── questions.js   # 10 題測驗題目與選項資料
│   │   └── plants.js      # 6 種植物類型資料與座標
│   ├── quiz.js            # QuizManager 類別：測驗狀態管理與計分邏輯
│   └── ui.js              # UIManager 類別：畫面渲染與 DOM 操作
└── images/
    └── {plantKey}.png     # 植物圖片（用於關係卡片顯示）
```

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
- `peony` (牡丹型)：高能量 × 溫暖 (76%, 28%) - 光芒四射區

## 部署方式

**GitHub Pages 網址**：
- 主要應用：`https://nw7551762.github.io/emotion-coord-quiz/` 或 `https://nw7551762.github.io/emotion-coord-quiz/index`
- 舊版本：`https://nw7551762.github.io/emotion-coord-quiz/test3`

**部署流程**：
1. 提交變更到 `main` 分支
2. GitHub Pages 自動部署（無需建置流程）
3. 變更立即生效

## 開發工作流程

**重要原則：先規劃，後實作**

在進行任何程式碼實作之前，必須遵循以下流程：

1. **建立規劃文件**：
   - 在 `plan/` 目錄下建立規劃文件（Markdown 格式）

2. **實作階段**：
   - 收到使用者確認後，才開始修改程式碼
   - 嚴格按照規劃文件執行
   - 如實作過程中發現規劃有誤，需先更新規劃文件並重新確認



## 程式碼修改指南

**修改測驗題目**：
- 編輯 `js/data/questions.js`
- 匯出的 `questions` 陣列包含 10 題，每題格式：
  ```javascript
  {
    question: "問題文字",
    options: [
      { text: "選項文字", type: "植物類型key" },
      // ... 4 個選項
    ]
  }
  ```
- 每個選項的 `type` 必須對應六種植物類型之一：`lavender`、`cypress`、`hinoki`、`chamomile`、`mint`、`peony`

**更新植物資料**：
- 編輯 `js/data/plants.js`
- 匯出的 `plantData` 物件包含六種植物類型，每種需包含：
  - `icon`: Emoji 圖示
  - `name`: 植物類型名稱
  - `tagline`: 副標題（包含能量 × 溫度描述）
  - `coord`: `{x, y}` 情緒座標百分比位置（0-100）
  - `color`: 十六進位色碼，用於座標點視覺化
  - `field`: 座標區域名稱
  - `fieldDesc`: 區域描述
  - `description`: 完整人格描述（支援 HTML）
  - `relationships`: `{partner, friend, enemy}` 對象，每個包含 `plants` 陣列和 `text` 說明
  - `scent`: `{similar, balance}` 香氣推薦，每個包含 `name` 和 `text`

**測驗邏輯調整**：
- 編輯 `js/quiz.js`
- `QuizManager` 類別管理測驗狀態：
  - `answers` 物件累計各植物類型得分
  - `calculateResult()` 找出得分最高的類型
  - `reset()` 重置測驗狀態

**UI 調整**：
- 編輯 `js/ui.js`
- `UIManager` 類別處理所有畫面渲染
- 主要方法：`showStartScreen()`、`showQuestionScreen()`、`showResultScreen()`、`renderResult()`

**樣式調整**：
- 編輯 `css/style.css`
- 設計使用暖色調漸層主題 (#f6d365 到 #fda085)
- 響應式斷點：520px

**語言**：整個介面使用繁體中文 (zh-TW)。新增或修改內容時請保持語言一致性。

## 架構優勢

目前的模組化架構提供以下優點：
- **可維護性**：每個檔案職責單一，易於定位和修改
- **可重用性**：題目資料、植物資料可獨立更新，不影響邏輯
- **協作友善**：多人可同時編輯不同檔案，減少衝突
- **測試性**：邏輯與 UI 分離後，更容易撰寫單元測試
- **效能**：瀏覽器可快取 CSS/JS 檔案，提升載入速度

## 重要技術細節

**ES6 模組系統**：
- 所有 JavaScript 檔案使用 `export`/`import` 語法
- `index.html` 中的主腳本使用 `<script type="module">`
- 模組自動採用嚴格模式 (strict mode)

**計分機制**：
- 每個選項對應一種植物類型
- `QuizManager.answers` 累計各類型得分
- 得分最高的類型即為測驗結果
- 平手時選擇物件鍵值順序中第一個（依 JavaScript 物件屬性順序）

**座標視覺化**：
- 使用 CSS 絕對定位將結果點放置在二維座標圖上
- X 軸：Temperature（溫度）0-100%
- Y 軸：Energy（能量）0-100%，注意 CSS 中 Y 軸由上往下

## 響應式設計原則

**手機優先設計 (Mobile-First)**：
- 基礎樣式以手機裝置為預設，確保在小螢幕上有最佳體驗
- 使用 `@media (min-width: 520px)` media query 漸進增強桌面版樣式
- 主要斷點：520px（小於此寬度為手機版，大於等於此寬度為桌面版）

**關鍵響應式元素**：
- **座標圖尺寸**：
  - 手機版：280×280px
  - 桌面版：400×400px
- **按鈕與間距**：
  - 手機版使用較小的內距和字體，節省螢幕空間
  - 桌面版增加內距和字體大小，提升可讀性
- **容器寬度**：
  - 手機版：最大寬度 95%，保留邊緣呼吸空間
  - 桌面版：最大寬度 600px，避免內容過寬

**觸控優化**：
- 所有可點擊按鈕點擊區域至少 44×44px，符合觸控友善標準
- 選項按鈕之間有充足間距（gap: 0.8rem），避免誤觸
- 使用 `cursor: pointer` 提供視覺回饋

**效能考量**：
- 動畫使用 CSS `transform` 和 `opacity`，避免觸發 layout reflow
- 過渡效果統一使用 `transition: all 0.3s ease`，保持一致的使用者體驗

**media query 範例**：
```css
/* 手機版基礎樣式 */
.coordinate-chart {
  width: 280px;
  height: 280px;
}

/* 桌面版增強樣式 */
@media (min-width: 520px) {
  .coordinate-chart {
    width: 400px;
    height: 400px;
  }
}
```
