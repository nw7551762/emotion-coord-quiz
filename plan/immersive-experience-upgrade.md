# 功能規劃：沉浸式體驗升級

**日期**：2025-11-15
**狀態**：規劃中

---

## 功能概述

將「找到你的情緒座標」心理測驗升級為更具沉浸感和身歷其境的互動體驗。透過故事化包裝、動態視覺設計、即時反饋機制、儀式感營造和社群分享功能，讓使用者獲得更深刻的自我探索體驗。

**核心目標**：
- 提升使用者參與度和完成率
- 增強測驗結果的可信度和共鳴感
- 提高社群分享意願，擴大傳播效果
- 維持純前端靜態網站特性（無需後端）

---

## 影響範圍

### 會修改的檔案

- `index.html` - 新增載入動畫、分析中畫面、分享功能 DOM 結構
- `css/style.css` - 新增動畫效果、過場特效、儀式感設計樣式
- `js/ui.js` - 新增動畫控制、即時反饋、結果揭曉效果、分享圖卡生成
- `js/quiz.js` - 新增即時回饋文字邏輯、動態提示生成
- `js/data/questions.js` - 優化題目情境描述（可選）

### 會新增的檔案

- `js/animations.js` - 動畫管理模組（頁面過場、粒子效果、載入動畫）
- `js/feedback.js` - 即時反饋邏輯（根據答案類型生成回饋文字）
- `js/share.js` - 分享功能模組（圖卡生成、複製連結、社群分享）
- `audio/` 目錄（可選）：
  - `background.mp3` - 背景音樂（輕柔療癒系）
  - `click.mp3` - 選擇答案音效
  - `transition.mp3` - 頁面切換音效
  - `reveal.mp3` - 結果揭曉音效
- `images/backgrounds/` - 情境插圖或背景圖（如森林、海洋、星空等）

---

## 實作步驟

### 步驟 1：建立動畫管理模組

**檔案**：`js/animations.js`

**功能**：
- **頁面過場動畫**：淡入淡出、滑動、縮放效果
- **載入動畫**：旋轉植物圖示或生長動畫
- **結果揭曉動畫**：
  - 第一階段：「正在分析你的情緒座標...」（3-5 秒）
  - 第二階段：粒子匯聚效果，顯示植物圖示
  - 第三階段：打字機效果逐步顯示結果文字
- **背景粒子效果**（可選）：飄浮的植物葉片或光點

**技術實作**：
- 使用 CSS animations + JavaScript 控制
- 使用 `requestAnimationFrame` 實現流暢動畫
- 使用 `IntersectionObserver` 實現滾動觸發動畫

**匯出 API**：
```javascript
export class AnimationManager {
  // 頁面過場
  fadeIn(element, duration = 300)
  fadeOut(element, duration = 300)
  slideIn(element, direction = 'right', duration = 400)

  // 載入動畫
  showLoadingScreen(message = "正在分析...")
  hideLoadingScreen()

  // 結果揭曉
  revealResult(resultElement, onComplete)
  typewriterEffect(element, text, speed = 50)

  // 背景效果
  startParticles(container)
  stopParticles()
}
```

---

### 步驟 2：建立即時反饋系統

**檔案**：`js/feedback.js`

**功能**：
- 根據選項類型（6 種植物）生成不同的即時反饋文字
- 根據累積答案比例，提供階段性提示
- 非評價性語言，營造陪伴感

**反饋文字庫範例**：
```javascript
const feedbackMap = {
  lavender: [
    "你需要更多靜謐的時刻 🌙",
    "內在的聲音正在呼喚你",
    "這份沉靜很珍貴"
  ],
  peony: [
    "你的光芒正在綻放 ✨",
    "這份熱情很動人",
    "你的能量感染了周圍"
  ],
  // ... 其他植物類型
};

// 動態提示（每 3 題觸發一次）
const progressInsights = {
  3: "你的情緒輪廓正在浮現...",
  6: "我們越來越接近你的座標了",
  9: "最後一步，你的植物人格即將揭曉"
};
```

