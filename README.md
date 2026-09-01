# Angelo 18 — Black Party

Invito web statico mobile-first per i 18 anni di Angelo Caldarelli.

Live: <https://angelo18.ch/>  
Fallback GitHub Pages: <https://valerielinc-ops.github.io/angelo-18/>

## Sviluppo locale

Il sito non richiede una build. Avvialo con un server statico:

```bash
python3 -m http.server 4173
```

Poi apri `http://localhost:4173`.

## Dati modificabili

Data e IBAN sono raccolti nell’oggetto `EVENT` all’inizio di `script.js`. La musica usa il preview ufficiale Apple Music, avviato dal tap per essere compatibile con iPhone. Il valore IBAN iniziale è volutamente fittizio e va sostituito prima di condividere il sito.

## Pubblicazione

Il sito è pubblicato direttamente dal branch `main` tramite GitHub Pages.
