import { plantData, getPlantImage } from './data/plants.js';

// UI 管理類別
export class UIManager {
    constructor() {
        // DOM 元素
        this.startScreen = document.getElementById('startScreen');
        this.questionScreen = document.getElementById('questionScreen');
        this.resultScreen = document.getElementById('resultScreen');

        this.progressFill = document.getElementById('progressFill');
        this.questionNumber = document.getElementById('questionNumber');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');

        // 新增元素
        this.feedbackMessage = document.getElementById('feedbackMessage');
        this.progressInsight = document.getElementById('progressInsight');
    }

    // 顯示開始畫面
    showStartScreen() {
        this.startScreen.style.display = 'block';
        this.questionScreen.style.display = 'none';
        this.resultScreen.style.display = 'none';
    }

    // 顯示問題畫面
    showQuestionScreen() {
        this.startScreen.style.display = 'none';
        this.questionScreen.style.display = 'block';
        this.resultScreen.style.display = 'none';
    }

    // 顯示結果畫面
    showResultScreen() {
        this.startScreen.style.display = 'none';
        this.questionScreen.style.display = 'none';
        this.resultScreen.style.display = 'block';
    }

    // 更新題目顯示
    updateQuestion(question, questionNumber, totalQuestions, progress) {
        this.questionNumber.textContent = `第 ${questionNumber} 步 / 共 ${totalQuestions} 步`;
        this.questionText.textContent = question.question;

        // 更新進度條（使用新的 progress-bar ID）
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    // 渲染選項
    renderOptions(options, onSelectCallback) {
        this.optionsContainer.innerHTML = '';

        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt.text;
            div.onclick = () => onSelectCallback(opt.type);
            this.optionsContainer.appendChild(div);
        });
    }

    // 顯示測驗結果
    renderResult(resultKey) {
        const data = plantData[resultKey];

        // 基本資訊
        document.getElementById('plantIcon').src = getPlantImage(resultKey);
        document.getElementById('plantName').textContent = data.name;
        document.getElementById('plantTagline').textContent = data.tagline;
        document.getElementById('plantDescription').innerHTML = data.description;

        // 座標點
        const point = document.getElementById('coordPoint');
        point.style.left = `${data.coord.x}%`;
        point.style.top = `${data.coord.y}%`;
        point.style.background = data.color;
        point.style.boxShadow = `0 0 16px ${data.color}`;

        document.getElementById('coordTitle').textContent = `你的情緒座標：${data.field}`;
        document.getElementById('coordSubtitle').textContent = data.fieldDesc;

        // 關係植物
        this.renderRelationships(data.relationships);

        // 香氣推薦
        this.renderScents(data.scent);
    }

    // 渲染關係植物
    renderRelationships(relationships) {
        const relationGrid = document.getElementById('relationGrid');
        relationGrid.innerHTML = '';

        const roleMap = {
            partner: "❤️ 另一半 / 曖昧對象",
            friend: "🤝 朋友",
            enemy: "🔥 仇人"
        };

        ["partner", "friend", "enemy"].forEach(role => {
            const rel = relationships[role];

            // 取得所有植物名稱，用頓號分隔
            const plantNames = rel.plants.map(key => plantData[key].name).join('、');

            // 建立圖片 HTML（如果有多個植物，加上 multi-plant 類別）
            const imagesHtml = rel.plants.map(key =>
                `<img src="${getPlantImage(key)}" alt="${plantData[key].name}" class="relation-img ${rel.plants.length > 1 ? 'multi-plant' : ''}">`
            ).join('');

            const card = document.createElement('div');
            card.className = 'relation-card';

            card.innerHTML = `
                <div class="relation-role">${roleMap[role]}</div>
                <div class="relation-plant-name">${plantNames}</div>
                <div class="relation-images">${imagesHtml}</div>
                <div class="relation-text">${rel.text}</div>
            `;
            relationGrid.appendChild(card);
        });
    }

    // 渲染香氣推薦
    renderScents(scent) {
        const scentGrid = document.getElementById('scentGrid');
        scentGrid.innerHTML = '';

        const similarCard = document.createElement('div');
        similarCard.className = 'scent-card';
        similarCard.innerHTML = `
            <div class="scent-type">相似香氣｜你會自然喜歡的味道</div>
            <div class="scent-name">${scent.similar.name}</div>
            <div class="scent-text">${scent.similar.text}</div>
            ${scent.similar.link ? `<a href="${scent.similar.link}" target="_blank" rel="noopener noreferrer" class="scent-link" aria-label="查看 ${scent.similar.name} 產品詳情">查看更多 →</a>` : ''}
        `;

        const balanceCard = document.createElement('div');
        balanceCard.className = 'scent-card';
        balanceCard.innerHTML = `
            <div class="scent-type">平衡香氣｜幫你調整能量的味道</div>
            <div class="scent-name">${scent.balance.name}</div>
            <div class="scent-text">${scent.balance.text}</div>
            ${scent.balance.link ? `<a href="${scent.balance.link}" target="_blank" rel="noopener noreferrer" class="scent-link" aria-label="查看 ${scent.balance.name} 產品詳情">查看更多 →</a>` : ''}
        `;

        scentGrid.appendChild(similarCard);
        scentGrid.appendChild(balanceCard);
    }

    // 顯示即時反饋文字
    showFeedback(text) {
        if (!this.feedbackMessage) return;

        this.feedbackMessage.textContent = text;
        this.feedbackMessage.classList.remove('show');

        // 強制重繪
        void this.feedbackMessage.offsetHeight;

        this.feedbackMessage.classList.add('show');

        // 2 秒後自動移除
        setTimeout(() => {
            this.feedbackMessage.classList.remove('show');
        }, 2000);
    }

    // 顯示階段性提示
    showProgressInsight(text) {
        if (!this.progressInsight) return;

        this.progressInsight.textContent = text;
        this.progressInsight.classList.remove('show');

        void this.progressInsight.offsetHeight;

        this.progressInsight.classList.add('show');

        // 3 秒後自動隱藏
        setTimeout(() => {
            this.progressInsight.classList.remove('show');
            setTimeout(() => {
                this.progressInsight.textContent = '';
            }, 300);
        }, 3000);
    }

    // 清除即時反饋
    clearFeedback() {
        if (this.feedbackMessage) {
            this.feedbackMessage.textContent = '';
            this.feedbackMessage.classList.remove('show');
        }
        if (this.progressInsight) {
            this.progressInsight.textContent = '';
            this.progressInsight.classList.remove('show');
        }
    }
}