**匯出 API**：
```javascript
export class FeedbackManager {
  getAnswerFeedback(plantType) // 返回即時反饋文字
  getProgressInsight(questionNumber) // 返回階段性提示
  getRandomEncouragement() // 返回鼓勵性文字
}
```

**UI 整合**：
- 選擇答案後，在選項下方顯示 1-2 秒的反饋文字（淡入淡出）
- 每 3 題後，在進度條上方顯示階段性提示

---

### 步驟 3：建立分享功能模組

**檔案**：`js/share.js`

**功能**：
- **生成分享圖卡**：將結果畫面轉換為圖片
- **複製連結**：複製測驗網址到剪貼簿
- **社群分享**：生成 Line、Facebook、Twitter 分享連結

**技術實作**：
- 使用 `html2canvas` 或 `dom-to-image` 庫生成圖片
- 使用 `navigator.clipboard.writeText()` 複製連結
- 使用各社群平台的分享 URL schema

**圖卡設計**：
- 包含植物圖示、類型名稱、情緒座標圖、簡短描述
- 加入測驗 QR Code 或短連結
- 精美的視覺設計（漸層背景、圓角卡片）

**匯出 API**：
```javascript
export class ShareManager {
  generateShareImage(resultElement) // 生成圖片並下載
  copyLink() // 複製測驗連結
  shareToLine() // 分享到 Line
  shareToFacebook() // 分享到 Facebook
  shareToTwitter() // 分享到 Twitter
}
```

**UI 整合**：
- 在結果頁面底部新增分享區塊
- 包含「下載結果圖」、「複製連結」、「分享到...」按鈕

---

### 步驟 4：加入音效與配樂（可選功能）

**檔案**：新增 `js/audio.js`

**功能**：
- 背景音樂播放控制（可靜音）
- 互動音效（點擊、過場、揭曉）
- 音量控制和靜音按鈕

**技術實作**：
- 使用 Web Audio API 或 HTML5 `<audio>` 元素
- 提供靜音開關，預設為關閉（避免打擾）
- 使用小檔案音訊（MP3 或 OGG，< 500KB）

**匯出 API**：
```javascript
export class AudioManager {
  playBackgroundMusic()
  stopBackgroundMusic()
  playSound(soundName) // 'click', 'transition', 'reveal'
  toggleMute()
  setVolume(level) // 0-1
}
```

**UI 整合**：
- 右上角新增音樂圖示按鈕（🔊/🔇）
- 點擊切換靜音狀態

**注意事項**：
- 音效為可選功能，使用者可完全關閉
- 檔案大小需控制，避免影響載入速度
- 需考慮行動裝置的自動播放限制

---

### 步驟 5：優化視覺設計與動畫

**檔案**：`css/style.css`

**新增樣式**：

1. **頁面過場動畫**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

2. **載入動畫畫面**
```css
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-icon {
  font-size: 80px;
  animation: grow 1.5s ease-in-out infinite;
}

@keyframes grow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

3. **即時反饋文字**
```css
.feedback-message {
  text-align: center;
  color: #7b5d49;
  font-size: 14px;
  margin-top: 8px;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
```

4. **背景粒子效果（可選）**
```css
.particle {
  position: absolute;
  opacity: 0.3;
  animation: float 10s infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-100px) rotate(180deg); }
}
```

5. **分享區塊**
```css
.share-section {
  margin-top: 24px;
  padding: 20px;
  background: #fff3e4;
  border-radius: 16px;
  text-align: center;
}

.share-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.share-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.share-btn.download {
  background: #f6a86b;
  color: white;
}

.share-btn.copy {
  background: #b08968;
  color: white;
}

