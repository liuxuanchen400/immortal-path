// Game State
const gameState = {
    player: {
        realm: '杂役弟子',
        spiritStones: 0,
        reputation: 0,
        gameTime: {
            year: 1,
            month: 1
        },
        cultivation: {
            internal: 0,
            external: 0,
            alchemy: 0,
            forging: 0,
            internalMax: 1000,
            externalMax: 1000
        },
        relationships: {
            daoCompanion: null,
            demonicCultivator: null,
            threeSages: null
        },
        inventory: {
            materials: [
                { id: 'lingcao', name: '灵草', count: 5, description: '常见的灵植，含有少量灵气' },
                { id: 'chiyanfruit', name: '赤炎果', count: 2, description: '火属性灵果，可提炼为丹药' },
                { id: 'tiemroot', name: '铁木根', count: 3, description: '坚韧的木材，适合炼体' },
                { id: 'shanpen', name: '山参', count: 2, description: '百年山参，提升体魄' }
            ],
            equipment: [],
            treasures: []
        },
        tribulations: {
            count: 0,
            successRate: 0
        },
        currentEvent: null
    },
    gameData: {
        realms: [
            '杂役弟子', '外门弟子', '内门弟子', '核心弟子',
            '长老', '太上长老', '大乘期', '渡劫期', '仙人'
        ],
        realmThresholds: [
            0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000
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
        },
        recipes: {
            alchemy: [
                {
                    id: 'energy-pill',
                    name: '聚气丹',
                    materials: [
                        { id: 'lingcao', count: 3 },
                        { id: 'chiyanfruit', count: 1 }
                    ],
                    effect: '使用后获得100点内功修为',
                    onCraft: () => {
                        addItemToInventory('energy-pill', '聚气丹', 1, '丹药', '使用后获得100点内功修为');
                        showNotification('成功炼制聚气丹！');
                        gameState.player.cultivation.alchemy += 10;
                        updatePlayerStats();
                    }
                },
                {
                    id: 'strength-pill',
                    name: '壮体丹',
                    materials: [
                        { id: 'tiemroot', count: 2 },
                        { id: 'shanpen', count: 2 }
                    ],
                    effect: '使用后获得100点体魄',
                    onCraft: () => {
                        addItemToInventory('strength-pill', '壮体丹', 1, '丹药', '使用后获得100点体魄');
                        showNotification('成功炼制壮体丹！');
                        gameState.player.cultivation.alchemy += 10;
                        updatePlayerStats();
                    }
                }
            ],
            forging: [
                {
                    id: 'spirit-sword',
                    name: '引灵剑',
                    materials: [
                        { id: 'jingties', count: 5 },
                        { id: 'lingyu', count: 2 },
                        { id: 'jianpei', count: 1 }
                    ],
                    effect: '战斗力+100，修炼效率+10%',
                    onCraft: null
                },
                {
                    id: 'spirit-orb',
                    name: '聚灵珠',
                    materials: [
                        { id: 'lingshi', count: 10 },
                        { id: 'crystal', count: 3 }
                    ],
                    effect: '储存灵气，可随时恢复灵力',
                    onCraft: null
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
const gameTimeDisplay = document.getElementById('game-time');

// Modals
const cultivationModal = document.getElementById('cultivation-modal');
const inventoryModal = document.getElementById('inventory-modal');
const relationshipsModal = document.getElementById('relationships-modal');
const saveModal = document.getElementById('save-modal');
const userProfileModal = document.getElementById('user-profile-modal');
const notification = document.getElementById('notification');

// Game Functions
function updateUI() {
    realmDisplay.textContent = gameState.player.realm;
    spiritStonesDisplay.textContent = gameState.player.spiritStones;
    reputationDisplay.textContent = gameState.player.reputation;
    gameTimeDisplay.textContent = `${gameState.player.gameTime.year}年${gameState.player.gameTime.month}月`;
    
    // Update cultivation progress
    updateCultivationUI();
    
    // Update inventory UI
    updateInventoryUI();
    
    // Update player stats
    updatePlayerStats();
}

function updateCultivationUI() {
    // Internal cultivation
    document.getElementById('internal-progress-value').textContent = 
        `${gameState.player.cultivation.internal}/${gameState.player.cultivation.internalMax}`;
    const internalWidth = (gameState.player.cultivation.internal / gameState.player.cultivation.internalMax) * 100;
    document.getElementById('internal-progress-bar').style.width = `${internalWidth}%`;
    
    // External cultivation
    document.getElementById('external-progress-value').textContent = 
        `${gameState.player.cultivation.external}/${gameState.player.cultivation.externalMax}`;
    const externalWidth = (gameState.player.cultivation.external / gameState.player.cultivation.externalMax) * 100;
    document.getElementById('external-progress-bar').style.width = `${externalWidth}%`;
    
    // Check if breakthrough is possible
    const breakthroughBtn = document.getElementById('breakthrough-btn');
    if (gameState.player.cultivation.internal >= gameState.player.cultivation.internalMax) {
        breakthroughBtn.disabled = false;
    } else {
        breakthroughBtn.disabled = true;
    }
}

function updateInventoryUI() {
    // Update materials
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = '';
    
    gameState.player.inventory.materials.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="item-image">🌿</div>
            <div class="item-name">${item.name}</div>
            <div class="item-count">x${item.count}</div>
        `;
        itemElement.addEventListener('click', () => {
            showNotification(`${item.name}: ${item.description}`);
        });
        itemsContainer.appendChild(itemElement);
    });
    
    // If inventory is empty, show message
    if (gameState.player.inventory.materials.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = '暂无物品';
        itemsContainer.appendChild(emptyMessage);
    }
    
    // Update equipment
    const equipmentContainer = document.getElementById('equipment-container');
    equipmentContainer.innerHTML = '';
    
    if (gameState.player.inventory.equipment.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = '暂无装备';
        equipmentContainer.appendChild(emptyMessage);
    }
    
    // Update treasures
    const treasuresContainer = document.getElementById('treasures-container');
    treasuresContainer.innerHTML = '';
    
    if (gameState.player.inventory.treasures.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = '暂无珍宝';
        treasuresContainer.appendChild(emptyMessage);
    }
}

function updatePlayerStats() {
    document.getElementById('stat-internal').textContent = gameState.player.cultivation.internal;
    document.getElementById('stat-external').textContent = gameState.player.cultivation.external;
    document.getElementById('stat-alchemy').textContent = gameState.player.cultivation.alchemy;
    document.getElementById('stat-forging').textContent = gameState.player.cultivation.forging;
    document.getElementById('stat-tribulations').textContent = gameState.player.tribulations.count;
    document.getElementById('stat-success-rate').textContent = `${gameState.player.tribulations.successRate}%`;
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
            updateUI();
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
    
    // Set up event listeners
    initializeEventListeners();
}

function initializeEventListeners() {
    // Modal event listeners
    document.getElementById('cultivation-btn').addEventListener('click', () => {
        openModal(cultivationModal);
    });
    
    document.getElementById('inventory-btn').addEventListener('click', () => {
        openModal(inventoryModal);
    });
    
    document.getElementById('relationships-btn').addEventListener('click', () => {
        openModal(relationshipsModal);
    });
    
    document.getElementById('save-btn').addEventListener('click', () => {
        openModal(saveModal);
    });
    
    document.querySelector('.user-profile').addEventListener('click', () => {
        openModal(userProfileModal);
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            const tabContent = e.target.closest('.modal-content').querySelector(`#${tabName}-tab`);
            
            // Hide all tab contents
            e.target.closest('.modal-content').querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Deactivate all tab buttons
            e.target.closest('.tab-buttons').querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activate the selected tab
            tabContent.classList.add('active');
            e.target.classList.add('active');
        });
    });
    
    // Cultivation actions
    document.getElementById('meditate-btn').addEventListener('click', () => {
        cultivate('internal', 10, 0);
    });
    
    document.getElementById('spirit-btn').addEventListener('click', () => {
        if (gameState.player.spiritStones >= 100) {
            cultivate('internal', 50, 100);
        } else {
            showNotification('灵石不足!');
        }
    });
    
    document.getElementById('practice-btn').addEventListener('click', () => {
        cultivate('external', 10, 0);
    });
    
    document.getElementById('advanced-btn').addEventListener('click', () => {
        if (gameState.player.spiritStones >= 100) {
            cultivate('external', 50, 100);
        } else {
            showNotification('灵石不足!');
        }
    });
    
    document.getElementById('breakthrough-btn').addEventListener('click', () => {
        attemptBreakthrough();
    });
    
    // Craft buttons
    document.querySelectorAll('.craft-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeId = e.target.dataset.recipe;
            craftItem(recipeId);
        });
    });
}

