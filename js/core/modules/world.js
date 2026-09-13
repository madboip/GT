/**
 * World Map Module
 * จัดการแผนที่โลก การปลดล็อกพื้นที่ และ Random Events ก่อนเข้าสู่ Battle
 */

const worldZones = [
    {
        id: "zone_village",
        name: "Shadow Village",
        icon: "🏠",
        reqLevel: 1,
        desc: "หมู่บ้านที่ถูกทิ้งร้าง จุดเริ่มต้นของการผจญภัย",
        enemies: ["Goblin", "Shadow Rat"],
        boss: "Goblin Chieftain"
    },
    {
        id: "zone_forest",
        name: "Whispering Forest",
        icon: "🌲",
        reqLevel: 5,
        desc: "ป่าที่เต็มไปด้วยเสียงกระซิบของวิญญาณร้าย",
        enemies: ["Forest Wolf", "Cursed Treant"],
        boss: "Ancient Treant"
    },
    {
        id: "zone_ruins",
        name: "Abandoned Ruins",
        icon: "🏚️",
        reqLevel: 10,
        desc: "ซากปรักหักพังของอาณาจักรโบราณ",
        enemies: ["Skeleton Warrior", "Dark Mage"],
        boss: "Bone King"
    },
    {
        id: "zone_valley",
        name: "Ashen Valley",
        icon: "🌋",
        reqLevel: 15,
        desc: "หุบเขาเถ้าถ่านที่เต็มไปด้วยความร้อนทุรนทุราย",
        enemies: ["Flame Beast", "Ash Golem"],
        boss: "Inferno Beast"
    },
    {
        id: "zone_castle",
        name: "Shadow Castle",
        icon: "🏰",
        reqLevel: 20,
        desc: "ปราสาทของจอมมารที่ปกคลุมด้วยความมืด",
        enemies: ["Demon Knight", "Vampire Lord"],
        boss: "Demon Lord"
    },
    {
        id: "zone_abyss",
        name: "Abyss Gate",
        icon: "👿",
        reqLevel: 25,
        desc: "ประตูมิติสู่ความว่างเปล่าสุดหยั่งรู้",
        enemies: ["Abyss Spawn", "Void Walker"],
        boss: "THE FALLEN KING"
    }
];

let selectedZoneId = null;

function renderWorld() {
    const container = document.getElementById('zones-container');
    container.innerHTML = '';
    
    worldZones.forEach(zone => {
        const isUnlocked = gameState.player.level >= zone.reqLevel;
        
        const btn = document.createElement('button');
        btn.id = `btn-zone-${zone.id}`;
        
        // กำหนดสไตล์ปุ่มตามสถานะ Lock/Unlock
        if (isUnlocked) {
            btn.className = "w-full text-left bg-slate-900 border border-slate-700 hover:border-cyan-500 p-4 rounded-lg flex items-center gap-4 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 group";
            btn.onclick = () => selectZone(zone.id);
            btn.innerHTML = `
                <div class="text-3xl bg-slate-800 p-3 rounded-lg border border-slate-700 group-hover:scale-110 transition-transform">${zone.icon}</div>
                <div class="flex-1">
                    <h4 class="text-lg font-black text-slate-200 uppercase tracking-widest">${zone.name}</h4>
                    <span class="text-xs font-bold text-emerald-500">✔ Unlocked</span>
                </div>
            `;
        } else {
            btn.className = "w-full text-left bg-slate-950 border border-slate-800 p-4 rounded-lg flex items-center gap-4 opacity-50 cursor-not-allowed";
            btn.innerHTML = `
                <div class="text-3xl bg-slate-900 p-3 rounded-lg border border-slate-800 grayscale">${zone.icon}</div>
                <div class="flex-1">
                    <h4 class="text-lg font-black text-slate-500 uppercase tracking-widest">${zone.name}</h4>
                    <span class="text-xs font-bold text-red-500">🔒 Requires Level ${zone.reqLevel}</span>
                </div>
            `;
        }
        
        container.appendChild(btn);
    });
}

