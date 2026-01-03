document.addEventListener("DOMContentLoaded", () => {
    
    const path = window.location.pathname;

    // --- BARRE DE PROGRESSION (Pour la page article) ---
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
            const cardHTML = `
            <article class="card" onclick="window.location.href='article.html?id=${article.id}'">
                <div class="card-img">
                    <img src="${article.image}" onerror="this.src='https://placehold.co/600x400/102030/00f2ff?text=FROST+NEWS'" alt="${article.title}">
                </div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between;">
                        <span class="badge news">${article.category}</span>
                        <span style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-regular fa-clock"></i> ${article.readTime || '3 min'}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <div class="card-footer">
                        <span>${article.date.split('•')[0]}</span>
                        <span style="color:var(--primary); font-weight:600; font-size:0.75rem;">LIRE LE DOSSIER <i class="fa-solid fa-chevron-right" style="font-size:0.6rem;"></i></span>
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
            document.getElementById('art-title').textContent = article.title;
            document.getElementById('art-author').innerHTML = `<i class="fa-solid fa-user-astronaut"></i> ${article.author}`;
            document.getElementById('art-date').innerHTML = `<i class="fa-regular fa-calendar-check"></i> ${article.date}`;
            document.getElementById('art-content').innerHTML = article.content;
            
            const imgEl = document.getElementById('art-image');
            imgEl.src = article.image;
            imgEl.onerror = function() { this.src = 'https://placehold.co/1200x600/102030/00f2ff?text=FROST+NEWS'; };
            document.title = `FROST NEWS | ${article.title}`;
        } else {
            articleView.innerHTML = `<h2 style="text-align:center; padding:100px;">ERREUR 404 : Données corrompues.</h2>`;
        }
    }
});