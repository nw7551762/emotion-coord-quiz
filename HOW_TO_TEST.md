# 如何測試解耦後的應用

## 檔案結構

```
emotion-coord-quiz/
├── index.html              # 主要 HTML 檔案（解耦版本）
├── test3.html              # 原始單一檔案版本（保留作為參考）
├── CLAUDE.md               # Claude Code 開發指引
├── README.md               # 專案說明
├── css/
│   └── style.css          # 所有樣式
├── js/
│   ├── data/
│   │   ├── questions.js   # 題目資料
│   │   └── plants.js      # 植物類型資料
│   ├── quiz.js            # 測驗邏輯
│   └── ui.js              # UI 渲染與互動
└── images/                # 植物圖片目錄（需自行添加圖片）
    ├── lavender.png
    ├── cypress.png
    ├── hinoki.png
    ├── chamomile.png
    ├── mint.png
    └── peony.png
```

## 本地測試方法

### 方法 1：使用 Python 內建伺服器

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

然後在瀏覽器訪問：`http://localhost:8000`

### 方法 2：使用 Node.js serve 套件

```bash
# 安裝 serve（僅需一次）
npm install -g serve

# 啟動伺服器
serve
```

### 方法 3：使用 VS Code Live Server 擴充套件

1. 安裝 "Live Server" 擴充套件
2. 在 index.html 上右鍵選擇 "Open with Live Server"

## 測試檢查清單

- [ ] 開始畫面正確顯示
- [ ] 點擊「開始測驗」按鈕能進入問題畫面
- [ ] 進度條正常更新
- [ ] 題目編號顯示正確（1/10 到 10/10）
- [ ] 10 題問題都能正常顯示
- [ ] 選項點擊後能正常進入下一題
- [ ] 完成所有題目後顯示結果畫面
- [ ] 結果畫面包含：
  - 植物 emoji 圖示
  - 植物類型名稱
  - 情緒座標點位置正確
  - 關係植物卡片顯示（另一半/朋友/仇人）
  - 香氣推薦卡片顯示（相似/平衡）
- [ ] 點擊「重新測驗」能回到開始畫面
- [ ] 響應式設計在手機螢幕上正常運作

## 注意事項

1. **必須透過 HTTP(S) 協定訪問**：ES6 模組無法在 `file://` 協定下運作
2. **圖片檔案**：目前 `images/` 目錄是空的，需要添加六種植物的 PNG 圖片
3. **瀏覽器支援**：需要支援 ES6 模組的現代瀏覽器（Chrome 61+, Firefox 60+, Safari 11+, Edge 16+）

## 推送到 GitHub Pages

解耦後的版本完全相容 GitHub Pages：

1. 將所有檔案推送到 `main` 分支
2. GitHub Pages 會自動託管 `index.html`
3. 訪問網址：`https://nw7551762.github.io/emotion-coord-quiz/`

## 開發建議

- 修改題目：編輯 `js/data/questions.js`
- 修改植物資料：編輯 `js/data/plants.js`
- 修改樣式：編輯 `css/style.css`
- 修改邏輯：編輯 `js/quiz.js` 或 `js/ui.js`
