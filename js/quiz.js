import { questions } from './data/questions.js';

// 測驗管理類別
export class QuizManager {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {
            lavender: 0,
            cypress: 0,
            hinoki: 0,
            chamomile: 0,
            mint: 0,
            peony: 0
        };
    }

    // 取得當前題目
    getCurrentQuestion() {
        return questions[this.currentQuestion];
    }

    // 取得題目總數
    getTotalQuestions() {
        return questions.length;
    }

    // 取得當前題號（從 1 開始）
    getCurrentQuestionNumber() {
        return this.currentQuestion + 1;
    }

    // 取得進度百分比
    getProgress() {
        return ((this.currentQuestion + 1) / questions.length) * 100;
    }

    // 記錄答案
    recordAnswer(type) {
        this.answers[type]++;
        this.currentQuestion++;
    }

    // 檢查是否還有題目
    hasNextQuestion() {
        return this.currentQuestion < questions.length;
    }

    // 計算結果（找出得分最高的植物類型）
    calculateResult() {
        const resultKey = Object.keys(this.answers).reduce((a, b) =>
            this.answers[a] > this.answers[b] ? a : b
        );
        return resultKey;
    }

    // 重置測驗
    reset() {
        this.currentQuestion = 0;
        this.answers = {
            lavender: 0,
            cypress: 0,
            hinoki: 0,
            chamomile: 0,
            mint: 0,
            peony: 0
        };
    }
}
