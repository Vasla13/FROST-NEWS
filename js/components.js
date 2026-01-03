document.addEventListener("DOMContentLoaded", () => {
    
    // 0. LOADER SYSTEM 2035
    if(!document.getElementById('loader')) {
        const loaderHTML = `
        <div id="loader">
            <div class="loader-content">
                <div style="font-size: 2rem; font-weight: 800; letter-spacing: 5px; margin-bottom: 20px;">FROST<span style="color:white">NEWS</span></div>
                <div class="bar-container"><div class="bar-progress"></div></div>
                <div class="terminal-text" id="loader-log">INITIALIZING NEURAL LINK...</div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        
        const logs = [
            "DECRYPTING SECURE CHANNEL...",
            "VERIFYING BIOMETRICS...",
            "ESTABLISHING UPLINK TO SATELLITE 4...",
            "ACCESS GRANTED."
        ];
        
        const logEl = document.getElementById('loader-log');
        let step = 0;
        
        const interval = setInterval(() => {
            if(step < logs.length) {
                logEl.innerText = logs[step];
                logEl.style.opacity = Math.random() > 0.5 ? 1 : 0.5;
                step++;
            } else {
                clearInterval(interval);
                const loader = document.getElementById('loader');
                loader.style.opacity = '0';
                setTimeout(() => { loader.style.display = 'none'; }, 500);
            }
        }, 300);
    }

    // 1. NAVBAR FUTURE-READY
    const netSpeed = Math.floor(Math.random() * (900 - 400) + 400);
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
    
    // 2. FOOTER
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

    if(!document.querySelector('.navbar')) document.body.insertAdjacentHTML('afterbegin', headerHTML);
    if(!document.querySelector('footer')) document.body.insertAdjacentHTML('beforeend', `<footer>${footerHTML}</footer>`);

    // 3. ACTIVE STATE
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links a').forEach(link => {
        if(link.getAttribute('href') === currentPage) link.classList.add('active');
    });
});