function selectZone(id) {
    selectedZoneId = id;
    const zone = worldZones.find(z => z.id === id);
    
    // ไฮไลต์โซนที่เลือก
    document.querySelectorAll('[id^="btn-zone-"]').forEach(btn => {
        if (!btn.classList.contains('cursor-not-allowed')) {
            btn.classList.remove('border-cyan-500', 'bg-slate-800');
            btn.classList.add('border-slate-700', 'bg-slate-900');
        }
    });
    const activeBtn = document.getElementById(`btn-zone-${id}`);
    activeBtn.classList.remove('border-slate-700', 'bg-slate-900');
    activeBtn.classList.add('border-cyan-500', 'bg-slate-800');

    // อัปเดตข้อมูลโซน
    document.getElementById('zone-details-empty').classList.add('hidden');
    document.getElementById('zone-details-content').classList.remove('hidden');
    document.getElementById('zone-details-content').classList.add('flex');
    
    document.getElementById('zone-detail-name').textContent = `${zone.icon} ${zone.name}`;
    document.getElementById('zone-detail-desc').textContent = zone.desc;
    document.getElementById('zone-detail-level').textContent = `Lv. ${zone.reqLevel}`;
    document.getElementById('zone-detail-enemies').textContent = zone.enemies.join(', ');
    document.getElementById('zone-detail-boss').textContent = zone.boss;
    
    const enterBtn = document.getElementById('btn-enter-zone');
    enterBtn.onclick = () => triggerZoneEntry(zone);
}

function triggerZoneEntry(zone) {
    gameState.progress.currentZone = zone.name;
    
    // สุ่มความน่าจะเป็น 30% เจอ Event, 70% เข้า Battle ทันที
    const roll = Math.random();
    if (roll < 0.3) {
        showRandomEvent(zone);
    } else {
        startCombatPhase(zone);
    }
}

// ==========================================
// RANDOM EVENT SYSTEM
// ==========================================
const randomEvents = [
    {
        title: "Mysterious Chest",
        icon: "💎",
        desc: "คุณพบหีบสมบัติเก่าๆ ซ่อนอยู่ใต้กองใบไม้...",
        actions: [
            { label: "Open it", type: "loot", color: "bg-cyan-600 hover:bg-cyan-500 border-cyan-500" },
            { label: "Ignore", type: "leave", color: "bg-slate-700 hover:bg-slate-600 border-slate-600" }
        ]
    },
    {
        title: "Lost Traveler",
        icon: "👤",
        desc: "ชายลึกลับในผ้าคลุมเสนอขายน้ำยาฟื้นพลัง...",
        actions: [
            { label: "Trade (50 Gold)", type: "trade_heal", color: "bg-emerald-600 hover:bg-emerald-500 border-emerald-500" },
            { label: "Walk away", type: "leave", color: "bg-slate-700 hover:bg-slate-600 border-slate-600" }
        ]
    }
];

function showRandomEvent(zone) {
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    const modal = document.getElementById('modal-event');
    
    document.getElementById('event-icon').textContent = event.icon;
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-desc').textContent = event.desc;
    
    const actionContainer = document.getElementById('event-actions');
    actionContainer.innerHTML = '';
    
    event.actions.forEach(act => {
        const btn = document.createElement('button');
        btn.className = `w-full py-3 px-4 ${act.color} text-white font-bold tracking-widest uppercase rounded border shadow-lg transition-all active:scale-95`;
        btn.textContent = act.label;
        btn.onclick = () => handleEventAction(act.type, modal, zone);
        actionContainer.appendChild(btn);
    });
    
    modal.showModal();
}

function handleEventAction(actionType, modal, zone) {
    modal.close();
    
    if (actionType === 'loot') {
        // โอกาส 70% ได้เงิน, 30% เป็นกับดัก
        if (Math.random() < 0.7) {
            const goldFound = Math.floor(Math.random() * 50) + 10;
            gameState.player.gold += goldFound;
            updateNavUI();
            alert(`🎉 ได้รับ ${goldFound} Gold!`);
        } else {
            const dmg = Math.floor(gameState.player.maxHp * 0.1);
            gameState.player.hp = Math.max(1, gameState.player.hp - dmg);
            alert(`💀 หีบติดกับดัก! โดนความเสียหาย ${dmg} HP`);
        }
        startCombatPhase(zone);
    } 
    else if (actionType === 'trade_heal') {
        if (gameState.player.gold >= 50) {
            gameState.player.gold -= 50;
            gameState.player.hp = gameState.player.maxHp;
            updateNavUI();
            alert("❤️ ฟื้นฟู HP จนเต็ม!");
        } else {
            alert("❌ Gold ไม่พอ!");
        }
        startCombatPhase(zone);
    }
    else if (actionType === 'leave') {
        startCombatPhase(zone);
    }
}

// แก้ไขฟังก์ชันนี้ใน js/modules/world.js ให้เป็นแบบนี้
function startCombatPhase(zone) {
    if (typeof initBattle === 'function') {
        initBattle(zone);
    } else {
        console.error("battle.js is not loaded!");
    }
}

// อัปเดตฟังก์ชัน confirmCharacter (ใน character.js) ให้เรียก renderWorld()
// navigateTo('view-world'); 
// setTimeout(renderWorld, 100);