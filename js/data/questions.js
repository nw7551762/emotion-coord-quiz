// 10 題：問句簡短、選項一句話；feedback＝點了這個選項後跳出的回應（對著選項內容回話）
export const questions = [
    {
        question: "今晚，你最想怎麼過？",
        options: [
            { text: "手機丟一邊，一個人待著。", type: "lavender", feedback: "🌙 嗯，今晚誰都不用回。" },
            { text: "整理家裡，然後躺平。", type: "hinoki", feedback: "🪵 收乾淨，心裡就舒服了。" },
            { text: "熱飲配劇，慢慢放鬆。", type: "chamomile", feedback: "🫖 超級舒適～～" },
            { text: "先把明天的待辦列好。", type: "mint", feedback: "📝 列好了，就放得下心。" }
        ]
    },
    {
        question: "週末突然空出來了，你會？",
        options: [
            { text: "關機，把覺補回來。", type: "lavender", feedback: "😴 欠的覺，先還給自己。" },
            { text: "咖啡、花、曬太陽。", type: "chamomile", feedback: "☀️ 好好感受生活好讚～" },
            { text: "大掃除，重整房間。", type: "cypress", feedback: "🧹 房間順了，心也跟著順了。" },
            { text: "馬上約人出門玩耍！", type: "peony", feedback: "🎉 週末就是要熱鬧一下啊啊啊！" }
        ]
    },
    {
        question: "壓力大的時候，你最需要？",
        options: [
            { text: "誰都別找我。", type: "cypress", feedback: "🔕 好，先讓世界安靜一下。" },
            { text: "有人陪我講廢話。", type: "chamomile", feedback: "💬 廢話，那是一定要說的！" },
            { text: "有人幫我想下一步。", type: "mint", feedback: "🧭 有方向，就沒那麼慌了。" },
            { text: "做出點成績，證明我還超棒！", type: "peony", feedback: "✨ 你本來就很棒，不用一直證明。" }
        ]
    },
    {
        question: "遇到大決定，你通常？",
        options: [
            { text: "先收集資訊，想清楚再動。", type: "cypress", feedback: "🔍 想清楚再走，很像你。" },
            { text: "有感覺就跟著走。", type: "peony", feedback: "💗 心動，本身就是一種答案～。" },
            { text: "找信任的朋友聊聊。", type: "chamomile", feedback: "🤝 有人一起想，就沒那麼怕。" },
            { text: "列好優缺點，列完就決定。", type: "mint", feedback: "📋 算清楚了，果斷不回頭。" }
        ]
    },
    {
        question: "在一段關係裡，你最怕？",
        options: [
            { text: "被黏太緊，沒有自己的空間。", type: "lavender", feedback: "🚪 你需要一扇可以關上的門。" },
            { text: "對方忽冷忽熱。", type: "hinoki", feedback: "🌡️ 辛苦了，你值得更好的。" },
            { text: "很平穩，但沒有心動。", type: "peony", feedback: "🔥 未來的日子要如何精彩？" },
            { text: "一直安撫對方，自己沒被看見。", type: "chamomile", feedback: "🫂 你也值得被好好看見。" }
        ]
    },
    {
        question: "你內心的小房間，比較像？",
        options: [
            { text: "深夜裡街道旁的書房。", type: "lavender", feedback: "📖 與他人的距離剛剛好。" },
            { text: "森林裡大樹上的木屋。", type: "cypress", feedback: "🌲 置身事外，回歸本心。" },
            { text: "有陽光、常有人來的客廳。", type: "chamomile", feedback: "🛋️ 享受一起體驗的日常。" },
            { text: "鎂光燈四射的舞台。", type: "peony", feedback: "🎤 everyday都要開party!" }
        ]
    },
    {
        question: "別人對你的第一印象？",
        options: [
            { text: "安靜，心思細膩。", type: "lavender", feedback: "👀 不說，不代表沒看見。" },
            { text: "穩定，可以託付。", type: "hinoki", feedback: "🌳 交給你，大家就放心了。" },
            { text: "風趣幽默，好親近。", type: "chamomile", feedback: "😄 有你在，氣氛就鬆了。" },
            { text: "超有存在感，核心位置。", type: "peony", feedback: "🌟 你一進門，大家就知道了。" }
        ]
    },
    {
        question: "累到極限的時候，你會？",
        options: [
            { text: "消失一陣子，通知全關。", type: "lavender", feedback: "🔋 消失一下，不是逃，是充電。" },
            { text: "照常過生活，最低努力地過生活。", type: "cypress", feedback: "🪫 省電模式，也是一種撐住。" },
            { text: "還在照顧別人，只是對自己沒耐心了。", type: "chamomile", feedback: "🫖 這杯茶，這次留給自己。" },
            { text: "事情照做，私下大哭一場。", type: "peony", feedback: "🌧️ 哭完，明天還是會亮的。" }
        ]
    },
    {
        question: "理想中的工作狀態是？",
        options: [
            { text: "專心做少數重要的事。", type: "cypress", feedback: "🎯 少一點，反而更準。" },
            { text: "穩穩往前，每步都踏實。", type: "hinoki", feedback: "👣 慢，但每一步都算數。" },
            { text: "帶動氣氛，活躍工作氛圍。", type: "peony", feedback: "⚡ 有你在，大家都動起來了。" },
            { text: "工作再忙，也照顧得到身邊的人。", type: "chamomile", feedback: "💛 忙成這樣，還記得別人。" }
        ]
    },
    {
        question: "現在想對自己說哪一句？",
        options: [
            { text: "「關掉世界一下，沒關係。」", type: "lavender", feedback: "🌙 好，燈先關了。" },
            { text: "「夠努力了，先顧自己。」", type: "chamomile", feedback: "🫶 這次，輪到你自己。" },
            { text: "「不用急，慢慢來。」", type: "hinoki", feedback: "🍃 慢慢來，比較快。" },
            { text: "「勇敢一點，你的光值得被看見。」", type: "peony", feedback: "✨ 你的光，一直都在。" }
        ]
    }
];
