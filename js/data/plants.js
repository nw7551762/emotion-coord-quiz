// 取得植物圖片路徑的輔助函式
export function getPlantImage(key) {
    return `images/${key}.png`;
}

// 加 LINE 連結（官網頁尾同一個，@349nwwah）
export const LINE_URL = "https://lin.ee/A9iq98L";

// 七支配方的購買連結：集中寫一次，植物資料用 key 指過來
// pca：配方身分證主檔「香調總覽」的 PCA 座標（X 溫度：東暖為正；Y 能量：北升為正）
// spray／subscribe 留 null 時按鈕會改連到 LINE
const ECPAY = "https://90a5d24hxz.cashier.ecpay.com.tw/product/";
// 「訂閱這支」一律連到月訂閱（下單時選香味）
const SUBSCRIBE = ECPAY + "000000000914687";
export const products = {
    oboro:    { name: "夜和 Oboro Night",    pca: { x: -0.7, y: -0.4 }, oil: ECPAY + "000000000914690", spray: ECPAY + "000000000933604", subscribe: SUBSCRIBE },
    komorebi: { name: "暖居 Komorebi Haven", pca: { x: 0.3, y: 0.6 }, oil: ECPAY + "000000000920061", spray: ECPAY + "000000000933603", subscribe: SUBSCRIBE },
    sumi:     { name: "朝光 Sumi Dawn",      pca: { x: -0.4, y: 1.2 }, oil: ECPAY + "000000000920152", spray: ECPAY + "000000000933602", subscribe: SUBSCRIBE },
    yuyake:   { name: "日暮 Yuyake Ember",   pca: { x: 0.8, y: -0.1 }, oil: ECPAY + "000000000932839", spray: ECPAY + "000000000933357", subscribe: SUBSCRIBE },
    akari:    { name: "花綻 Hana Akari",     pca: { x: 0.2, y: 1.5 }, oil: ECPAY + "000000000976122", spray: ECPAY + "000000000976124", subscribe: SUBSCRIBE },
    ikada:    { name: "花筏 Hana Ikada",     pca: { x: -0.6, y: -0.8 }, oil: ECPAY + "000000000976123", spray: ECPAY + "000000000976125", subscribe: SUBSCRIBE },
    suboo:    { name: "思慕 Su Boo",         pca: { x: 0.6, y: -0.2 }, oil: ECPAY + "000000001035170", spray: ECPAY + "000000001035171", subscribe: SUBSCRIBE }
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
        fieldDesc: "你待在安靜的角落。燈先不用開。",
        description: `
            你比別人多聽見一點聲音，所以常常很累。<br>
            不是討厭人，只是更想要一個沒人需要你回應的下午。<br>
            你的電池，本來就是用安靜充電的。
        `,
        relationships: {
            partner: {
                plants: ["peony"],
                text: "他像一盞自己亮起來的燈。有點刺眼，但暗的時候有他比較好。"
            },
            friend: {
                plants: ["chamomile", "cypress"],
                text: "一個不逼你說話，一個不問你為什麼不說話。"
            },
            enemy: {
                plants: ["mint"],
                text: "他出發了，你還在找鞋子。只是時區不同。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["一個人也很好", "感受力太好也是一種累", "安靜但都看在眼裡"],
            line: "夜和平靜透徹，就像你給人的感覺——安靜，卻讓人很舒服。只是沒人知道，那是你關上很多次門換來的。"
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
                text: "花瓣落在水面，就這樣漂著。放不下的，先讓它跟著水走一段。"
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
        fieldDesc: "清冷，但站得很穩。",
        description: `
            你不追人群，也不被情緒拖著走。<br>
            不是冷，只是不想把力氣花在不重要的事上。<br>
            只是偶爾，也會希望有人主動來敲門。
        `,
        relationships: {
            partner: {
                plants: ["hinoki"],
                text: "都不太說話，卻記得對方的咖啡加幾顆糖。"
            },
            friend: {
                plants: ["lavender", "peony"],
                text: "薰衣草陪你安靜，牡丹拖你出門曬太陽。兩種你都需要。"
            },
            enemy: {
                plants: ["mint"],
                text: "你還在想要不要出門，他已經去了第三個地方。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["慢熱但很長情", "不熱絡但很可靠", "冷只是一種省電模式"],
            line: "夜和清冷篤定，就像你給人的感覺——話不多，卻讓人安心。其實你不是冷，只是把溫柔留給懂你的人。"
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
                text: "像被陽光曬暖的老木頭。在你太理性的日子，留一盞小黃燈。"
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
        fieldDesc: "地圖上最穩的地方。但你也可以偶爾不在。",
        description: `
            你不太會說好聽話，但答應的事都會做完。<br>
            大家累了就來靠你，你也就一直站著。<br>
            樹也是可以休息的。
        `,
        relationships: {
            partner: {
                plants: ["cypress"],
                text: "兩個不愛說話的人，安靜吃完一頓飯，就很好。"
            },
            friend: {
                plants: ["chamomile", "mint"],
                text: "一個問你累不累，一個拉你去做新的事。"
            },
            enemy: {
                plants: ["lavender"],
                text: "你沉默是在想辦法，他沉默是想躲起來。很容易誤會。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["有你在就安心", "答應的事都會做完", "累了也很少說"],
            line: "暖居溫暖可靠，就像你給人的感覺——靠近你的人，都會先鬆一口氣。只是你也會累，只是很少說。"
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
                text: "傍晚還沒熄的柴火，陪你把撐了一天的自己放下。"
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
        fieldDesc: "很暖的地方。只是這裡的暖，大多是你給的。",
        description: `
            你常在別人開口前，就把茶泡好了。<br>
            說「沒關係」的次數，比「我想要」多很多。<br>
            你不需要一直很有用，才值得被喜歡。
        `,
        relationships: {
            partner: {
                plants: ["mint"],
                text: "他往前衝，你喊慢一點。他回頭時，你一直都在。"
            },
            friend: {
                plants: ["lavender", "hinoki"],
                text: "在他們面前，你終於不用當照顧人的那個。"
            },
            enemy: {
                plants: ["peony"],
                text: "他的情緒很大聲，而你全都吸進去了。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["茶都先泡給別人", "沒關係說太多次", "也想被好好接住"],
            line: "暖居柔軟有溫度，就像你給人的感覺——總能接住別人。只是你常忘了，自己也需要被接住。"
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
                text: "一朵為自己而開的花，不為誰。你也可以這樣。"
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
        fieldDesc: "能量很高，腳一直在動。偶爾也看看風景。",
        description: `
            你很怕停下來，一停，沒想清楚的事就追上來。<br>
            大家說你很有行動力，只有你知道，那有時是逃跑。<br>
            跑累了就坐一下，路不會消失。
        `,
        relationships: {
            partner: {
                plants: ["chamomile"],
                text: "你一直往前，他一直在等。你停下來時，他的茶還是溫的。"
            },
            friend: {
                plants: ["hinoki", "peony"],
                text: "一個幫你踩煞車，一個陪你踩油門。"
            },
            enemy: {
                plants: ["lavender"],
                text: "你想開機，他想關機。電源不在同一個地方。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["行動派", "行程永遠排太滿", "忙是一種躲雨的方式"],
            line: "暖居明亮有朝氣，就像你給人的感覺——走到哪，哪裡就動起來。但你停下來時，比誰都需要一盞暖光。"
        },
        scent: {
            featured: "balance", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "sumi",
                name: "朝光 Sumi Dawn",
                text: "清晨的柑橘和薄荷，跟你一樣早起。"
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
        fieldDesc: "地圖上最亮的地方。記得偶爾關燈。",
        description: `
            你愛得很明顯，失望也很明顯。<br>
            散場後的回家路上，偶爾會突然很安靜。<br>
            發光的人，也需要一個可以暗下來的地方。
        `,
        relationships: {
            partner: {
                plants: ["lavender"],
                text: "你點亮世界，他讓你知道關燈也沒關係。"
            },
            friend: {
                plants: ["cypress", "mint"],
                text: "一個讓你落地，一個陪你飛。在他們身邊，不用一直好看。"
            },
            enemy: {
                plants: ["chamomile"],
                text: "你的情緒很滿，他又太會吸收。久了兩個人都累。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["自帶光芒", "愛得很明顯", "散場後會突然安靜"],
            line: "暖居熱烈溫暖，就像你給人的感覺——一出現，空間就亮了。只是你一直在等，一個看過你暗下來也不走的人。"
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
                text: "老木頭和橘子皮的味道，把你接回不用發亮的地方。"
            }
        }
    }
};
