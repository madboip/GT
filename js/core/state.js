/**
 * Global Game State
 * เก็บข้อมูลทุกอย่างของเกมไว้ที่เดียว เพื่อง่ายต่อการบันทึก (Save/Load) ลง Database
 */
const gameState = {
    // ข้อมูลผู้เล่น
    player: {
        name: "",
        class: "", // Shadow Knight, Arcane Hunter, Soul Guardian
        level: 1,
        exp: 0,
        maxExp: 100,
        gold: 0,
        hp: 100,
        maxHp: 100,
        energy: 0,
        maxEnergy: 100,
        baseAtk: 15,
        baseDef: 5,
        combo: 0
    },
    
    // อุปกรณ์สวมใส่
    equipment: {
        weapon: null,
        armor: null,
        relic: null
    },

    // คลังเก็บของ (Array of Item Objects)
    inventory: [],

    // สกิลที่ใช้งาน (สูงสุด 4 สกิล)
    equippedSkills: [],

    // ความคืบหน้าของโลกและเควสต์
    progress: {
        unlockedZones: ["Shadow Village"],
        currentZone: "Shadow Village",
        activeQuests: [],
        completedQuests: [],
        achievements: []
    },

    // ตั้งค่าเกม
    settings: {
        sound: true,
        music: true,
        textSpeed: 'normal'
    }
};

// ฟังก์ชันดึงค่าพลังโจมตีและป้องกันรวม (Base + Equipment)
function getPlayerStats() {
    let totalAtk = gameState.player.baseAtk;
    let totalDef = gameState.player.baseDef;

    // TODO: อนาคตจะนำค่าจาก gameState.equipment มาบวกเพิ่มตรงนี้

    return {
        attack: totalAtk,
        defense: totalDef
    };
}