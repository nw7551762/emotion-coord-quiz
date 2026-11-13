import { plantData, getPlantImage, products, LINE_URL, scentRole, pcaToPercent } from './data/plants.js?v=6';

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
        this.optionsContainer.classList.remove('locked');

        options.forEach(opt => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt.text;
            div.onclick = () => {
                // 已經選過就不再接受點擊（避免連點記到兩個答案）
                if (this.optionsContainer.classList.contains('locked')) return;
                this.optionsContainer.classList.add('locked');
                div.classList.add('selected');
                onSelectCallback(opt);
            };
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
        const tagsEl = document.getElementById('personaTags');
        if (tagsEl) {
            tagsEl.innerHTML = (data.persona?.traits || []).map(t => `<span class="persona-tag">#${t}</span>`).join('');
        }
        document.getElementById('plantDescription').innerHTML = data.description;

        // 座標點
        const point = document.getElementById('coordPoint');
        point.style.left = `${data.coord.x}%`;
        point.style.top = `${data.coord.y}%`;
        point.style.background = data.color;
        point.style.boxShadow = `0 0 16px ${data.color}`;

        // 本命香在 PCA 座標上的位置
        const featuredProduct = products[data.scent[data.scent.featured || 'similar'].product];
        const star = document.getElementById('coordScent');
        if (star) {
            const pos = pcaToPercent(featuredProduct.pca);
            star.style.left = `${pos.left}%`;
            star.style.top = `${pos.top}%`;
        }
        const legend = document.getElementById('coordLegend');
        if (legend) {
            legend.innerHTML = `
                <span><i class="legend-dot" style="background:${data.color}"></i>你的位置</span>
                <span><i class="legend-star">★</i>本命香 ${featuredProduct.name.split(' ')[0]}</span>
                <div class="coord-legend-note">香氣位置依煖意 PCA 情緒座標系統，由配方成分計算定位</div>`;
        }

        document.getElementById('coordTitle').textContent = `你的情緒座標：${data.field}`;
        document.getElementById('coordSubtitle').textContent = data.fieldDesc;

        // 關係植物
        this.renderRelationships(data.relationships);

        // 香氣推薦
        this.renderScents(data.scent, resultKey);
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

    // 渲染香氣推薦：主推（訂閱）卡在前，搭配香在後
    renderScents(scent, resultKey) {
        const scentGrid = document.getElementById('scentGrid');
        scentGrid.innerHTML = '';

        const roleLabel = {
            similar: '相似香氣｜你會自然喜歡的味道',
            balance: '平衡香氣｜幫你調整能量的味道'
        };
        const featuredRole = scent.featured || 'similar';
        const otherRole = featuredRole === 'similar' ? 'balance' : 'similar';

        // 連結加上來源，之後看得出是哪個結果帶來的
        const tag = (url, content) => {
            const u = new URL(url);
            u.searchParams.set('utm_source', 'quiz');
            u.searchParams.set('utm_medium', 'result');
            u.searchParams.set('utm_content', `${resultKey}-${content}`);
            return u.toString();
        };
        // 噴霧／訂閱連結還沒給的話，先導到 LINE
        const linkFor = (product, kind) => tag(product[kind] || LINE_URL, kind);

        const buildCard = (role, isFeatured) => {
            const item = scent[role];
            const product = products[item.product];
            const card = document.createElement('div');
            card.className = `scent-card ${isFeatured ? 'scent-card--featured' : 'scent-card--pair'}`;

            const perks = isFeatured ? `
                <ul class="sub-perks">
                    <li><span>🌬️</span>訂閱期間，台灣 MIT 擴香儀免費用</li>
                    <li><span>🔄</span>每個月都能在 LINE 一鍵換香，7 支配方任你換</li>
                    <li><span>🎁</span>滿 12 個月：退還 $1,980 保證金，或帶走一台新擴香儀</li>
                </ul>` : '';

            card.innerHTML = `
                ${isFeatured ? '<div class="scent-badge">✦ 你的本命香・最推薦</div>' : '<div class="scent-badge scent-badge--pair">想換個心情時</div>'}
                <div class="scent-type">${roleLabel[scentRole(plantData[resultKey], item.product)]}</div>
                <div class="scent-name">${product.name}</div>
                ${isFeatured && plantData[resultKey].persona
                    ? `<div class="scent-persona">${plantData[resultKey].persona.line}</div>`
                    : `<div class="scent-text">${item.text}</div>`}
                ${perks}
                <div class="scent-actions">
                    <a href="${linkFor(product, 'subscribe')}" target="_blank" rel="noopener noreferrer"
                       class="scent-btn ${isFeatured ? 'scent-btn--primary' : 'scent-btn--secondary'}">
                       ${isFeatured ? '訂閱這支・擴香儀免費用' : '訂閱這支'}</a>
                    <a href="${linkFor(product, 'spray')}" target="_blank" rel="noopener noreferrer"
                       class="scent-btn scent-btn--secondary">${isFeatured ? '先單買噴霧試試' : '單買噴霧'}</a>
                </div>
                <a href="${tag(product.oil, 'oil')}" target="_blank" rel="noopener noreferrer" class="scent-oil-link">也有單售精油 5mL／10mL →</a>
            `;
            return card;
        };

        scentGrid.appendChild(buildCard(featuredRole, true));
        scentGrid.appendChild(buildCard(otherRole, false));

        // 加 LINE 按鈕帶上結果
        const lineBtn = document.getElementById('lineCtaBtn');
        if (lineBtn) lineBtn.href = tag(LINE_URL, 'line');
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
