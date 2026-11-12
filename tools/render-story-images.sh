#!/bin/bash
# 用 Chrome headless 把 tools/story-card.html 輸出成 IG 限動分享圖（1080×1920）
# 用法：在專案根目錄先開本機伺服器 `python3 -m http.server 8702`，再執行 bash tools/render-story-images.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="${BASE:-http://localhost:8702}"
OUT="${OUT:-share}"
for key in lavender cypress hinoki chamomile mint peony; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1080,1920 --virtual-time-budget=6000 \
    --screenshot="$OUT/$key.png" "$BASE/tools/story-card.html?key=$key" 2>/dev/null
  echo "✓ $OUT/$key.png"
done
