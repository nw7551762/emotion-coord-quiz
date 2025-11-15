// 取得植物圖片路徑的輔助函式
export function getPlantImage(key) {
    const plantNameMap = {
        lavender: "薰衣草",
        cypress: "扁柏",
        hinoki: "檜木",
        chamomile: "洋甘菊",
        mint: "薄荷",
        peony: "牡丹"
    };
    return "images/" + plantNameMap[key] + ".jpg";
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
                plants: ["hinoki"],
                text: "穩重又不逼迫你表現的人，可以讓你卸下緊繃。"
            },
            friend: {
                plants: ["chamomile"],
                text: "懂得你的敏感，也願意在你身邊靜靜陪伴的人。"
            },
            enemy: {
                plants: ["peony"],
                text: "太外放、太熱烈的能量，容易讓你覺得被淹沒。"
            }
        },
        scent: {
            similar: {
                name: "夜和 Peaceful Night",
                text: "偏涼、偏安定的香氣座標，像夜裡那口真正吐出的長長嘆息。"
            },
            balance: {
                name: "朝光 Light of Dawn",
                text: "當你想讓自己從過度安靜中稍微打開一點，朝光就像清晨的窗縫。"
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
                plants: ["chamomile"],
                text: "讓你的世界不那麼冷，也多一點情緒和溫度。"
            },
            friend: {
                plants: ["lavender"],
                text: "你們都懂「一起安靜」的珍貴。"
            },
            enemy: {
                plants: ["peony"],
                text: "你覺得對方太戲劇化，對方覺得你太冷淡。"
            }
        },
        scent: {
            similar: {
                name: "夜和 Peaceful Night",
                text: "木質與草本的清冷軸線，和你對安穩的追求很像。"
            },
            balance: {
                name: "暖居 Warm Place",
                text: "當世界顯得過於理性，暖居會幫你的生活加一盞小小黃光。"
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
                plants: ["lavender"],
                text: "敏感又需要安全感的人，會在你身邊慢慢放鬆下來。"
            },
            friend: {
                plants: ["chamomile"],
                text: "你們都習慣照顧他人，也會默默照顧彼此。"
            },
            enemy: {
                plants: ["mint"],
                text: "對方總是想加速，而你只想穩穩地走，很容易節奏不合。"
            }
        },
        scent: {
            similar: {
                name: "暖居 Warm Place",
                text: "木質與柑橘的柔軟溫度，很像你心裡那種「慢慢也沒關係」的步調。"
            },
            balance: {
                name: "朝光 Light of Dawn",
                text: "當你需要一點推力和新的方向感，朝光像清晨的第一束光。"
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
                plants: ["cypress"],
                text: "不黏人、卻很穩的人，可以讓你在溫柔中也有底氣。"
            },
            friend: {
                plants: ["lavender"],
                text: "懂你敏感、也願意一起待在低噪音世界的人。"
            },
            enemy: {
                plants: ["mint"],
                text: "對方總說「別想太多」，但你就是會想很多。"
            }
        },
        scent: {
            similar: {
                name: "暖居 Warm Place",
                text: "像家一樣的溫度，會讓你覺得「我也可以被照顧」。"
            },
            balance: {
                name: "夜和 Peaceful Night",
                text: "當你吸收了太多情緒，夜和會幫你慢慢把那些重量放下來。"
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
                plants: ["hinoki"],
                text: "可以穩住你節奏的人，不會澆熄你的火，卻會拉住你一下。"
            },
            friend: {
                plants: ["peony"],
                text: "一起衝、一起玩的人，計畫一出來就馬上開搞。"
            },
            enemy: {
                plants: ["lavender"],
                text: "對方想關機，你想開機，頻率一但錯位就很難對話。"
            }
        },
        scent: {
            similar: {
                name: "朝光 Light of Dawn",
                text: "清爽明亮的氣味輪廓，很像你「說走就走」的動能。"
            },
            balance: {
                name: "暖居 Warm Place",
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
        field: "Radiance Field（高能量 × 溫潤）",
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
                text: "在你很吵的時候也不嫌吵，在你崩潰時會幫你把世界靜音的人。"
            },
            friend: {
                plants: ["mint"],
                text: "一起興奮、一起大笑、一起把企劃做到很瘋的人。"
            },
            enemy: {
                plants: ["cypress"],
                text: "你覺得對方太無感，對方覺得你太戲劇，很容易互看不順眼。"
            }
        },
        scent: {
            similar: {
                name: "朝光 Light of Dawn",
                text: "陽光感、存在感都很高，很像你想往外開展的那種狀態。"
            },
            balance: {
                name: "夜和 Peaceful Night",
                text: "當你光開太強、心太累時，夜和會把你安全送回夜裡的被窩。"
            }
        }
    }
};
