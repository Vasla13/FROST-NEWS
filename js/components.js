document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. SYSTÈME INTRO VIDÉO (Une seule fois par session) ---
    const hasSeenIntro = sessionStorage.getItem('frostBroadcastSeen_v1');

    if(!hasSeenIntro) {
        // 1. On bloque le scroll (cache la barre à droite) pour l'immersion
        document.body.style.overflow = 'hidden';

        // 2. Injection du lecteur vidéo plein écran
        const introHTML = `
        <div id="video-intro-layer">
            <video id="intro-video-player" autoplay muted playsinline>
                <source src="assets/intro.mp4" type="video/mp4">
            </video>
            <button id="skip-intro-btn">ACCÉDER AU DIRECT >></button>
        </div>`;
        
        document.body.insertAdjacentHTML('afterbegin', introHTML);
        
        const videoLayer = document.getElementById('video-intro-layer');
        const videoPlayer = document.getElementById('intro-video-player');
        const skipBtn = document.getElementById('skip-intro-btn');

        // Fonction pour fermer l'intro et lancer le site
        const closeIntro = () => {
            videoLayer.classList.add('fade-out-intro');
            sessionStorage.setItem('frostBroadcastSeen_v1', 'true');
            
            // On attend la fin de l'animation de fondu (0.8s)
            setTimeout(() => {
                // On réactive le scroll
                document.body.style.overflow = 'auto';
                // On supprime la vidéo du code
                if(videoLayer) videoLayer.remove();
            }, 800);
        };

        // Événements
        if(videoPlayer) {
            // Quand la vidéo est finie, on ferme
            videoPlayer.addEventListener('ended', closeIntro);
            
            // Sécurité : si la vidéo plante, on ouvre quand même le site
            videoPlayer.addEventListener('error', () => {
                console.log("Erreur vidéo - Intro passée");
                closeIntro();
            });
        }
        
        // Bouton passer
        if(skipBtn) {
            skipBtn.addEventListener('click', closeIntro);
        }

    } else {
        // Si déjà vu, on ne fait rien, le site est déjà là.
        console.log("Intro déjà vue (Session active)");
    }

    // --- 1. NAVBAR (Barre de navigation) ---
    // Génération de fausses stats pour l'ambiance
    const netSpeed = Math.floor(Math.random() * (900 - 400) + 400);
    const securityLvl = ["STABLE", "ALERTE", "CRITIQUE"][Math.floor(Math.random() * 3)];
    let secColor = securityLvl === "STABLE" ? "#0f0" : (securityLvl === "ALERTE" ? "orange" : "red");

    const headerHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="logo">
                <i class="fa-solid fa-snowflake" style="font-size:1.2rem; color:var(--primary);"></i>
                FROST <span>NEWS</span>
            </a>
            
            <div class="hud-stats">
                <div class="hud-item"><i class="fa-solid fa-signal"></i> ${netSpeed} MB/s</div>
                <div class="hud-item" style="color:${secColor}"><i class="fa-solid fa-shield-halved"></i> ETAT: ${securityLvl}</div>
                <div class="hud-item"><i class="fa-solid fa-location-dot"></i> LS NET</div>
            </div>

            <ul class="nav-links">
                <li><a href="index.html">Flux Info</a></li>
                <li><a href="enquetes.html">Dossiers</a></li>
                <li><a href="apropos.html">À Propos</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <a href="contact.html" class="btn-cta"><i class="fa-solid fa-paper-plane"></i> ENVOYER INFO</a>
        </div>
    </nav>
    <div class="ticker-wrap">
        <div class="ticker-label">EN DIRECT</div>
        <div class="ticker-text">
            /// ALERT: COUVRE-FEU EN VIGUEUR DANS LE SECTEUR 4 /// LSPD: RECRUTEMENT DE DRONES AUTOMATISÉS /// TECH: LE PRIX DES IMPLANTS NEURAUX CHUTE DE 15% /// MÉTÉO: PLUIES ACIDES PRÉVUES DEMAIN ///
        </div>
    </div>
    `;
    
    // --- 2. FOOTER ---
    const footerHTML = `
    <div class="container">
        <h2 style="margin-bottom: 20px; font-size: 2rem;">FROST NEWS NETWORK</h2>
        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:30px;">
            <i class="fa-brands fa-twitter" style="font-size:1.5rem; color:white; opacity:0.5;"></i>
            <i class="fa-brands fa-discord" style="font-size:1.5rem; color:white; opacity:0.5;"></i>
            <i class="fa-solid fa-tower-broadcast" style="font-size:1.5rem; color:white; opacity:0.5;"></i>
        </div>
        <p style="color: var(--text-muted); font-size: 0.8rem; font-family: monospace;">
            ID DE SESSION: ${Math.random().toString(36).substr(2, 9).toUpperCase()} <br>
            CONTENU VÉRIFIÉ PAR IA-SENTINEL v4.2
        </p>
    </div>
    `;

    // Insertion si pas déjà présents
    if(!document.querySelector('.navbar')) document.body.insertAdjacentHTML('afterbegin', headerHTML);
    if(!document.querySelector('footer')) document.body.insertAdjacentHTML('beforeend', `<footer>${footerHTML}</footer>`);

    // --- 3. MENU ACTIF ---
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links a').forEach(link => {
        if(link.getAttribute('href') === currentPage) link.classList.add('active');
    });
});