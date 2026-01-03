document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. VIDEO INTRO SYSTEM ---
    const hasSeenIntro = sessionStorage.getItem('frostVideoIntroSeen_v2');

    if(!hasSeenIntro) {
        document.body.style.overflow = 'hidden';

        const introHTML = `
        <div id="video-intro-layer">
            <video id="intro-video-player" autoplay muted playsinline>
                <source src="assets/intro.mp4" type="video/mp4">
            </video>
            <button id="skip-intro-btn">SKIP_BOOT_SEQUENCE >>></button>
        </div>`;
        
        document.body.insertAdjacentHTML('afterbegin', introHTML);
        
        const videoLayer = document.getElementById('video-intro-layer');
        const videoPlayer = document.getElementById('intro-video-player');
        const skipBtn = document.getElementById('skip-intro-btn');

        const closeIntro = () => {
            videoLayer.classList.add('fade-out-intro');
            sessionStorage.setItem('frostVideoIntroSeen_v2', 'true');
            setTimeout(() => {
                document.body.style.overflow = 'auto';
                if(videoLayer) videoLayer.remove();
            }, 800);
        };

        if(videoPlayer) {
            videoPlayer.addEventListener('ended', closeIntro);
            videoPlayer.addEventListener('error', closeIntro);
        }
        if(skipBtn) skipBtn.addEventListener('click', closeIntro);

    } else {
        console.log("Intro skipped");
    }

    // --- 1. NAVBAR ---
    const netSpeed = Math.floor(Math.random() * (900 - 400) + 400);
    // Exemple de stat visuelle
    const securityLvl = ["LOW", "MED", "HIGH", "MAX"][Math.floor(Math.random() * 4)];

    const headerHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="logo">
                <i class="fa-solid fa-snowflake" style="font-size:1.2rem; color:var(--primary);"></i>
                FROST <span>NEWS</span>
            </a>
            
            <div class="hud-stats">
                <div class="hud-item"><i class="fa-solid fa-wifi"></i> ${netSpeed} TB/s</div>
                <div class="hud-item"><i class="fa-solid fa-shield-halved"></i> SEC: ${securityLvl}</div>
                <div class="hud-item"><i class="fa-solid fa-location-dot"></i> LOS SANTOS</div>
            </div>

            <ul class="nav-links">
                <li><a href="index.html">Flux</a></li>
                <li><a href="enquetes.html">Dossiers</a></li>
                <li><a href="apropos.html">Manifeste</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <a href="contact.html" class="btn-cta"><i class="fa-solid fa-paper-plane"></i> ENVOYER INFO</a>
        </div>
    </nav>
    <div class="ticker-wrap">
        <div class="ticker-label">LIVE FEED</div>
        <div class="ticker-text">
            /// ALERT: COUVRE-FEU EN VIGUEUR DANS LE SECTEUR 4 /// LSPD: RECRUTEMENT DE DRONES AUTOMATISÉS /// TECH: LE PRIX DES IMPLANTS NEURAUX CHUTE DE 15% /// MÉTÉO: PLUIES ACIDES PRÉVUES DEMAIN ///
        </div>
    </div>
    `;
    
    // --- 2. FOOTER (Épuré) ---
    const footerHTML = `
    <div class="container">
        <h2 style="margin-bottom: 10px; font-size: 1.8rem; letter-spacing:1px;">FROST NEWS NETWORK</h2>
        
        <div style="width: 50px; height: 2px; background: var(--primary); margin: 0 auto 20px auto;"></div>

        <p style="color: var(--text-muted); font-size: 0.75rem; font-family: monospace; opacity: 0.7;">
            SESSION ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} <br>
            CONTENU VÉRIFIÉ PAR IA BNI
        </p>
    </div>
    `;

    if(!document.querySelector('.navbar')) document.body.insertAdjacentHTML('afterbegin', headerHTML);
    if(!document.querySelector('footer')) document.body.insertAdjacentHTML('beforeend', `<footer>${footerHTML}</footer>`);

    // --- 3. ACTIVE STATE ---
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links a').forEach(link => {
        if(link.getAttribute('href') === currentPage) link.classList.add('active');
    });
});