.share-btn.social {
  background: white;
  color: #4a3427;
  border: 1px solid #f0e0d2;
}
```

---

### 步驟 6：整合所有模組到主應用

**檔案**：`index.html` 和內聯的 `<script type="module">`

**修改流程**：

1. **匯入新模組**
```javascript
import { QuizManager } from './js/quiz.js';
import { UIManager } from './js/ui.js';
import { AnimationManager } from './js/animations.js';
import { FeedbackManager } from './js/feedback.js';
import { ShareManager } from './js/share.js';
// import { AudioManager } from './js/audio.js'; // 可選
```

2. **初始化管理器**
```javascript
const quiz = new QuizManager();
const ui = new UIManager();
const anim = new AnimationManager();
const feedback = new FeedbackManager();
const share = new ShareManager();
// const audio = new AudioManager(); // 可選
```

3. **修改 selectAnswer 函式**（加入即時反饋）
```javascript
function selectAnswer(type) {
  // 顯示即時反饋
  const feedbackText = feedback.getAnswerFeedback(type);
  ui.showFeedback(feedbackText);

  // 播放音效（可選）
  // audio.playSound('click');

  quiz.recordAnswer(type);

  // 檢查是否需要顯示階段性提示
  const insight = feedback.getProgressInsight(quiz.getCurrentQuestionNumber());
  if (insight) {
    ui.showProgressInsight(insight);
  }

  if (quiz.hasNextQuestion()) {
    setTimeout(() => {
      anim.fadeOut(questionScreen, 200).then(() => {
        showQuestion();
        anim.fadeIn(questionScreen, 300);
      });
    }, 1500); // 等待反饋顯示
  } else {
    setTimeout(showResult, 1500);
  }
}
```

4. **修改 showResult 函式**（加入儀式感）
```javascript
function showResult() {
  // 第一階段：顯示分析中畫面
  anim.showLoadingScreen('正在分析你的情緒座標...');

  // 播放分析音效（可選）
  // audio.playSound('transition');

  setTimeout(() => {
    const resultKey = quiz.calculateResult();
    anim.hideLoadingScreen();

    ui.showResultScreen();

    // 第二階段：揭曉動畫
    anim.revealResult(document.getElementById('resultScreen'), () => {
      ui.renderResult(resultKey);

      // 第三階段：打字機效果顯示描述
      const descElement = document.getElementById('plantDescription');
      const descText = descElement.innerHTML;
      descElement.innerHTML = '';
      anim.typewriterEffect(descElement, descText, 30);

      // 播放揭曉音效（可選）
      // audio.playSound('reveal');

      // 初始化分享功能
      initShareButtons(resultKey);
    });
  }, 3000); // 分析畫面顯示 3 秒
}
```

5. **新增分享按鈕事件處理**
```javascript
function initShareButtons(resultKey) {
  document.getElementById('downloadBtn').addEventListener('click', () => {
    share.generateShareImage(document.getElementById('resultScreen'));
  });

  document.getElementById('copyLinkBtn').addEventListener('click', () => {
    share.copyLink();
    // 顯示「已複製」提示
  });

  document.getElementById('shareLineBtn').addEventListener('click', () => {
    share.shareToLine();
  });

  // ... 其他社群分享按鈕
}
```

---

### 步驟 7：更新 HTML 結構

**檔案**：`index.html`

**新增 DOM 元素**：

1. **載入動畫畫面**（在 `<body>` 開頭）
```html
<div class="loading-screen" id="loadingScreen" style="display: none;">
  <div class="loading-icon">🌿</div>
  <div class="loading-text" id="loadingText">正在分析你的情緒座標...</div>
  <div class="loading-spinner"></div>
</div>
```

2. **音樂控制按鈕**（可選，在 header 右上角）
```html
<button class="audio-toggle" id="audioToggle" title="背景音樂">
  <span class="audio-icon">🔊</span>
</button>
```

3. **即時反饋區域**（在 options 下方）
```html
<div class="feedback-message" id="feedbackMessage"></div>
```

4. **階段性提示區域**（在進度條上方）
```html
<div class="progress-insight" id="progressInsight"></div>
```

5. **分享區塊**（在結果頁面底部，restart 按鈕前）
```html
<div class="share-section">
  <div class="share-title">📤 分享你的植物人格</div>
  <div class="share-buttons">
    <button class="share-btn download" id="downloadBtn">📥 下載結果圖</button>
    <button class="share-btn copy" id="copyLinkBtn">🔗 複製連結</button>
    <button class="share-btn social" id="shareLineBtn">💬 分享到 Line</button>
    <button class="share-btn social" id="shareFbBtn">👍 分享到 Facebook</button>
  </div>
  <div class="copy-success" id="copySuccess" style="display: none;">✅ 已複製到剪貼簿</div>
