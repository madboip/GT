/**
 * Battle Module (Phase 5)
 * ระบบต่อสู้แบบมีระบบธาตุ, พื้นหลังตามโซน, และคำนวณดาเมจ
 */

// ฐานข้อมูลศัตรูพร้อมระบบธาตุ
const enemiesDB = {
    "Goblin": { hp: 50, atk: 12, element: "Normal", icon: "👹" },
    "Shadow Rat": { hp: 40, atk: 15, element: "Shadow", icon: "🐀" },
    "Goblin Chieftain": { hp: 120, atk: 18, element: "Normal", icon: "👺" },
    
    "Forest Wolf": { hp: 80, atk: 20, element: "Normal", icon: "🐺" },
    "Cursed Treant": { hp: 150, atk: 15, element: "Ice", icon: "🌳" },
    "Ancient Treant": { hp: 300, atk: 25, element: "Ice", icon: "🌲" },
    
    "Skeleton Warrior": { hp: 100, atk: 25, element: "Normal", icon: "💀" },
    "Dark Mage": { hp: 90, atk: 35, element: "Shadow", icon: "🧙‍♂️" },
    "Bone King": { hp: 400, atk: 35, element: "Shadow", icon: "👑" },
    
    "Flame Beast": { hp: 200, atk: 40, element: "Fire", icon: "🐅" },
    "Ash Golem": { hp: 350, atk: 20, element: "Fire", icon: "🪨" },
    "Inferno Beast": { hp: 600, atk: 50, element: "Fire", icon: "🌋" },
    
    "Demon Knight": { hp: 300, atk: 55, element: "Shadow", icon: "🧛" },
    "Vampire Lord": { hp: 250, atk: 65, element: "Shadow", icon: "🦇" },
    "Demon Lord": { hp: 800, atk: 70, element: "Shadow", icon: "👿" },
    
    "Abyss Spawn": { hp: 400, atk: 80, element: "Shadow", icon: "👾" },
    "Void Walker": { hp: 500, atk: 85, element: "Shadow", icon: "👻" },
    "THE FALLEN KING": { hp: 1500, atk: 100, element: "Shadow", icon: "☠️" }
};

let currentEnemy = null;
let currentZone = null;
let isPlayerTurn = true;
let isBattleOver = false;

// ตารางแพ้ทางชนะทาง (Attacker Element -> Defender Element)
const elementChart = {
    "Fire": { strongAgainst: "Ice", weakAgainst: "Lightning" },
    "Ice": { strongAgainst: "Lightning", weakAgainst: "Fire" },
    "Lightning": { strongAgainst: "Fire", weakAgainst: "Ice" },
    "Light": { strongAgainst: "Shadow", weakAgainst: "" },
    "Shadow": { strongAgainst: "Light", weakAgainst: "" }
};

