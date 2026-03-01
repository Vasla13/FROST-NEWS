# Frost News Web Builder

Application web React pour concevoir des pages de journal style cyberpunk:
- cover
- page article
- page pub/sponsor

## Demarrer

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/components/ui`: composants de formulaire
- `src/components/canvas`: blocs visuels reutilisables
- `src/components/templates`: templates cover/article/pub
- `src/components/editor`: sidebar, preview, inspector et tabs
- `src/lib`: utilitaires (export, parse format, etc.)
- `src/constants`: presets et configuration initiale

## Notes

- Autosave dans `localStorage`
- Export de la page courante en `PNG` optimise (< 2 Mo)