</div>
```

---

## 資料結構變更

### FeedbackManager 反饋文字資料

**新增檔案**：`js/feedback.js`

```javascript
const feedbackTexts = {
  lavender: [
    "🌙 你需要更多靜謐的時刻",
    "✨ 內在的聲音正在呼喚你",
    "🍃 這份沉靜很珍貴",
    "💜 給自己多一點獨處的空間",
  ],
  cypress: [
    "🌲 你的步調很穩定",
    "🏔️ 這份踏實感很安定",
    "🌿 慢慢來，你做得很好",
    "🧭 你知道自己在往哪裡走",
  ],
  hinoki: [
    "🌳 你的溫暖療癒著周圍",
    "☀️ 這份和諧感很舒服",
    "🍂 穩穩的，很有力量",
    "🌾 你的存在讓人安心",
  ],
  chamomile: [
    "🌼 你的溫柔被看見了",
    "🫖 這份關懷很動人",
    "💛 你總是為別人著想",
    "🌸 你值得被好好對待",
  ],
  mint: [
    "⚡ 你的行動力很強",
    "🌱 這份效率讓人欽佩",
    "💚 你總能快速找到方法",
    "🍀 你的能量很清晰",
  ],
  peony: [
    "🌺 你的光芒正在綻放",
    "✨ 這份熱情很動人",
    "💗 你的能量感染了周圍",
    "🔥 你值得被看見",
  ]
};

const progressInsights = {
  3: "💭 你的情緒輪廓正在浮現...",
  6: "🧭 我們越來越接近你的座標了",
  9: "🌟 最後一步，你的植物人格即將揭曉"
};
```

### ShareManager 分享文字模板

**新增檔案**：`js/share.js`

```javascript
const shareTemplates = {
  lavender: "我是「薰衣草型」🌿 在情緒座標的安定靜心區，需要更多靜謐時刻。你是哪種植物？",
  cypress: "我是「扁柏型」🌲 在情緒座標的安定靜心區，步調穩定而踏實。你是哪種植物？",
  hinoki: "我是「檜木型」🌳 在情緒座標的溫潤和諧區，溫暖療癒著周圍。你是哪種植物？",
  chamomile: "我是「洋甘菊型」🌼 在情緒座標的溫潤和諧區，溫柔關懷著他人。你是哪種植物？",
  mint: "我是「薄荷葉型」🍃 在情緒座標的光合啟動區，行動力強而清晰。你是哪種植物？",
  peony: "我是「牡丹型」🌺 在情緒座標的光芒區，熱情綻放著光彩。你是哪種植物？"
};
```

---



---

## 其他注意事項

### 實作優先順序

建議分階段實作，按優先順序如下：

**第一優先**（核心體驗提升）：
1. 即時反饋系統 - 提升參與感
2. 頁面過場動畫 - 提升流暢度
3. 結果揭曉動畫 - 提升儀式感

**第二優先**（社群傳播）：
4. 分享功能 - 提升傳播力

**第三優先**（錦上添花）：
5. 音效與配樂 - 提升沉浸感
6. 背景粒子效果 - 視覺美化


---


## 參考資源

- **動畫庫參考**：
  - GSAP (GreenSock Animation Platform)
  - Anime.js
  - Particles.js

- **圖卡生成**：
  - html2canvas
  - dom-to-image
  - canvas API 手動繪製

- **音訊資源**：
  - Freesound.org（免費音效）
  - Incompetech（免費背景音樂）
  - Epidemic Sound（付費，高品質）

- **UI/UX 靈感**：
  - 16personalities.com（經典人格測驗）
  - Pottermore（哈利波特分院測驗）
  - BuzzFeed Quizzes（趣味測驗）
