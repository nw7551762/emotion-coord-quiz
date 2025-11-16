// 取得植物圖片路徑的輔助函式
export function getPlantImage(key) {
    return `images/${key}.png`;
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
        scent: {
            similar: {
                name: "夜和 Peaceful Night",
                text: "偏涼、偏安定的香氣座標，像夜裡那口真正吐出的長長嘆息。",
                link: "https://www.fami.tw/ml1UW"
            },
            balance: {
                name: "朝光 Light of Dawn",
                text: "當你想讓自己從過度安靜中稍微打開一點，朝光就像清晨的窗縫。",
                link: "https://www.fami.tw/ToICP"
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
        scent: {
            similar: {
                name: "夜和 Peaceful Night",
                text: "木質與草本的清冷軸線，和你對安穩的追求很像。",
                link: "https://www.fami.tw/ml1UW"
            },
            balance: {
                name: "暖居 Warm Place",
                text: "當世界顯得過於理性，暖居會幫你的生活加一盞小小黃光。",
                link: "https://www.fami.tw/cUMjj"
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
                text: "有默契、不需要多話的安定組合；你們都相信“慢，就是快”。"
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
        scent: {
            similar: {
                name: "暖居 Warm Place",
                text: "木質與柑橘的柔軟溫度，很像你心裡那種「慢慢也沒關係」的步調。",
                link: "https://www.fami.tw/cUMjj"
            },
            balance: {
                name: "朝光 Light of Dawn",
                text: "當你需要一點推力和新的方向感，朝光像清晨的第一束光。",
                link: "https://www.fami.tw/ToICP"
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
        scent: {
            similar: {
                name: "暖居 Warm Place",
                text: "像家一樣的溫度，會讓你覺得「我也可以被照顧」。",
                link: "https://www.fami.tw/cUMjj"
            },
            balance: {
                name: "夜和 Peaceful Night",
                text: "當你吸收了太多情緒，夜和會幫你慢慢把那些重量放下來。",
                link: "https://www.fami.tw/ml1UW"
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
        scent: {
            similar: {
                name: "朝光 Light of Dawn",
                text: "清爽明亮的氣味輪廓，很像你「說走就走」的動能。",
                link: "https://www.fami.tw/ToICP"
            },
            balance: {
                name: "暖居 Warm Place",
                text: "當你一直踩油門時，暖居會提醒你：有些路可以慢慢走。",
                link: "https://www.fami.tw/cUMjj"
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
        scent: {
            similar: {
                name: "朝光 Light of Dawn",
                text: "陽光感、存在感都很高，很像你想往外開展的那種狀態。",
                link: "https://www.fami.tw/ToICP"
            },
            balance: {
                name: "夜和 Peaceful Night",
                text: "當你光開太強、心太累時，夜和會把你安全送回夜裡的被窩。",
                link: "https://www.fami.tw/ml1UW"
            }
        }
    }
};
