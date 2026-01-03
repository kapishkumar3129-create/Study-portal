/* ----------------------------------------------------------------
   FILENAME: script.js
   DESCRIPTION: Main Application Controller & Auth Logic
   ---------------------------------------------------------------- */

import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- GLOBAL AUTHENTICATION CHECK ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                
                // Security Check: If user is banned, kick them out
                if (data.isBanned) {
                    window.logout();
                    return;
                }

                const role = data.role || 'user';
                updateUI(user.email, role);

                // Initialize protected features based on role
                if (role === 'owner') {
                    const adminBlock = document.getElementById('adminControls');
                    if (adminBlock) adminBlock.style.display = 'block';
                }
            } else {
                // Fallback for users without a profile doc
                updateUI(user.email, 'user');
            }
            
            // Load dashboard modules once authenticated
            loadDashboardModules();

        } catch (e) {
            console.error("Auth initialization error:", e);
        }
    } else {
        // Not logged in - redirect to landing
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.includes('landing.html')) {
            window.location.href = "landing.html";
        }
    }
});

// --- UI UPDATES ---
function updateUI(email, role) {
    const initial = email.charAt(0).toUpperCase();
    
    // Update Profile Circles
    const circle = document.getElementById('userInitial');
    const largeCircle = document.getElementById('largeInitial');
    if (circle) circle.textContent = initial;
    if (largeCircle) largeCircle.textContent = initial;

    // Update Text Displays
    const nameDisplay = document.getElementById('usernameDisplay');
    const pName = document.getElementById('pUsername');
    const roleDisplay = document.getElementById('roleDisplay');
    
    if (nameDisplay) nameDisplay.textContent = email.split('@')[0];
    if (pName) pName.textContent = email;
    if (roleDisplay) roleDisplay.textContent = role;
}

// --- DYNAMIC MODULE LOADING ---
async function loadDashboardModules() {
    const container = document.getElementById('moduleContainer');
    if (!container) return;

    try {
        const querySnapshot = await getDocs(collection(db, "modules"));
        container.innerHTML = ""; // Clear loader

        if (querySnapshot.empty) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">Nenhum conteúdo disponível ainda.</p>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const module = doc.data();
            const card = document.createElement('div');
            card.className = 'card animate-pop';
            card.innerHTML = `
                <div style="color: var(--accent); margin-bottom: 10px;">
                    <span class="material-icons">folder_open</span>
                </div>
                <h3>${doc.id}</h3>
                <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">
                    ${module.description || 'Aceda aos materiais e recursos deste módulo.'}
                </p>
                <button class="primary-btn" onclick="window.location.href='view_module.html?id=${doc.id}'">Abrir Módulo</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
        container.innerHTML = "<p>Erro ao carregar módulos.</p>";
    }
}

// --- GLOBAL WINDOW FUNCTIONS ---
window.logout = async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (e) {
        alert("Erro ao sair.");
    }
};

window.toggleProfile = () => {
    const dropdown = document.getElementById("pDropdown");
    if (dropdown) {
        const isShowing = dropdown.style.display === "block";
        dropdown.style.display = isShowing ? "none" : "block";
    }
};

window.openNav = () => {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");
    if (sidebar) sidebar.style.width = "280px";
    if (main && window.innerWidth > 768) main.style.marginLeft = "280px";
};

window.closeNav = () => {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");
    if (sidebar) sidebar.style.width = "0";
    if (main) main.style.marginLeft = "0";
};

// --- DROPDOWN LOGIC ---
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('dropdown-btn')) {
        e.target.classList.toggle("active");
        const content = e.target.nextElementSibling;
        const icon = e.target.querySelector('.material-icons');
        
        if (content.style.display === "block") {
            content.style.display = "none";
            if (icon) icon.textContent = "expand_more";
        } else {
            content.style.display = "block";
            if (icon) icon.textContent = "expand_less";
        }
    }
});