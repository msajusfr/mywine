# MyWine

MyWine est une PWA React pour memoriser les bouteilles de vin a reprendre chez
son caviste. L'application permet d'ajouter une photo, une note de 1 a 10, un
commentaire, puis de modifier ou supprimer chaque fiche.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- vite-plugin-pwa
- localStorage

## Installation

```bash
npm install
```

## Developpement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Persistance locale

Les donnees sont sauvegardees dans le navigateur avec `localStorage`, sous la
cle `mywine:wines`. Chaque fiche contient l'image en data URL, la note, le
commentaire, la date de creation et, si besoin, la date de modification.

MyWine fonctionne sans backend, sans base distante et sans compte utilisateur.
