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
        this.questionNumber.textContent = `問題 ${questionNumber} / ${totalQuestions}`;
        this.questionText.textContent = question.question;
        this.progressFill.style.width = `${progress}%`;
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
        document.getElementById('plantIcon').textContent = data.icon;
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
            const mainPlantKey = rel.plants[0];
            const plantName = plantData[mainPlantKey].name;

            const card = document.createElement('div');
            card.className = 'relation-card';

            card.innerHTML = `
                <div class="relation-role">${roleMap[role]}</div>
                <div class="relation-plant-name">${plantName}</div>
                <img src="${getPlantImage(mainPlantKey)}" alt="${plantName}" class="relation-img">
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
        `;

        const balanceCard = document.createElement('div');
        balanceCard.className = 'scent-card';
        balanceCard.innerHTML = `
            <div class="scent-type">平衡香氣｜幫你調整能量的味道</div>
            <div class="scent-name">${scent.balance.name}</div>
            <div class="scent-text">${scent.balance.text}</div>
        `;

        scentGrid.appendChild(similarCard);
        scentGrid.appendChild(balanceCard);
    }
}
