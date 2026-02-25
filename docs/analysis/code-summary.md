# Analyse du code source

Le fichier `index` contenait une application React monolithique (~1300 lignes) avec:
- edition de pages (cover/article/ad)
- personnalisation visuelle (image, layout, effets)
- gestion d'assets
- autosave localStorage
- export image/PDF

Refonte appliquee:
- migration vers projet Vite + React + Tailwind
- decoupage en composants et modules par domaine
- separation de l'editeur en panneaux (sidebar, preview, inspector)
- conservation des fonctionnalites d'origine
