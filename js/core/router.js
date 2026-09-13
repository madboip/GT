/**
 * Router System
 * จัดการการเปลี่ยนหน้าจอ (View) และ Navbar
 */

// ฟังก์ชันหลักสำหรับสลับหน้าจอ
function navigateTo(viewId) {
    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('flex');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        
        if (viewId === 'view-main-menu' || viewId === 'view-character-creation') {
            targetView.classList.add('flex');
            document.getElementById('main-nav').classList.add('hidden');
            document.getElementById('bottom-nav').classList.add('hidden');
        } else {
            targetView.classList.add('flex');
            document.getElementById('main-nav').classList.remove('hidden');
            // แสดงเมนูด้านล่างเมื่อไม่ใช่หน้าต่อสู้
            if(viewId !== 'view-battle') {
                document.getElementById('bottom-nav').classList.remove('hidden');
            } else {
                document.getElementById('bottom-nav').classList.add('hidden');
            }
            updateNavUI();
        }
    }
}

// อัปเดตข้อมูลบน Navbar
function updateNavUI() {
    document.getElementById('nav-gold').textContent = gameState.player.gold;
    document.getElementById('nav-level').textContent = gameState.player.level;
}

// ผูกฟังก์ชันกับปุ่มหน้า Main Menu
function startNewGame() {
    console.log("Starting new journey...");
    // ไป Phase 3: หน้าสร้างตัวละคร
    navigateTo('view-character-creation');
    
    // TODO: เรียกฟังก์ชัน render หน้าสร้างตัวละคร (จะเขียนใน Phase 3)
    if (typeof renderCharacterCreation === "function") {
        renderCharacterCreation();
    }
}

function continueGame() {
    console.log("Loading saved game...");
    // TODO: ตรวจสอบ Save Data (Phase 9) ตอนนี้ข้ามไปหน้า World Map ก่อน
    navigateTo('view-world');
}

function showSettings() {
    alert("Settings menu will be implemented soon!");
}

// เริ่มต้นระบบเมื่อโหลดเว็บเสร็จ
window.addEventListener('DOMContentLoaded', () => {
    navigateTo('view-main-menu');
});