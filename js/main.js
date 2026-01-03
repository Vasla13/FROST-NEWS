document.addEventListener("DOMContentLoaded", () => {
    
    const path = window.location.pathname;

    // --- BARRE DE PROGRESSION ---
    const readingBar = document.getElementById('reading-progress');
    if (readingBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;
            readingBar.style.width = scrolled + "%";
        });
    }
    
    // --- PAGE D'ACCUEIL ---
    const newsGrid = document.querySelector('.grid-3');
    if (newsGrid && (path.includes('index.html') || path === '/' || path.endsWith('/'))) {
        newsGrid.innerHTML = '';
        articleData.forEach(article => {
            // Détermine la classe du badge
            let badgeClass = "news";
            if(article.category === "Alerte") badgeClass = "alert";
            
            const cardHTML = `
            <article class="card" onclick="window.location.href='article.html?id=${article.id}'">
                <div class="card-img">
                    <img src="${article.image}" onerror="this.src='https://placehold.co/600x400/102030/00f2ff?text=NO+SIGNAL'" alt="${article.title}">
                    <div style="position:absolute; top:10px; right:10px; background:black; color:white; font-size:0.7rem; padding:2px 6px; font-family:monospace;">
                        ID: ${article.id.toString().padStart(3, '0')}
                    </div>
                </div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="badge ${badgeClass}">${article.category}</span>
                        <span style="font-size:0.7rem; color:var(--text-muted); font-family:monospace;">${article.readTime || '3 MIN'} READ</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <div class="card-footer">
                        <span>${article.date.split('•')[0]}</span>
                        <span style="color:var(--primary); font-weight:700;">ACCÉDER ></span>
                    </div>
                </div>
            </article>
            `;
            newsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // --- PAGE ARTICLE ---
    const articleView = document.getElementById('article-view');
    if (articleView) {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        const article = articleData.find(a => a.id === id);

        if (article) {
            document.getElementById('art-category').textContent = article.category;
            
            const titleEl = document.getElementById('art-title');
            titleEl.textContent = article.title;
            titleEl.setAttribute('data-text', article.title); // Pour l'effet glitch
            
            document.getElementById('art-author').innerHTML = `AGENT: ${article.author.toUpperCase()}`;
            document.getElementById('art-date').innerHTML = `${article.date}`;
            document.getElementById('art-content').innerHTML = article.content;
            
            const imgEl = document.getElementById('art-image');
            imgEl.src = article.image;
            imgEl.onerror = function() { this.src = 'https://placehold.co/1200x600/102030/00f2ff?text=DATA+CORRUPTED'; };
            document.title = `FROST NEWS | ${article.title}`;
        } else {
            articleView.innerHTML = `
            <div style="text-align:center; padding:100px; border:1px solid red; background:rgba(255,0,0,0.1);">
                <h1 style="color:red; font-family:monospace;">ERREUR CRITIQUE 404</h1>
                <p>DONNÉES INTROUVABLES SUR LE SERVEUR.</p>
                <a href="index.html" class="btn-cta" style="margin-top:20px; display:inline-block;">RETOUR</a>
            </div>`;
        }
    }
});