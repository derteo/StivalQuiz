# Indovina la Provincia

App mobile in **React Native (Expo)** per allenarsi sulla geografia italiana: viene mostrato il nome di una città (o di un piccolo comune) e bisogna indovinare in quale **provincia** (o **regione**) si trova, in quattro modalità di gioco diverse. Punteggi e statistiche vengono salvati in locale sul dispositivo.

## Funzionalità

Un round è composto da **fino a 10 domande**, ciascuna con una città italiana scelta a caso dal dataset. Le città capoluogo di provincia il cui nome coincide con quello della provincia stessa sono escluse di proposito, per evitare risposte troppo scontate.

Quattro modalità di gioco, selezionabili dalla Home:

1. **Scelta multipla** — 4 opzioni tra cui scegliere la provincia corretta.
2. **Risposta libera** — si scrive il nome della provincia; mentre si digita vengono suggerite in tempo reale le province compatibili con il testo inserito, e premendo **Invio** si compila automaticamente il campo con il primo suggerimento disponibile e si invia la risposta.
3. **Regione sulla mappa** — viene mostrata una mappa interattiva dell'Italia (SVG con confini reali delle regioni) e si tocca direttamente la regione in cui si pensa si trovi la città.
4. **Comuni minori** — prima si sceglie una regione toccandola sulla mappa d'Italia, poi si gioca solo con i **comuni minori** (borghi piccoli/poco noti, flaggati con `minor: true` nel dataset) di quella regione, da collocare sulla provincia giusta toccando una mappa zoomata sulle sole province della regione scelta.

Altre funzionalità:

- **Tema chiaro/scuro**, con una piccola icona in alto a destra nella Home, persistito tra le sessioni.
- **Ultimo risultato** mostrato in Home (punteggio e modalità dell'ultima partita giocata).
- **Grafico a barre** in Home con la percentuale di risposte corrette per ciascuna modalità di gioco.
- **Report delle risposte** a fine partita: dalla schermata dei risultati si può aprire un riepilogo domanda per domanda con la risposta data, quella corretta e l'esito (✅/❌).
- Feedback visivo immediato (verde/rosso) su ogni risposta, con rivelazione della risposta corretta quando si sbaglia.

## Stack tecnico

- [Expo](https://expo.dev/) (SDK 57) + React Native, **JavaScript** (no TypeScript)
- [React Navigation](https://reactnavigation.org/) (`@react-navigation/native` + `native-stack`) per la navigazione tra le schermate Home → (RegionPicker) → Game → Results → Report
- `useContext` per il tema chiaro/scuro ([`src/context/ThemeContext.js`](src/context/ThemeContext.js))
- `useState` / `useEffect` (logica di gioco, fetch del punteggio salvato, ecc.)
- [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/) per la persistenza locale (storico partite, statistiche per modalità, preferenza tema)
- [`react-native-svg`](https://github.com/software-mansion/react-native-svg) per la mappa interattiva delle regioni e delle province

## Come avviare il progetto

### Prerequisiti

- [Node.js](https://nodejs.org/) 18 o superiore
- npm (incluso con Node)
- L'app **[Expo Go](https://expo.dev/go)** installata sul telefono (Android o iOS)
- Telefono e computer sulla **stessa rete Wi-Fi**

### Setup

```bash
git clone <url-del-repo>
cd provinceGameReact
npm install
npm start
```

Verrà aperto Metro Bundler e mostrato un **QR code** nel terminale: basta inquadrarlo con la fotocamera (iOS) o dall'interno dell'app Expo Go (Android) per aprire l'app sul telefono.

**Nessun dato da inserire**: non è richiesto login, non servono API key né variabili d'ambiente.

## Note tecniche

- **Dataset geografico**: città distribuite su tutte le province italiane, con comuni minori flaggati `minor: true` per la modalità dedicata.
- **Mappa delle regioni e delle province**: i confini SVG sono generati semplificando i dati geografici di [openpolis/geojson-italy](https://github.com/openpolis/geojson-italy) (dati ISTAT, pubblico dominio).
- **Safe area**: l'icona del tema (Home) e l'header con domanda/punteggio (Game) usano `useSafeAreaInsets` di `react-native-safe-area-context` per non sovrapporsi alla status bar/notch del dispositivo.

## Funzionalità future

- Modalità sopravvivenza (Showdown) senza limite di domande
- Timer per domanda e bonus di punteggio per le risposte rapide
- Suoni ed effetti haptic sulla risposta corretta/sbagliata

## Riferimenti utili

- [Documentazione Expo](https://docs.expo.dev/)
- [Documentazione React Native](https://reactnative.dev/docs/getting-started)
- [React Navigation — Getting started](https://reactnavigation.org/docs/getting-started)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage)
- [openpolis/geojson-italy](https://github.com/openpolis/geojson-italy)
