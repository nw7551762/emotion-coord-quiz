/**
 * FeedbackManager - 負責即時反饋邏輯
 * 根據答案類型生成回饋文字，提供階段性提示
 */
export class FeedbackManager {
  constructor() {
    // 各植物類型的即時反饋文字庫
    this.feedbackTexts = {
      lavender: [
        '🌙 想安靜一下，不是錯',
        '🎧 世界有點吵，對吧',
        '🍃 慢慢來，沒人在催你',
        '💜 一個人的時間也很好'
      ],
      cypress: [
        '🌲 你有自己的時區',
        '☕ 不急，咖啡還是熱的',
        '🌿 好東西本來就需要等',
        '🧭 你知道自己要去哪'
      ],
      hinoki: [
        '🌳 大家都在靠你吧',
        '🪵 樹也可以休息一下',
        '🍂 撐很久了，對不對',
        '🌾 有你在，大家都比較安心'
      ],
      chamomile: [
        '🌼 你又先想到別人了',
        '🫖 茶泡好了，這次給自己',
        '💛 說「沒關係」的次數有點多',
        '🌸 你也值得被接住'
      ],
      mint: [
        '⚡ 腳又開始動了',
        '🌱 跑很快，記得喘口氣',
        '💚 辦法總是被你找到',
        '🍀 停下來也沒關係的'
      ],
      peony: [
        '🌺 你一出現就很亮',
        '✨ 喜歡就說出口，很好',
        '💗 散場後也要好好的',
        '🔥 發光很累吧，辛苦了'
      ]
    };

    // 階段性提示（每 3 題觸發一次）
    this.progressInsights = {
      3: '💭 你的輪廓慢慢清楚了⋯⋯',
      6: '🧭 快找到你現在站的地方了',
      9: '🌟 最後一題，選最像今天的你就好'
    };

    // 鼓勵性文字
    this.encouragements = [
      '沒有標準答案，選最像今天的就好 ✨',
      '嗯，這很像你 🌱',
      '誠實一點，沒人在看 💫',
      '今天的你，就是答案 🌿',
      '不用選「應該」，選「想要」💚'
    ];

    // 記錄已使用的反饋索引，避免重複
    this.usedFeedbackIndices = {};
  }

  /**
   * 根據植物類型獲取即時反饋文字
   * @param {string} plantType - 植物類型 key
   * @returns {string} 反饋文字
   */
  getAnswerFeedback(plantType) {
    const feedbacks = this.feedbackTexts[plantType];
    if (!feedbacks || feedbacks.length === 0) {
      return this.getRandomEncouragement();
    }

    // 初始化該類型的使用記錄
    if (!this.usedFeedbackIndices[plantType]) {
      this.usedFeedbackIndices[plantType] = [];
    }

    const used = this.usedFeedbackIndices[plantType];

    // 如果所有反饋都用過了，重置
    if (used.length >= feedbacks.length) {
      this.usedFeedbackIndices[plantType] = [];
    }

    // 找出未使用的反饋
    const availableIndices = feedbacks
      .map((_, index) => index)
      .filter(index => !used.includes(index));

    // 隨機選擇一個未使用的反饋
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    used.push(randomIndex);

    return feedbacks[randomIndex];
  }

  /**
   * 根據題目編號獲取階段性提示
   * @param {number} questionNumber - 當前題目編號（1-based）
   * @returns {string|null} 提示文字，如果沒有則返回 null
   */
  getProgressInsight(questionNumber) {
    return this.progressInsights[questionNumber] || null;
  }

  /**
   * 獲取隨機鼓勵文字
   * @returns {string} 鼓勵文字
   */
  getRandomEncouragement() {
    const randomIndex = Math.floor(Math.random() * this.encouragements.length);
    return this.encouragements[randomIndex];
  }

  /**
   * 重置反饋使用記錄（重新開始測驗時調用）
   */
  reset() {
    this.usedFeedbackIndices = {};
  }
}
