/**
 * FeedbackManager - 負責即時反饋邏輯
 * 根據答案類型生成回饋文字，提供階段性提示
 */
export class FeedbackManager {
  constructor() {
    // 各植物類型的即時反饋文字庫
    this.feedbackTexts = {
      lavender: [
        '🌙 你需要更多靜謐的時刻',
        '✨ 內在的聲音正在呼喚你',
        '🍃 這份沉靜很珍貴',
        '💜 給自己多一點獨處的空間'
      ],
      cypress: [
        '🌲 你的步調很穩定',
        '🏔️ 這份踏實感很安定',
        '🌿 慢慢來，你做得很好',
        '🧭 你知道自己在往哪裡走'
      ],
      hinoki: [
        '🌳 你的溫暖療癒著周圍',
        '☀️ 這份和諧感很舒服',
        '🍂 穩穩的，很有力量',
        '🌾 你的存在讓人安心'
      ],
      chamomile: [
        '🌼 你的溫柔被看見了',
        '🫖 這份關懷很動人',
        '💛 你總是為別人著想',
        '🌸 你值得被好好對待'
      ],
      mint: [
        '⚡ 你的行動力很強',
        '🌱 這份效率讓人欽佩',
        '💚 你總能快速找到方法',
        '🍀 你的能量很清晰'
      ],
      peony: [
        '🌺 你的光芒正在綻放',
        '✨ 這份熱情很動人',
        '💗 你的能量感染了周圍',
        '🔥 你值得被看見'
      ]
    };

    // 階段性提示（每 3 題觸發一次）
    this.progressInsights = {
      3: '💭 你的情緒輪廓正在浮現...',
      6: '🧭 我們越來越接近你的座標了',
      9: '🌟 最後一步，你的植物人格即將揭曉'
    };

    // 鼓勵性文字
    this.encouragements = [
      '繼續探索內心吧 ✨',
      '你正在更了解自己 🌱',
      '每個答案都是珍貴的線索 💫',
      '很棒，保持真實的感受 🌿',
      '你的誠實回答很重要 💚'
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
