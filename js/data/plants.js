// 取得植物圖片路徑的輔助函式
export function getPlantImage(key) {
    return `images/${key}.png`;
}

// 加 LINE 連結（官網頁尾同一個，@349nwwah）
export const LINE_URL = "https://lin.ee/A9iq98L";

// 七支配方的購買連結：集中寫一次，植物資料用 key 指過來
// pca：配方身分證主檔「香調總覽」的 PCA 座標（X 溫度：東暖為正；Y 能量：北升為正）
// spray／subscribe 尚待提供，留 null 時按鈕會先連到 LINE
const ECPAY = "https://90a5d24hxz.cashier.ecpay.com.tw/product/";
export const products = {
    oboro:    { name: "夜和 Oboro Night",    pca: { x: -0.7, y: -0.4 }, oil: ECPAY + "000000000914690", spray: null, subscribe: null },
    komorebi: { name: "暖居 Komorebi Haven", pca: { x: 0.3, y: 0.6 }, oil: ECPAY + "000000000920061", spray: null, subscribe: null },
    sumi:     { name: "朝光 Sumi Dawn",      pca: { x: -0.4, y: 1.2 }, oil: ECPAY + "000000000920152", spray: null, subscribe: null },
    yuyake:   { name: "日暮 Yuyake Ember",   pca: { x: 0.8, y: -0.1 }, oil: ECPAY + "000000000932839", spray: null, subscribe: null },
    akari:    { name: "花綻 Hana Akari",     pca: { x: 0.2, y: 1.5 }, oil: ECPAY + "000000000976122", spray: null, subscribe: null },
    ikada:    { name: "花筏 Hana Ikada",     pca: { x: -0.6, y: -0.8 }, oil: ECPAY + "000000000976123", spray: null, subscribe: null },
    suboo:    { name: "思慕 Su Boo",         pca: { x: 0.6, y: -0.2 }, oil: ECPAY + "000000001035170", spray: null, subscribe: null }
};

// 植物座標（coord 是畫面百分比，y 由上往下）換成 PCA 軸向，判斷象限用
export function plantPca(plant) {
    return { x: (plant.coord.x - 50) / 50, y: (50 - plant.coord.y) / 50 };
}

// PCA 座標換成座標圖上的百分比位置（±1 對應圖的邊緣，超出就貼邊）
export function pcaToPercent(pca) {
    const clamp = v => Math.min(94, Math.max(6, v));
    return { left: clamp(50 + pca.x * 50), top: clamp(50 - pca.y * 50) };
}

// 座標對外顯示格式（同配方身分證客顯規則）：去正負號、一位小數，W/E、S/N
export function formatPca(p) {
    const r = v => Math.abs(Math.round(v * 10) / 10).toFixed(1);
    return `(${p.x < 0 ? 'W' : 'E'} ${r(p.x)}, ${p.y < 0 ? 'S' : 'N'} ${r(p.y)})`;
}

// 同一象限＝相似香氣，不同象限＝平衡香氣（由座標自動判斷，避免標錯）
export function scentRole(plant, productKey) {
    const p = plantPca(plant);
    const s = products[productKey].pca;
    return (Math.sign(p.x) === Math.sign(s.x) && Math.sign(p.y) === Math.sign(s.y)) ? 'similar' : 'balance';
}