function initBattle(zone) {
    currentZone = zone;
    isBattleOver = false;
    isPlayerTurn = true;
    gameState.player.isDefending = false;
    
    // รีเซ็ตการแสดงผล
    document.getElementById('battle-log').innerHTML = '';
    
    // เปลี่ยนสีพื้นหลังตาม Zone
    const battleView = document.getElementById('view-battle');
    battleView.className = "view-section flex-1 flex-col transition-colors duration-1000 p-4"; // Reset
    if(zone.id === 'zone_forest') battleView.classList.add('bg-emerald-950');
    else if(zone.id === 'zone_ruins') battleView.classList.add('bg-slate-900');
    else if(zone.id === 'zone_valley') battleView.classList.add('bg-red-950');
    else if(zone.id === 'zone_castle' || zone.id === 'zone_abyss') battleView.classList.add('bg-purple-950');
    else battleView.classList.add('bg-slate-950');

    // สุ่มมอนสเตอร์ หรือ สู้บอส
    const isBossBattle = Math.random() < 0.2; // โอกาสเจอบอส 20%
    const enemyName = isBossBattle ? zone.boss : zone.enemies[Math.floor(Math.random() * zone.enemies.length)];
    const enemyData = enemiesDB[enemyName] || { hp: 50, atk: 10, element: "Normal", icon: "👹" };
    
    // สร้าง Object ศัตรูปัจจุบัน
    currentEnemy = {
        name: enemyName,
        maxHp: enemyData.hp,
        hp: enemyData.hp,
        atk: enemyData.atk,
        element: enemyData.element,
        icon: enemyData.icon,
        isBoss: isBossBattle
    };

    // อัปเดต UI ตอนเริ่ม
    document.getElementById('battle-zone-name').textContent = zone.name;
    document.getElementById('battle-enemy-name').textContent = currentEnemy.name;
    document.getElementById('battle-enemy-avatar').textContent = currentEnemy.icon;
    
    const elBadge = document.getElementById('battle-enemy-element');
    elBadge.textContent = currentEnemy.element;
    if(currentEnemy.element === 'Fire') elBadge.className = "text-xs px-2 py-1 rounded font-bold uppercase bg-red-900 text-red-200";
    else if(currentEnemy.element === 'Ice') elBadge.className = "text-xs px-2 py-1 rounded font-bold uppercase bg-blue-900 text-blue-200";
    else if(currentEnemy.element === 'Lightning') elBadge.className = "text-xs px-2 py-1 rounded font-bold uppercase bg-yellow-900 text-yellow-200";
    else if(currentEnemy.element === 'Shadow') elBadge.className = "text-xs px-2 py-1 rounded font-bold uppercase bg-purple-900 text-purple-200";
    else elBadge.className = "text-xs px-2 py-1 rounded font-bold uppercase bg-slate-800 text-slate-400";

    bLog(`⚠️ <b>${currentEnemy.name}</b> ปรากฏตัว!`);
    updateBattleUI();
    setTurn(true);
    navigateTo('view-battle');
}

function updateBattleUI() {
    // Player
    const p = gameState.player;
    document.getElementById('battle-player-name').textContent = p.name;
    document.getElementById('battle-player-hp-txt').textContent = `${Math.ceil(p.hp)}/${p.maxHp}`;
    document.getElementById('battle-player-hp').style.width = `${Math.max(0, (p.hp/p.maxHp)*100)}%`;
    
    document.getElementById('battle-player-en-txt').textContent = `${Math.floor(p.energy)}/${p.maxEnergy}`;
    document.getElementById('battle-player-en').style.width = `${Math.min(100, (p.energy/p.maxEnergy)*100)}%`;
    
    document.getElementById('b-heal-count').textContent = `(${p.healCount})`;

    // Enemy
    document.getElementById('battle-enemy-hp-txt').textContent = `${Math.ceil(currentEnemy.hp)}/${currentEnemy.maxHp}`;
    document.getElementById('battle-enemy-hp').style.width = `${Math.max(0, (currentEnemy.hp/currentEnemy.maxHp)*100)}%`;

    // Buttons
    const disabled = !isPlayerTurn || isBattleOver;
    document.getElementById('b-atk').disabled = disabled;
    document.getElementById('b-sk1').disabled = disabled || p.energy < 30; // Shadow Slash
    document.getElementById('b-sk2').disabled = disabled || p.energy < 50; // Thunder Break
    document.getElementById('b-def').disabled = disabled;
    document.getElementById('b-heal').disabled = disabled || p.healCount <= 0 || p.hp >= p.maxHp;
    document.getElementById('b-ult').disabled = disabled || p.energy < 100;
}

function setTurn(isPlayer) {
    if(isBattleOver) return;
    isPlayerTurn = isPlayer;
    const ind = document.getElementById('battle-turn-indicator');
    
    if (isPlayer) {
        ind.textContent = "YOUR TURN";
        ind.className = "text-xl font-black tracking-widest text-cyan-500 uppercase transition-colors";
        gameState.player.isDefending = false;
    } else {
        ind.textContent = "ENEMY TURN";
        ind.className = "text-xl font-black tracking-widest text-red-500 uppercase transition-colors";
        setTimeout(enemyAction, 1200); // หน่วงเวลาให้ศัตรูตี
    }
    updateBattleUI();
}

