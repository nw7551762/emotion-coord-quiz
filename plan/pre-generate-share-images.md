# 功能規劃：預生成人格分享圖片

**日期**：2025-11-20
**狀態**：規劃中

---

## 功能概述

為 6 種植物人格類型預先生成分享用 PNG 圖片，存放在 `share/` 資料夾中。目前的實作使用 html2canvas 即時生成圖片，但預生成圖片可以：

1. **提升效能**：避免每次分享都需要即時渲染和截圖
2. **穩定性**：預生成的圖片品質和佈局更可控
3. **社群分享優化**：可用於 Open Graph meta tags，讓社群平台（Facebook、LINE 等）正確顯示預覽圖
4. **備用方案**：當 html2canvas 載入失敗時，可以作為備用分享圖

---

## 影響範圍

**會修改的檔案**：
- `index.html` - 新增 Open Graph meta tags（可選）
- `js/share.js` - 新增使用預生成圖片的邏輯（可選）

**會新增的檔案**：
- `share/` 資料夾 - 存放 6 張人格分享圖片
  - `share/lavender.png` - 薰衣草型分享圖
  - `share/cypress.png` - 扁柏型分享圖
  - `share/hinoki.png` - 檜木型分享圖
  - `share/chamomile.png` - 洋甘菊型分享圖
  - `share/mint.png` - 薄荷葉型分享圖
  - `share/peony.png` - 牡丹型分享圖
- `tools/generate-share-images.html`（可選）- 一次性生成工具頁面

---

## 實作步驟

### 方案 A：手動使用現有分享功能生成（推薦，簡單快速）

#### 步驟 1：建立 share 資料夾
```bash
mkdir -p share
```

#### 步驟 2：使用測驗應用手動生成 6 張圖片
1. 開啟 `index.html` 測驗頁面
2. 針對每種人格類型：
   - 完成測驗，確保結果為目標人格類型
   - 點擊「📥 下載結果圖」按鈕
   - 將下載的 `emotion-coord-{type}.png` 重新命名並移動到 `share/` 資料夾

#### 步驟 3：驗證圖片
- 確認 6 張圖片尺寸一致（1080×1600px）
- 確認圖片內容正確（植物類型、座標位置、關係卡片等）

### 方案 B：建立自動化生成工具（進階，可重複使用）

#### 步驟 1：建立 share 資料夾
```bash
mkdir -p share
```

#### 步驟 2：建立生成工具頁面 `tools/generate-share-images.html`
- 匯入必要模組：`plants.js`、`share.js`
- 載入 html2canvas 函式庫
- 建立 UI：顯示 6 種人格類型的生成按鈕或全部生成按鈕
- 實作邏輯：
  - 依序呼叫 `ShareManager.createShareCardDOM(resultKey)` 為每種類型建立卡片
  - 使用 html2canvas 截圖生成圖片
  - 觸發下載，檔案名稱為 `{resultKey}.png`
  - 提示使用者手動將下載的圖片移動到 `share/` 資料夾

#### 步驟 3：執行生成工具
1. 開啟 `tools/generate-share-images.html`
2. 點擊「生成全部分享圖片」按鈕
3. 依序下載 6 張圖片
4. 手動將圖片移動到 `share/` 資料夾並驗證

#### 步驟 4：（可選）整合到應用中
- 修改 `js/share.js`，新增方法 `getPreGeneratedImage(resultKey)`
- 回傳 `share/{resultKey}.png` 路徑
- 在分享流程中優先使用預生成圖片，失敗時 fallback 到 html2canvas 即時生成

#### 步驟 5：（可選）新增 Open Graph meta tags
在 `index.html` 的 `<head>` 中新增動態 meta tags：
```html
<meta property="og:image" content="share/default.png">
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="1600">
```

---

## 資料結構變更

### 檔案命名規則

**檔案路徑格式**：
```
share/{resultKey}.png
```

**resultKey 對應表**：
- `lavender` → `share/lavender.png`
- `cypress` → `share/cypress.png`
- `hinoki` → `share/hinoki.png`
- `chamomile` → `share/chamomile.png`
- `mint` → `share/mint.png`
- `peony` → `share/peony.png`

### （可選）ShareManager 新增方法