// 植物類型資料
export const plantData = {
    lavender: {
        icon: "🌾",
        name: "薰衣草型",
        tagline: "Calm × Cool｜把世界調成靜音的人",
        coord: { x: 30, y: 70 }, // 低能量、偏涼
        color: "#c39ad9",
        field: "安定靜心區 Calm Field",
        fieldDesc: "你現在待在地圖上很安靜的角落。不用急著出來，燈也先不用開。",
        description: `
            你對聲音、光線、別人說話的語氣，都比一般人多聽見一點。<br>
            所以你常常很累，累到連「我很累」都懶得說。<br>
            你不討厭人。只是比起熱鬧，你更想要一個沒有人需要你回應的下午。<br>
            這不是孤僻。你的電池，本來就是用安靜充電的。
        `,
        relationships: {
            partner: {
                plants: ["peony"],
                text: "他像一盞不問你意見就亮起來的燈。有點刺眼，但你偷偷承認，暗的時候有他比較好。"
            },
            friend: {
                plants: ["chamomile", "cypress"],
                text: "洋甘菊不會逼你說話，扁柏不會問你為什麼不說話。這樣就很好了。"
            },
            enemy: {
                plants: ["mint"],
                text: "他已經出發了，你還在找鞋子。不是誰的錯，只是你們活在不同的時區。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["把世界調成靜音", "感受力太好也是一種累", "安靜但都看在眼裡"],
            line: "夜和帶給人的感覺是平靜透徹的，宛如你給人的感覺——安靜如水，卻讓人很舒服。只是沒有人知道，那份平靜是你一個人關上很多次門，才換來的。"
        },
        scent: {
            featured: "similar", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "oboro",
                name: "夜和 Oboro Night",
                text: "偏涼、偏安定的香氣座標，像夜裡那口真正吐出的長長嘆息。"
            },
            balance: {
                product: "ikada",
                name: "花筏 Hana Ikada",
                text: "花瓣落在水面，沒有掙扎，就這樣漂著。有些事放不下也沒關係，先讓它跟著水走一段。"
            }
        }
    },
    cypress: {
        icon: "🌲",
        name: "扁柏型",
        tagline: "Calm × Cool｜有自己時區的人",
        coord: { x: 40, y: 65 },
        color: "#7fa48e",
        field: "安定靜心區 Calm Field",
        fieldDesc: "你站在一個清冷但很穩的位置。風有點大，但你知道自己站得住。",
        description: `
            你不太追著人群跑，也不太被情緒拖著走。<br>
            別人覺得你冷，其實你只是不想把力氣花在不重要的事上。<br>
            你相信日子要慢慢過，好東西都需要等。<br>
            只是偶爾，你也會在某個很普通的晚上，突然希望有人主動來敲門。
        `,
        relationships: {
            partner: {
                plants: ["hinoki"],
                text: "你們都不太說話，卻都記得對方的咖啡要加幾顆糖。這樣的感情不吵，但很久。"
            },
            friend: {
                plants: ["lavender", "peony"],
                text: "薰衣草陪你一起安靜，牡丹把你拖出門曬太陽。你嘴上嫌麻煩，其實兩種都需要。"
            },
            enemy: {
                plants: ["mint"],
                text: "你還在想要不要出門，他已經在第三個地方打卡了。你們不是不合，只是速度差太多。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["有自己的時區", "不熱絡但很可靠", "冷只是一種省電模式"],
            line: "夜和帶給人的感覺是清冷而篤定的，宛如你給人的感覺——話不多，待在旁邊卻很安心。其實你不是冷，你只是把為數不多的溫柔，留給真正懂你的人。"
        },
        scent: {
            featured: "similar", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "oboro",
                name: "夜和 Oboro Night",
                text: "木質與草本的清冷軸線，和你對安穩的追求很像。"
            },
            balance: {
                product: "suboo",
                name: "思慕 Su Boo",
                text: "思慕像老房子裡被陽光曬暖的木頭。它不會改變你，只是在你太理性的日子裡，偷偷放一盞小黃燈。"
            }
        }
    },
    hinoki: {
        icon: "🪵",
        name: "檜木型",
        tagline: "Calm × Warm｜習慣當大樹的人",
        coord: { x: 58, y: 65 },
        color: "#c49a6c",
        field: "溫潤和諧區 Harmony Field",
        fieldDesc: "你待在地圖上最穩的地方。大家覺得「有你在就好了」，但你也可以偶爾不在。",
        description: `
            你不太會說好聽的話，但答應的事，你都會做完。<br>
            大家累了會來靠你，像靠一棵樹，你也就一直站著。<br>
            有時候半夜突然覺得很累，才想起自己好像很久沒被誰問過「你還好嗎」。<br>
            樹也是可以休息的。葉子掉了，春天還是會再長。
        `,
        relationships: {
            partner: {
                plants: ["cypress"],
                text: "兩個都不愛說話的人，可以一起安靜地吃完一頓飯。不用解釋，就是很好的那種沉默。"
            },
            friend: {
                plants: ["chamomile", "mint"],
                text: "洋甘菊會記得問你累不累，薄荷會硬拉你去做點新的事。你很少開口要，但他們都給了。"
            },
            enemy: {
                plants: ["lavender"],
                text: "你沉默是因為在想辦法，他沉默是因為想躲起來。兩種沉默放在一起，很容易被誤會成冷淡。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["大家的大樹", "答應的事都會做完", "累了也很少說"],
            line: "暖居帶給人的感覺是溫暖而可靠的，宛如你給人的感覺——像一棵大樹，靠近的人都會先鬆一口氣。只是你也會累，只是你從來不太說。"
        },
        scent: {
            featured: "similar", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "komorebi",
                name: "暖居 Komorebi Haven",
                text: "你總是穩穩撐著大家。暖居的柑橘陽光會幫你補一點元氣，讓穩重裡也有輕快。"
            },
            balance: {
                product: "yuyake",
                name: "日暮 Yuyake Ember",
                text: "跟你一樣沉穩的煙燻木質調。像傍晚收工後還沒熄的柴火，陪你把撐了一整天的自己，慢慢放下來。"
            }
        }
    },
    chamomile: {
        icon: "🌼",
        name: "洋甘菊型",
        tagline: "Calm × Warm｜很會接住別人的人",
        coord: { x: 68, y: 60 },
        color: "#f4c37b",
        field: "溫潤和諧區 Harmony Field",
        fieldDesc: "你待在一個溫暖柔軟的地方。只是這裡的暖，大多是你給出去的。",
        description: `
            你很會察覺別人的情緒，常常在對方開口前，就已經把茶泡好了。<br>
            你說「沒關係」的次數，大概比「我想要」多很多。<br>
            有時候你會懷疑，如果自己不那麼體貼，還會不會有人留下來。<br>
            會的。你不需要一直很有用，才值得被喜歡。
        `,
        relationships: {
            partner: {
                plants: ["mint"],
                text: "他往前衝，你在後面喊「慢一點」。他回頭的時候，才發現你一直都在。"
            },
            friend: {
                plants: ["lavender", "hinoki"],
                text: "薰衣草懂你的敏感，檜木讓你有地方靠。在他們面前，你終於可以不用當那個照顧人的人。"
            },
            enemy: {
                plants: ["peony"],
                text: "他的情緒很大聲，而你很容易把別人的情緒全吸進來。待久了，你會累到說不出哪裡累。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["很會接住別人", "沒關係說太多次", "也想被好好接住"],
            line: "暖居帶給人的感覺是柔軟而有溫度的，宛如你給人的感覺——總能把別人的情緒輕輕接住。只是你最常忘記的，是自己也需要被這樣接住。"
        },
        scent: {
            featured: "similar", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "komorebi",
                name: "暖居 Komorebi Haven",
                text: "像家一樣的溫度，再多一點陽光，會讓你覺得「我也可以被照顧」。"
            },
            balance: {
                product: "akari",
                name: "花綻 Hana Akari",
                text: "你總是先看見別人。花綻像一朵為自己而開的櫻花，不為誰，只是因為春天到了。你也可以這樣。"
            }
        }
    },
    mint: {
        icon: "🍃",
        name: "薄荷葉型",
        tagline: "Active × Cool｜停不下來的人",
        coord: { x: 40, y: 30 },
        color: "#52c1a8",
        field: "光合啟動區 Vital Field",
        fieldDesc: "你站在能量很高的位置，腳一直在動。偶爾也抬頭看看風景吧。",
        description: `
            你很怕停下來。一停下來，那些沒想清楚的事就會追上來。<br>
            所以你一直往前，做很多事，把行程排得很滿。<br>
            大家都說你很有行動力，只有你知道，有些時候那其實是一種逃跑。<br>
            沒關係，跑累了就坐一下。路不會因為你休息就消失。
        `,
        relationships: {
            partner: {
                plants: ["chamomile"],
                text: "你一直往前推，他一直在原地等你。哪天你終於停下來，會發現他手上的茶還是溫的。"
            },
            friend: {
                plants: ["hinoki", "peony"],
                text: "檜木讓你踩煞車，牡丹陪你踩油門。你嘴上只要一個，其實兩個都需要。"
            },
            enemy: {
                plants: ["lavender"],
                text: "你想開機，他想關機。不是誰比較好，只是你們的電源在不同的地方。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["行動派", "腦袋停不下來", "忙是一種躲雨的方式"],
            line: "暖居帶給人的感覺是明亮又有朝氣的，宛如你給人的感覺——走到哪裡，哪裡就跟著動起來。但你停下來的那一刻，其實比誰都需要一盞暖光。"
        },
        scent: {
            featured: "balance", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "sumi",
                name: "朝光 Sumi Dawn",
                text: "清晨的柑橘和薄荷，跟你一樣醒得很早。適合你還有力氣出發的早上。"
            },
            balance: {
                product: "komorebi",
                name: "暖居 Komorebi Haven",
                text: "當你一直踩油門時，暖居會提醒你：有些路可以慢慢走。"
            }
        }
    },
    peony: {
        icon: "🌸",
        name: "牡丹型",
        tagline: "Active × Warm｜很會發光，也很會累的人",
        coord: { x: 76, y: 28 },
        color: "#f29bb5",
        field: "熱烈綻放區 Radiance Field",
        fieldDesc: "你站在地圖上最亮的地方。亮是好事，只是記得偶爾關燈。",
        description: `
            你喜歡生活有畫面，喜歡被看見，也喜歡把喜歡說出口。<br>
            你愛得很明顯，失望的時候也很明顯。<br>
            散場後回家的路上，你偶爾會突然很安靜，想著剛剛那些笑，有幾個是真的。<br>
            你的光不是表演。只是發光的人，也需要一個可以暗下來的地方。
        `,
        relationships: {
            partner: {
                plants: ["lavender"],
                text: "你負責把世界點亮，他負責讓你知道關燈也沒關係。他是少數看過你安靜樣子的人。"
            },
            friend: {
                plants: ["cypress", "mint"],
                text: "扁柏讓你落地，薄荷陪你飛。在他們身邊，你不用一直很好看。"
            },
            enemy: {
                plants: ["chamomile"],
                text: "你的情緒很滿，他又很會吸收情緒。久了兩個人都會累，而且都不好意思說。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["自帶光芒", "愛得很明顯", "散場後會突然安靜"],
            line: "暖居帶給人的感覺是熱烈又溫暖的，宛如你給人的感覺——一出現，整個空間都亮了。只是很少人知道，你的光一直在等一個，看過你暗下來也不會走的人。"
        },
        scent: {
            featured: "similar", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "komorebi",
                name: "暖居 Komorebi Haven",
                text: "柑橘與木質的明亮溫度，跟你的熱度同一個頻率，又多了一份讓人想靠近的柔軟。"
            },
            balance: {
                product: "suboo",
                name: "思慕 Su Boo",
                text: "思慕是阿嬤家老木頭和橘子皮的味道。光開太久的時候，它會把你接回一個不用發亮的地方。"
            }
        }
    }
};
