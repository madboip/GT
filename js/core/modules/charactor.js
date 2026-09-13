/**
 * Character Creation Module
 * จัดการหน้าสร้างตัวละคร เลือก Class และกำหนด Stats เริ่มต้น
 */

const classData = {
    "shadow_knight": {
        id: "shadow_knight",
        name: "Shadow Knight",
        icon: "🥷",
        color: "text-cyan-400",
        border: "border-cyan-500",
        desc: "นักรบสมดุล พลังป้องกันสูงและโจมตีต่อเนื่อง",
        hp: 120,
        energy: 100,
        atk: 15,
        def: 8,
        crit: 5,
        passive: "Guardian's Will (+10% DEF)",
        startSkill: "Shadow Slash",
        startWeapon: "Iron Sword"
    },
    "arcane_hunter": {
        id: "arcane_hunter",
        name: "Arcane Hunter",
        icon: "🏹",
        color: "text-purple-400",
        border: "border-purple-500",
        desc: "เน้นพลังโจมตีรุนแรงและโอกาสคริติคอลสูง",
        hp: 80,
        energy: 120,
        atk: 22,
        def: 3,
        crit: 15,
        passive: "Lethal Strike (+10% Crit Chance)",
        startSkill: "Void Break",
        startWeapon: "Assassin Dagger"
    },
    "soul_guardian": {
        id: "soul_guardian",
        name: "Soul Guardian",
        icon: "🛡️",
        color: "text-emerald-400",
        border: "border-emerald-500",
        desc: "รถถังเดินได้ พลังชีวิตมหาศาล ยืนหยัดได้ยาวนาน",
        hp: 180,
        energy: 80,
        atk: 10,
        def: 12,
        crit: 2,
        passive: "Stone Skin (-5% DMG Taken)",
        startSkill: "Guard",
        startWeapon: "Heavy Shield"
    }
};

let selectedClassId = null;

function renderCharacterCreation() {
    const container = document.getElementById('class-cards-container');
    const nameInput = document.getElementById('player-name-input');
    
    // Reset Data
    container.innerHTML = '';
    nameInput.value = '';
    selectedClassId = null;
    document.getElementById('class-preview-container').classList.add('hidden');
    checkFormValid();
    
    // สร้าง Class Cards
    Object.values(classData).forEach(cls => {
        const btn = document.createElement('button');
        btn.id = `card-${cls.id}`;
        btn.className = "class-card text-left bg-slate-900 border-2 border-slate-700 hover:border-slate-500 rounded-lg p-6 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 group";
        btn.onclick = () => selectClass(cls.id);
        
        btn.innerHTML = `
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">${cls.icon}</div>
            <h3 class="text-lg font-black text-slate-200 uppercase tracking-wider mb-2">${cls.name}</h3>
            <p class="text-xs text-slate-500 font-bold">${cls.desc}</p>
        `;
        container.appendChild(btn);
    });

    nameInput.addEventListener('input', checkFormValid);
}

function selectClass(id) {
    selectedClassId = id;
    const cls = classData[id];
    
    // รีเซ็ตขอบปุ่มทั้งหมด
    document.querySelectorAll('.class-card').forEach(card => {
        card.className = "class-card text-left bg-slate-900 border-2 border-slate-700 hover:border-slate-500 rounded-lg p-6 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 group opacity-60 grayscale";
    });
    
    // ไฮไลต์ปุ่มที่เลือก (ใช้ Full Class Name ห้าม Dynamic)
    const activeCard = document.getElementById(`card-${id}`);
    activeCard.classList.remove('border-slate-700', 'hover:border-slate-500', 'opacity-60', 'grayscale');
    
    if (id === 'shadow_knight') activeCard.classList.add('border-cyan-500', 'bg-slate-800');
    if (id === 'arcane_hunter') activeCard.classList.add('border-purple-500', 'bg-slate-800');
    if (id === 'soul_guardian') activeCard.classList.add('border-emerald-500', 'bg-slate-800');

    // อัปเดตข้อมูลพรีวิว
    document.getElementById('preview-icon').textContent = cls.icon;
    
    const previewName = document.getElementById('preview-name');
    previewName.textContent = cls.name;
    previewName.className = `text-2xl font-black uppercase tracking-wider mb-1 text-center md:text-left ${cls.color}`;
    
    document.getElementById('preview-desc').textContent = cls.desc;
    document.getElementById('preview-hp').textContent = cls.hp;
    document.getElementById('preview-en').textContent = cls.energy;
    document.getElementById('preview-atk').textContent = cls.atk;
    document.getElementById('preview-def').textContent = cls.def;
    document.getElementById('preview-passive').textContent = cls.passive;
    document.getElementById('preview-skill').textContent = cls.startSkill;
    
    document.getElementById('class-preview-container').classList.remove('hidden');
    checkFormValid();
}

function checkFormValid() {
    const nameInput = document.getElementById('player-name-input').value.trim();
    const btnConfirm = document.getElementById('btn-confirm-character');
    
    if (nameInput.length > 0 && selectedClassId !== null) {
        btnConfirm.disabled = false;
        btnConfirm.className = "px-8 py-4 bg-cyan-700 hover:bg-cyan-600 border border-cyan-500 text-white font-black tracking-widest uppercase rounded shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all active:scale-95 focus:ring-2 focus:ring-cyan-400";
    } else {
        btnConfirm.disabled = true;
        btnConfirm.className = "px-8 py-4 bg-slate-800 border border-slate-700 text-slate-500 font-black tracking-widest uppercase rounded shadow-lg transition-all cursor-not-allowed";
    }
}

function confirmCharacter() {
    const name = document.getElementById('player-name-input').value.trim();
    const cls = classData[selectedClassId];
    
    // บันทึกลง Global State
    gameState.player = {
        name: name,
        class: cls.name,
        level: 1,
        exp: 0,
        maxExp: 100,
        gold: 0,
        hp: cls.hp,
        maxHp: cls.hp,
        energy: cls.energy,
        maxEnergy: cls.energy,
        baseAtk: cls.atk,
        baseDef: cls.def,
        combo: 0
    };

    // กำหนดอุปกรณ์และสกิลเริ่มต้น
    gameState.equipment.weapon = { name: cls.startWeapon, type: "weapon" };
    gameState.equippedSkills = [cls.startSkill];
    
    console.log("Character Created: ", gameState.player);
    
    // นำทางไปหน้า World Map (Phase 4)
    navigateTo('view-world');
    // TODO: เรียก renderWorld() เมื่อระบบ World Map พร้อม
}