// คำนวณความเสียหายและธาตุ
function calculateDamage(baseAtk, elementStr) {
    let multiplier = 1.0;
    let effectText = "";
    
    const defElement = currentEnemy.element;
    if (elementChart[elementStr]) {
        if (elementChart[elementStr].strongAgainst === defElement) {
            multiplier = 1.5;
            effectText = "SUPER EFFECTIVE!";
        } else if (elementChart[elementStr].weakAgainst === defElement) {
            multiplier = 0.75;
            effectText = "RESISTED!";
        }
    }
    
    const rawDmg = Math.max(1, baseAtk * multiplier);
    const varDmg = Math.floor(rawDmg * 0.15);
    const finalDmg = Math.floor(rawDmg + (Math.floor(Math.random() * (varDmg * 2 + 1)) - varDmg));
    
    return { damage: finalDmg, effect: effectText };
}

function executeAction(type) {
    if (!isPlayerTurn || isBattleOver) return;
    
    const p = gameState.player;
    const stats = getPlayerStats(); // ดึงพลังโจมตีจาก state.js
    let dmgObj = { damage: 0, effect: "" };
    let logStr = "";

    if (type === 'attack') {
        dmgObj = calculateDamage(stats.attack, "Normal");
        logStr = `⚔️ โจมตีปกติ ทำความเสียหาย ${dmgObj.damage}`;
        p.energy += 15;
    } 
    else if (type === 'skill1') {
        p.energy -= 30;
        dmgObj = calculateDamage(stats.attack * 1.8, "Shadow");
        logStr = `🌑 <b>Shadow Slash</b> ทำความเสียหาย ${dmgObj.damage}`;
    }
    else if (type === 'skill2') {
        p.energy -= 50;
        dmgObj = calculateDamage(stats.attack * 2.2, "Lightning");
        logStr = `⚡ <b>Thunder Break</b> ทำความเสียหาย ${dmgObj.damage}`;
    }
    else if (type === 'ultimate') {
        p.energy -= 100;
        dmgObj = calculateDamage(stats.attack * 3, "Light"); // ไม้ตายธาตุแสงแก้ทางบอสส่วนใหญ่
        logStr = `✨ <b>ULTIMATE BLAST!</b> ทำความเสียหาย ${dmgObj.damage}`;
        animateCenterText("ULTIMATE!", "text-yellow-400");
    }
    else if (type === 'defend') {
        p.isDefending = true;
        p.energy += 10;
        logStr = `🛡️ ป้องกัน! ลดดาเมจเทิร์นถัดไป 50%`;
        animateCenterText("DEFEND", "text-slate-400");
    }
    else if (type === 'heal') {
        p.healCount--;
        const healAmt = 40;
        p.hp = Math.min(p.maxHp, p.hp + healAmt);
        logStr = `❤️ ฟื้นฟูพลังชีวิต ${healAmt} HP`;
        showPopup('battle-player-avatar', `+${healAmt}`, 'text-green-400');
    }

    if (dmgObj.damage > 0) {
        currentEnemy.hp -= dmgObj.damage;
        showPopup('battle-enemy-avatar', `-${dmgObj.damage}`, 'text-red-500');
        shakeAvatar('battle-enemy-avatar');
        
        if (dmgObj.effect) {
            logStr += ` <span class="text-xs text-yellow-400">(${dmgObj.effect})</span>`;
            animateCenterText(dmgObj.effect, dmgObj.effect.includes("SUPER") ? "text-green-400" : "text-slate-400");
        }
    }

    bLog(logStr);
    checkWinLose();
    if (!isBattleOver) setTurn(false);
}

function enemyAction() {
    if (isBattleOver) return;
    const p = gameState.player;
    
    // คำนวณดาเมจศัตรู
    let eDmg = Math.max(1, currentEnemy.atk - p.baseDef);
    let logStr = `👹 ${currentEnemy.name} โจมตี!`;

    if (p.isDefending) {
        eDmg = Math.floor(eDmg * 0.5);
        logStr += ` (ป้องกันได้ รับความเสียหาย ${eDmg})`;
        animateCenterText("BLOCKED", "text-slate-400");
    } else {
        logStr += ` โดนความเสียหาย ${eDmg}`;
    }

    p.hp -= eDmg;
    showPopup('battle-player-avatar', `-${eDmg}`, 'text-red-500');
    shakeAvatar('battle-player-avatar');
    
    bLog(logStr);
    checkWinLose();
    if (!isBattleOver) setTurn(true);
}