**新增方法**：
```javascript
/**
 * 取得預生成的分享圖片路徑
 * @param {string} resultKey - 植物類型 key
 * @returns {string} 圖片路徑
 */
getPreGeneratedImage(resultKey) {
  return `share/${resultKey}.png`;
}

/**
 * 檢查預生成圖片是否存在
 * @param {string} resultKey - 植物類型 key
 * @returns {Promise<boolean>}
 */
async checkPreGeneratedImage(resultKey) {
  try {
    const response = await fetch(this.getPreGeneratedImage(resultKey), { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
```

---

## 測試計畫

### 測試項目

1. **圖片生成測試**：
   - [ ] 確認 6 種人格類型的圖片都已生成
   - [ ] 確認圖片尺寸為 1080×1600px（適合 Instagram）
   - [ ] 確認圖片內容正確（植物圖示、名稱、座標、關係卡片、香氣推薦）
   - [ ] 確認圖片視覺品質清晰無模糊

2. **檔案結構測試**：
   - [ ] 確認 `share/` 資料夾存在
   - [ ] 確認 6 張圖片檔名正確
   - [ ] 確認圖片可透過 URL 存取（如 `/share/lavender.png`）

3. **（如實作方案 B）整合測試**：
   - [ ] 測試 `getPreGeneratedImage()` 回傳正確路徑
   - [ ] 測試 `checkPreGeneratedImage()` 正確偵測圖片存在性
   - [ ] 測試分享流程優先使用預生成圖片
   - [ ] 測試預生成圖片不存在時 fallback 到即時生成

4. **（如實作 Open Graph）社群分享測試**：
   - [ ] 使用 Facebook Debugger 測試連結預覽
   - [ ] 使用 LINE 測試連結預覽
   - [ ] 確認預覽圖正確顯示

5. **相容性測試**：
   - [ ] 桌面瀏覽器可正常存取圖片
   - [ ] 行動裝置可正常存取圖片

6. **回歸測試**：
   - [ ] 確認現有的即時生成功能仍正常運作
   - [ ] 確認下載按鈕功能未受影響

---

## 潛在風險

- **風險 1：圖片檔案過大影響載入速度**
  - **因應方式**：使用圖片壓縮工具（如 TinyPNG）優化檔案大小，目標控制在 200KB 以下

- **風險 2：植物資料更新後，預生成圖片內容過期**
  - **因應方式**：
    - 在 `CLAUDE.md` 或 `README.md` 中記錄「當 `plants.js` 或 `questions.js` 更新時，需要重新生成 share 資料夾的圖片」
    - 如實作方案 B，保留生成工具方便重新生成

- **風險 3：手動生成時可能遺漏某些人格類型**
  - **因應方式**：建立檢查清單，確認 6 種類型都已生成

- **風險 4：Open Graph meta tags 無法動態切換不同人格圖片**
  - **因應方式**：
    - 方案 1（簡單）：使用通用預覽圖（如 share/default.png）
    - 方案 2（進階）：實作動態路由，為每種人格類型建立獨立 URL（如 `?result=lavender`）

---

## 其他注意事項

1. **圖片內容一致性**：
   - 確保預生成圖片與即時生成圖片的佈局、樣式一致
   - 使用相同的 CSS 樣式（`.ig-share-card` 類別樣式）

2. **版本控制**：
   - 將 `share/` 資料夾加入 Git 版本控制
   - 圖片為靜態資源，適合納入版本管理

3. **部署流程**：
   - 確認 GitHub Pages 可正常存取 `share/` 資料夾內的圖片
   - 測試部署後的圖片 URL（如 `https://nw7551762.github.io/emotion-coord-quiz/share/lavender.png`）

4. **圖片格式選擇**：
   - 使用 PNG 格式保持高品質（支援透明背景，雖然目前用不到）
   - 如需進一步優化檔案大小，可考慮轉換為 WebP 格式（需考慮相容性）

5. **未來擴充性**：
   - 如未來新增更多植物類型，需記得生成對應的分享圖片
   - 考慮在 CI/CD 流程中自動化檢查圖片是否都已生成

---

## 建議實作方案

**推薦使用方案 A（手動生成）**，原因：
1. 簡單快速，無需額外開發
2. 可利用現有的分享功能
3. 適合一次性任務（6 張圖片）

**適合使用方案 B 的情境**：
1. 未來預計頻繁更新植物資料
2. 想要自動化重新生成流程
3. 需要確保圖片品質和一致性
