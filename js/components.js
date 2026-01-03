document.addEventListener("DOMContentLoaded", () => {
    
    // 0. LOADER SYSTEM
    // On vérifie si le loader existe déjà, sinon on l'ajoute
    if(!document.getElementById('loader')) {
        const loaderHTML = `
        <div id="loader">
            <div class="loader-spinner"></div>
            <div class="loader-text">INITIALISATION DU SYSTÈME...</div>
        </div>`;
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        
        // Disparition du loader
        setTimeout(() => {
            const loader = document.getElementById('loader');
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 800);
        }, 1200); // Durée du chargement fictif
    }

    // 1. NAVBAR
    const headerHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="logo">
                <img src="assets/logo.png" style="height:35px;" onerror="this.style.display='none'">
                FROST <span>NEWS</span>
            </a>
            <ul class="nav-links">
                <li><a href="index.html">Accueil</a></li>
                <li><a href="enquetes.html">Enquêtes</a></li>
                <li><a href="apropos.html">À Propos</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <a href="contact.html" class="btn-cta">Envoyer une info</a>
        </div>
    </nav>
    <div class="ticker-wrap">
        <div class="ticker-label">FLASH INFO</div>
        <div class="ticker-text">
            • LSPD : Contrôles renforcés secteur Vinewood ce soir 
            • MÉTÉO : Alerte orage violent sur le comté de Blaine 
            • ÉCONOMIE : Le cours du pétrole en hausse de 2% 
            • TRAFIC : Accident majeur sur l'Olympic Freeway.
            • TECH : LifeInvader lance sa nouvelle interface neuronale.
        </div>
    </div>
    `;
    
    // 2. FOOTER
    const footerHTML = `
    <div class="container" style="text-align:center;">
        <h3 style="margin-bottom: 15px; color: white; letter-spacing:2px;">FROST NEWS MEDIA GROUP</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 500px; margin: 0 auto 25px auto;">
            Média indépendant de Los Santos. L'information vérifiée, sans parti pris. Univers GTA RP 2035.
        </p>
        <div class="footer-links">
            <a href="#">Mentions Légales</a>
            <a href="#">Confidentialité</a>
            <a href="#">Recrutement</a>
            <a href="#">Droit de réponse (RP)</a>
        </div>
        <p style="margin-top: 40px; opacity: 0.3; font-size: 0.75rem; font-family: monospace;">
            &copy; 2035 FROST NEWS. TERMINAL SECURE CONNECTION ESTABLISHED.
        </p>
    </div>
    `;

    // Insertion si pas déjà présents (évite les doublons)
    if(!document.querySelector('.navbar')) document.body.insertAdjacentHTML('afterbegin', headerHTML);
    if(!document.querySelector('footer')) document.body.insertAdjacentHTML('beforeend', `<footer>${footerHTML}</footer>`);

    // 3. MENU ACTIF
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-links a').forEach(link => {
        if(link.getAttribute('href') === currentPage) link.classList.add('active');
    });
});