function checkWinLose() {
    if (currentEnemy.hp <= 0) {
        currentEnemy.hp = 0;
        isBattleOver = true;
        updateBattleUI();
        setTimeout(() => showResult(true), 1000);
    } else if (gameState.player.hp <= 0) {
        gameState.player.hp = 0;
        isBattleOver = true;
        updateBattleUI();
        setTimeout(() => showResult(false), 1000);
    } else {
        updateBattleUI();
    }
}

function showResult(isWin) {
    const modal = document.getElementById('modal-battle-result');
    const title = document.getElementById('br-title');
    const desc = document.getElementById('br-desc');
    const rewards = document.getElementById('br-rewards');
    
    if (isWin) {
        modal.classList.replace('border-red-600', 'border-emerald-500');
        title.textContent = "VICTORY";
        title.className = "text-3xl font-black mb-2 tracking-widest uppercase text-emerald-500";
        desc.textContent = `คุณเอาชนะ ${currentEnemy.name} ได้สำเร็จ!`;
        
        // สุ่มของรางวัล
        const gainExp = currentEnemy.isBoss ? 150 : 50;
        const gainGold = currentEnemy.isBoss ? 100 : 25;
        
        gameState.player.exp += gainExp;
        gameState.player.gold += gainGold;
        
        document.getElementById('br-gold').textContent = gainGold;
        document.getElementById('br-exp').textContent = gainExp;
        rewards.classList.remove('hidden');
    } else {
        modal.classList.replace('border-emerald-500', 'border-red-600');
        title.textContent = "DEFEAT";
        title.className = "text-3xl font-black mb-2 tracking-widest uppercase text-red-500";
        desc.textContent = `คุณถูก ${currentEnemy.name} สังหาร... กลับไปยังเมืองเพื่อฟื้นฟู`;
        rewards.classList.add('hidden');
        
        // หักเงินนิดหน่อยเมื่อแพ้
        gameState.player.gold = Math.max(0, gameState.player.gold - 20);
        gameState.player.hp = gameState.player.maxHp; // ฮีลฟรีเมื่อแพ้
    }
    
    updateNavUI();
    modal.showModal();
}

function endCombat() {
    document.getElementById('modal-battle-result').close();
    
    // ตรวจสอบ Level Up อย่างง่าย
    if (gameState.player.exp >= gameState.player.maxExp) {
        gameState.player.level++;
        gameState.player.exp -= gameState.player.maxExp;
        gameState.player.maxExp = Math.floor(gameState.player.maxExp * 1.5);
        gameState.player.baseAtk += 2;
        gameState.player.maxHp += 10;
        gameState.player.hp = gameState.player.maxHp;
        alert(`🎉 LEVEL UP! ตอนนี้คุณคือ Level ${gameState.player.level}`);
        updateNavUI();
    }
    
    // กลับหน้าแผนที่
    navigateTo('view-world');
}

// === Utility Functions สำหรับ Battle ===
function bLog(msg) {
    const p = document.createElement('p');
    p.innerHTML = msg;
    const logBox = document.getElementById('battle-log');
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

function animateCenterText(text, colorClass) {
    const el = document.getElementById('battle-center-text');
    el.textContent = text;
    el.className = `absolute font-black text-3xl pointer-events-none transition-all duration-300 drop-shadow-md z-10 ${colorClass}`;
    el.style.opacity = '1';
    el.style.transform = 'scale(1.2) translateY(-10px)';
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'scale(1) translateY(0)';
    }, 1000);
}

function shakeAvatar(id) {
    const el = document.getElementById(id);
    el.classList.remove('animate-shake');
    void el.offsetWidth;
    el.classList.add('animate-shake');
}

function showPopup(targetId, text, colorClass) {
    const container = document.getElementById(targetId);
    const el = document.createElement('div');
    el.className = `damage-popup text-2xl ${colorClass}`;
    el.textContent = text;
    
    const rx = (Math.random() - 0.5) * 40;
    el.style.left = `calc(50% + ${rx}px)`;
    el.style.top = '10px';
    
    container.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}