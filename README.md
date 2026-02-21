# Frost News - Edition Los Santos 2035

Page de journal professionnelle en style presse imprimee cyberpunk (sobre), avec:
- 3 variantes: `Classique`, `Magazine`, `Minimaliste`
- blocs modulables: deplacement + redimensionnement
- sections completes: titre, sous-titres, articles, encadres, citation, pub, galerie, "A la une"
- export optimise: `PNG`, `JPEG`, `PDF` en mode `HQ` (jusqu'a `1440x2560` selon ratio) avec objectif strict `< 2 Mo`
- contenus editoriaux adaptes a la ville de `Los Santos`
- integration des assets du dossier `assets/`
- date affichee automatiquement dans le journal (annee editoriale 2035)
- signatures journalistes fictives dans les articles
- edition directe du contenu (texte editable dans la page)
- ajout/remplacement d'images dans la galerie
- auto-save local a chaque modification
- historique d'editions archivables et rechargeables

## Structure du projet

```
index.html
styles.css
assets/
js/
  app.js            # orchestration principale
  constants.js      # constantes globales + layouts
  dom.js            # recuperation des references DOM
  media-utils.js    # images/canvas/export helpers
  storage.js        # helpers localStorage
  utils.js          # helpers generiques (dates, clamp, format)
```

## Utilisation

1. Ouvrir `index.html` dans un navigateur moderne.
2. Choisir une variante via les boutons en haut.
3. Deplacer un bloc via sa barre superieure.
4. Redimensionner un bloc via la poignee en haut a droite du bloc.
5. Modifier le texte directement dans le journal.
6. Ajouter une image via `Ajouter image` ou cliquer une image existante pour la remplacer.
7. Archiver une edition dans l'historique, puis la recharger si besoin.
8. `Reinitialiser` restaure completement le modele d'origine (texte + images + mise en page) pour la variante active.
9. Utiliser les boutons d'export pour generer les fichiers finaux.

## Notes

- Les exports utilisent `html2canvas` et `jsPDF` charges via CDN.
- L'interface de controle reste neutre; la DA cyberpunk est concentree sur la page journal.
- Sauvegarde et historique utilisent `localStorage` du navigateur.
- Le journal est volontairement en palette sombre (bleu/cyan), sans fond blanc dominant.
