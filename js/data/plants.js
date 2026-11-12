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
        tagline: "Calm × Cool｜敏感而需要安定的靈魂",
        coord: { x: 30, y: 70 }, // 低能量、偏涼
        color: "#c39ad9",
        field: "安定靜心區 Calm Field",
        fieldDesc: "你現在比較像是把自己放在一個安靜、安全的角落，慢慢恢復能量。",
        description: `
            你感受力很強，世界的噪音對你來說都偏大聲。<br>
            你喜歡有人懂你，但不喜歡被黏著；<br>
            你需要的是「可以關掉世界」的片刻，而不是永遠熱鬧的生活。<br>
            當環境安穩下來，你的直覺和觀察力，會變成很珍貴的力量。
        `,
        relationships: {
            partner: {
                plants: ["peony"],
                text: "對方的熱情能讓你的世界亮起來，但不會強迫你張開；你靜，他剛好暖。"
            },
            friend: {
                plants: ["chamomile", "cypress"],
                text: "和他們在一起，你能自在做自己：一個溫柔、一個穩定，都理解你的步調。"
            },
            enemy: {
                plants: ["mint"],
                text: "他衝得太快，你靜得太深；節奏差太多時，你容易覺得被催促、沒空呼吸。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["感受力很強", "需要關掉世界的片刻", "安靜但看得很透"],
            line: "夜和帶給人的感覺是平靜透徹的，宛如你給人的感覺——安靜如水，卻讓人很舒服。只是很少人知道，那份平靜是你一次次替自己關掉雜音換來的。"
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
                text: "和你一樣偏涼、偏靜。花筏像花瓣順著水流漂，陪你把放不下的事，慢慢放下。"
            }
        }
    },
    cypress: {
        icon: "🌲",
        name: "扁柏型",
        tagline: "Calm × Cool｜獨立、清晰、有自己步調的人",
        coord: { x: 40, y: 65 },
        color: "#7fa48e",
        field: "安定靜心區 Calm Field",
        fieldDesc: "你現在站在一個清冷卻穩固的位置，習慣用自己的節奏消化世界。",
        description: `
            你不急著融入任何人群，也不喜歡被情緒牽著跑。<br>
            你在乎的是能否「好好把日子過好」，而不是外表看起來多精彩。<br>
            你願意給時間慢慢發酵，相信真正重要的東西經得起等待。<br>
            你的理性和穩定，是很多人想靠近、卻又不太好意思打擾的安心存在。
        `,
        relationships: {
            partner: {
                plants: ["hinoki"],
                text: "你們都穩、都不急，默默一起把生活過好，是很長久的相處方式。"
            },
            friend: {
                plants: ["lavender", "peony"],
                text: "薰衣草讓你放鬆、牡丹讓你活起來；兩個方向你都能自在。"
            },
            enemy: {
                plants: ["mint"],
                text: "你要慢，他要快；步調完全對不上，很容易話還沒說完人就不見了。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["有自己的步調", "理性又可靠", "不急著融入誰"],
            line: "夜和帶給人的感覺是清冷而篤定的，宛如你給人的感覺——話不多，卻讓人很安心。其實你不是冷，你只是把溫柔留給真正懂你的人。"
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
                text: "當世界顯得過於理性，思慕胡桃木般的溫潤，會幫你的生活加一盞小小黃光。"
            }
        }
    },
    hinoki: {
        icon: "🪵",
        name: "檜木型",
        tagline: "Calm × Warm｜沉穩的守護者",
        coord: { x: 58, y: 65 },
        color: "#c49a6c",
        field: "溫潤和諧區 Harmony Field",
        fieldDesc: "你像是情緒地圖上那個穩穩站著的點，給人一種「有你在就好了」的感覺。",
        description: `
            你不一定愛說話，但會把該做的事情做完。<br>
            你在乎承諾、重視穩定，也願意為了重要的人多撐一點。<br>
            有時候你會忘記自己也會累，還是習慣先照顧好大家。<br>
            你的存在像一棵大樹，別人靠過來時會先鬆一口氣。
        `,
        relationships: {
            partner: {
                plants: ["cypress"],
                text: "有默契、不需要多話的安定組合；你們都相信\u201c慢，就是快\u201d。"
            },
            friend: {
                plants: ["chamomile", "mint"],
                text: "一個溫暖你，一個推動你；和他們一起時，你的世界剛好有了平衡。"
            },
            enemy: {
                plants: ["lavender"],
                text: "你穩，他敏感；你沉住氣，他想躲起來——很容易誤解彼此的沉默。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["大家的大樹", "說到做到", "總是先照顧別人"],
            line: "暖居帶給人的感覺是溫暖而可靠的，宛如你給人的感覺——像一棵大樹，讓靠近的人先鬆一口氣。只是你也會累，只是你很少說。"
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
                text: "跟你一樣沉穩的煙燻木質調，像傍晚收工後的柴火，陪你把撐了一天的自己放下。"
            }
        }
    },
    chamomile: {
        icon: "🌼",
        name: "洋甘菊型",
        tagline: "Calm × Warm｜柔軟卻有韌性的療癒系",
        coord: { x: 68, y: 60 },
        color: "#f4c37b",
        field: "溫潤和諧區 Harmony Field",
        fieldDesc: "你待在一個溫暖、柔軟的象限裡，卻也常常因此太替別人著想。",
        description: `
            你很會照顧人，也很懂得感受細微的情緒變化。<br>
            你喜歡讓身邊的人感到被理解、被接住，<br>
            但久了會發現：自己好像很少被好好照顧。<br>
            你值得的是「雙向的溫柔」，而不是只有單向付出。
        `,
        relationships: {
            partner: {
                plants: ["mint"],
                text: "他帶你往前，你提醒他停一下；你們的節奏剛好構成一種柔軟的互補。"
            },
            friend: {
                plants: ["lavender", "hinoki"],
                text: "一個懂你的敏感，一個給你安穩的依靠；和他們在一起，你不用偽裝堅強。"
            },
            enemy: {
                plants: ["peony"],
                text: "他太亮、太快、太強；而你太容易吸收情緒，久了只會覺得被拉扯。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["很會接住別人", "溫柔但有韌性", "也值得被照顧"],
            line: "暖居帶給人的感覺是柔軟而有溫度的，宛如你給人的感覺——總能把別人的情緒輕輕接住。而你最需要的，其實是有人也這樣接住你。"
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
                text: "你總是先看見別人。花綻像一朵為自己而開的花，提醒你：你本身就值得被欣賞。"
            }
        }
    },
    mint: {
        icon: "🍃",
        name: "薄荷葉型",
        tagline: "Active × Cool｜行動派的清醒製造機",
        coord: { x: 40, y: 30 },
        color: "#52c1a8",
        field: "光合啟動區 Vital Field",
        fieldDesc: "你現在站在偏高能量的位置，習慣用行動把生活推往前。",
        description: `
            你不喜歡停滯，也不太能忍受原地踏步。<br>
            一旦有方向，你就會很快行動、很快調整。<br>
            只是有時候，往前衝也會讓你忘記「自己其實已經累了」。<br>
            當你稍微慢下來，你會發現自己其實比想像中更敏感、更需要被理解。
        `,
        relationships: {
            partner: {
                plants: ["chamomile"],
                text: "你推，他柔；你衝，他接住你。兩人的能量剛剛好。"
            },
            friend: {
                plants: ["hinoki", "peony"],
                text: "檜木讓你不會過衝，牡丹讓你敢更衝；兩個方向你都玩得很開心。"
            },
            enemy: {
                plants: ["lavender"],
                text: "他想關機、你想開機——再怎麼努力，開關都對不到同一個頻率。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["行動派", "說走就走", "腦袋停不下來"],
            line: "暖居帶給人的感覺是明亮又有朝氣的，宛如你給人的感覺——走到哪裡，哪裡就跟著動起來。但你停下來的那一刻，比誰都需要一盞暖光。"
        },
        scent: {
            featured: "balance", // 主推訂閱的那一支（夜和／暖居）
            similar: {
                product: "sumi",
                name: "朝光 Sumi Dawn",
                text: "清爽明亮的氣味輪廓，很像你「說走就走」的動能。"
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
        tagline: "Active × Warm｜自帶舞台感的光芒型人格",
        coord: { x: 76, y: 28 },
        color: "#f29bb5",
        field: "熱烈綻放區 Radiance Field",
        fieldDesc: "你在情緒地圖上偏向高能量、偏溫暖的位置，自然就會成為大家注意的焦點。",
        description: `
            你對人生有畫面，也在意生活要有一點漂亮和氣勢。<br>
            你喜歡被看見、被肯定，卻也會在沒人懂你的時候突然跌到谷底。<br>
            情緒對你來說很真實，你愛、你喜歡、你失望，都非常明顯。<br>
            當你學會在發光的同時照顧自己，你會成為別人心中那個又耀眼又踏實的大人。
        `,
        relationships: {
            partner: {
                plants: ["lavender"],
                text: "你燦爛，他安靜；你外放，他內斂。偏偏就在這個反差裡，你們都覺得舒服。"
            },
            friend: {
                plants: ["cypress", "mint"],
                text: "扁柏穩住你、薄荷伴你一起衝；你在他們身邊永遠能做最真實的自己。"
            },
            enemy: {
                plants: ["chamomile"],
                text: "他太能感受，你太能表現；久了彼此都會覺得累，像兩條不同節奏的旋律。"
            }
        },
        persona: {
            // 分享圖「本命香」區：香氣給人的感覺＝你給人的感覺（外在印象）＋只有你知道的那一面（內在），引起共鳴
            traits: ["自帶光芒", "愛得很明顯", "活得有畫面"],
            line: "暖居帶給人的感覺是熱烈又溫暖的，宛如你給人的感覺——一出現，整個空間都亮了。而你的光，其實一直在等一個真正懂你的人。"
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
                text: "當你光開太強、心太累時，思慕胡桃木般的溫潤會把你接住，讓你安靜下來。"
            }
        }
    }
};
