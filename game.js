// Game State
const gameState = {
    player: {
        realm: '杂役弟子',
        spiritStones: 0,
        reputation: 0,
        cultivation: {
            internal: 0,
            external: 0,
            alchemy: 0,
            forging: 0
        },
        relationships: {
            daoCompanion: null,
            demonicCultivator: null,
            threeSages: null
        },
        inventory: [],
        currentEvent: null
    },
    gameData: {
        realms: [
            '杂役弟子', '外门弟子', '内门弟子', '核心弟子',
            '长老', '太上长老', '大乘期', '渡劫期', '仙人'
        ],
        events: {
            monthly: [
                {
                    id: 'escort_spirit_stones',
                    title: '护送灵石',
                    description: '宗门需要你护送一批灵石到其他门派。',
                    choices: [
                        {
                            text: '接受任务',
                            effect: () => {
                                const success = Math.random() > 0.3;
                                if (success) {
                                    gameState.player.spiritStones += 500;
                                    gameState.player.reputation += 100;
                                    return '护送成功！获得500灵石和100声望。';
                                } else {
                                    gameState.player.spiritStones -= 200;
                                    gameState.player.reputation -= 50;
                                    return '护送失败，损失200灵石和50声望。';
                                }
                            }
                        },
                        {
                            text: '拒绝任务',
                            effect: () => {
                                gameState.player.reputation -= 20;
                                return '拒绝任务，声望降低20点。';
                            }
                        }
                    ]
                },
                {
                    id: 'guardian_array',
                    title: '挑战护山大阵',
                    description: '宗门护山大阵需要测试，你被选中参与。',
                    choices: [
                        {
                            text: '参与挑战',
                            effect: () => {
                                const success = Math.random() > 0.4;
                                if (success) {
                                    gameState.player.cultivation.internal += 100;
                                    return '挑战成功！领悟了新的功法，内功修为提升100点。';
                                } else {
                                    gameState.player.cultivation.internal -= 50;
                                    return '挑战失败，受到重伤，内功修为降低50点。';
                                }
                            }
                        },
                        {
                            text: '婉拒挑战',
                            effect: () => {
                                gameState.player.reputation -= 30;
                                return '婉拒挑战，声望降低30点。';
                            }
                        }
                    ]
                }
            ]
        }
    }
};

// UI Elements
const storyText = document.getElementById('story-text');
const choicesContainer = document.getElementById('choices');
const realmDisplay = document.getElementById('realm');
const spiritStonesDisplay = document.getElementById('spirit-stones');
const reputationDisplay = document.getElementById('reputation');

// Game Functions
function updateUI() {
    realmDisplay.textContent = gameState.player.realm;
    spiritStonesDisplay.textContent = gameState.player.spiritStones;
    reputationDisplay.textContent = gameState.player.reputation;
}

function displayStory(text, choices = []) {
    storyText.textContent = text;
    choicesContainer.innerHTML = '';
    
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => {
            const result = choice.effect();
            displayStory(result);
        };
        choicesContainer.appendChild(button);
    });
}

function startGame() {
    const initialStory = `你是一名刚刚踏入修仙界的杂役弟子。这一天，你正在打扫宗门广场，突然听到一阵钟声响起。
这是宗门召集弟子的信号。你放下扫帚，快步向大殿走去...`;
    
    const initialChoices = [
        {
            text: '继续打扫，装作没听见',
            effect: () => {
                gameState.player.reputation -= 10;
                return '你选择继续打扫，但被路过的师兄发现。声望降低10点。';
            }
        },
        {
            text: '立即前往大殿',
            effect: () => {
                gameState.player.reputation += 10;
                return '你立即前往大殿，得到了长老的赞赏。声望提升10点。';
            }
        }
    ];
    
    displayStory(initialStory, initialChoices);
    updateUI();
}

// Event Listeners
document.getElementById('cultivation-btn').addEventListener('click', () => {
    // TODO: Implement cultivation system
    displayStory('修炼系统开发中...');
});

document.getElementById('inventory-btn').addEventListener('click', () => {
    // TODO: Implement inventory system
    displayStory('背包系统开发中...');
});

document.getElementById('relationships-btn').addEventListener('click', () => {
    // TODO: Implement relationships system
    displayStory('关系系统开发中...');
});

document.getElementById('save-btn').addEventListener('click', () => {
    // TODO: Implement save system
    displayStory('存档系统开发中...');
});

// Start the game
startGame(); 