function openModal(modal) {
    closeAllModals();
    modal.style.display = 'flex';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function cultivate(type, amount, cost) {
    if (gameState.player.spiritStones < cost) {
        showNotification('灵石不足!');
        return;
    }
    
    gameState.player.spiritStones -= cost;
    
    if (type === 'internal') {
        gameState.player.cultivation.internal += amount;
        showNotification(`内功修为提升了${amount}点!`);
    } else if (type === 'external') {
        gameState.player.cultivation.external += amount;
        showNotification(`体魄强度提升了${amount}点!`);
    }
    
    updateUI();
}

function attemptBreakthrough() {
    const currentRealmIndex = gameState.gameData.realms.indexOf(gameState.player.realm);
    
    if (currentRealmIndex < gameState.gameData.realms.length - 1) {
        const successRate = calculateBreakthroughSuccessRate();
        const success = Math.random() < successRate;
        
        if (success) {
            const newRealm = gameState.gameData.realms[currentRealmIndex + 1];
            gameState.player.realm = newRealm;
            
            // Reset cultivation and increase max
            gameState.player.cultivation.internal = 0;
            gameState.player.cultivation.internalMax = Math.floor(gameState.player.cultivation.internalMax * 1.5);
            
            // Increase tribulations count and success rate
            gameState.player.tribulations.count++;
            gameState.player.tribulations.successRate = Math.floor((gameState.player.tribulations.count / (currentRealmIndex + 1)) * 100);
            
            showNotification(`突破成功！你已晋升为${newRealm}！`);
        } else {
            // Failed breakthrough
            gameState.player.cultivation.internal = Math.floor(gameState.player.cultivation.internal * 0.7);
            showNotification('突破失败！修为受损，内功降低30%。');
        }
        
        updateUI();
    }
}

function calculateBreakthroughSuccessRate() {
    const baseRate = 0.6;
    const externalBonus = gameState.player.cultivation.external / gameState.player.cultivation.externalMax * 0.3;
    
    return baseRate + externalBonus;
}

function craftItem(recipeId) {
    // Find the recipe
    let recipe;
    for (const alchemyRecipe of gameState.gameData.recipes.alchemy) {
        if (alchemyRecipe.id === recipeId) {
            recipe = alchemyRecipe;
            break;
        }
    }
    
    if (!recipe) {
        for (const forgingRecipe of gameState.gameData.recipes.forging) {
            if (forgingRecipe.id === recipeId) {
                recipe = forgingRecipe;
                break;
            }
        }
    }
    
    if (!recipe) {
        showNotification('找不到配方!');
        return;
    }
    
    // Check if player has required materials
    const hasMaterials = checkMaterials(recipe.materials);
    
    if (hasMaterials) {
        // Consume materials
        consumeMaterials(recipe.materials);
        
        // Execute craft effect
        if (recipe.onCraft) {
            recipe.onCraft();
        } else {
            showNotification('尚未实现的配方效果');
        }
    } else {
        showNotification('材料不足!');
    }
}

function checkMaterials(requiredMaterials) {
    for (const required of requiredMaterials) {
        let found = false;
        
        for (const material of gameState.player.inventory.materials) {
            if (material.id === required.id && material.count >= required.count) {
                found = true;
                break;
            }
        }
        
        if (!found) {
            return false;
        }
    }
    
    return true;
}

function consumeMaterials(requiredMaterials) {
    for (const required of requiredMaterials) {
        for (let i = 0; i < gameState.player.inventory.materials.length; i++) {
            const material = gameState.player.inventory.materials[i];
            
            if (material.id === required.id) {
                material.count -= required.count;
                
                if (material.count <= 0) {
                    gameState.player.inventory.materials.splice(i, 1);
                }
                
                break;
            }
        }
    }
    
    updateInventoryUI();
}

function addItemToInventory(id, name, count, type, description) {
    const targetInventory = type === '丹药' ? 'materials' : type === '装备' ? 'equipment' : 'treasures';
    
    let found = false;
    for (const item of gameState.player.inventory[targetInventory]) {
        if (item.id === id) {
            item.count += count;
            found = true;
            break;
        }
    }
    
    if (!found) {
        gameState.player.inventory[targetInventory].push({
            id,
            name,
            count,
            description
        });
    }
    
    updateInventoryUI();
}

function showNotification(message) {
    const notificationElement = document.getElementById('notification');
    notificationElement.querySelector('.notification-content').textContent = message;
    
    notificationElement.classList.add('show');
    
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 3000);
}

// Game initialization
document.addEventListener('DOMContentLoaded', () => {
    startGame();
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
});

// Start the game
startGame(); 