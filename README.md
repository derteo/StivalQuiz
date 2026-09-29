# StivalQuiz

App mobile in **React Native (Expo)** per allenarsi sulla geografia italiana: viene mostrato il nome di una città (o di un piccolo comune) e bisogna indovinare in quale **provincia** (o **regione**) si trova, in quattro modalità di gioco diverse, ciascuna giocabile in versione normale o "Showdown" (sopravvivenza). Punteggi e statistiche vengono salvati in locale sul dispositivo.

## Indice

- [Funzionalità](#funzionalità)
- [Stack tecnico](#stack-tecnico)
- [Come avviare il progetto](#come-avviare-il-progetto)
- [Struttura del progetto](#struttura-del-progetto)
- [Note tecniche](#note-tecniche)
- [Funzionalità future](#funzionalità-future)
- [Riferimenti utili](#riferimenti-utili)

## Funzionalità

Un round è composto da **fino a 10 domande**, ciascuna con una città italiana scelta a caso da un dataset di oltre 950 città (tutte le 107 province italiane sono rappresentate; la Toscana include l'elenco completo dei suoi comuni). Le città capoluogo di provincia il cui nome coincide con quello della provincia stessa (es. "Torino" → provincia di Torino) sono escluse di proposito, per evitare risposte troppo scontate.

Quattro modalità di gioco, selezionabili dalla Home:

1. **Scelta multipla** — 4 opzioni tra cui scegliere la provincia corretta.
2. **Risposta libera** — si scrive il nome della provincia; mentre si digita vengono suggerite in tempo reale le province compatibili con il testo inserito, e premendo **Invio** si compila automaticamente il campo con il primo suggerimento disponibile e si invia la risposta.
3. **Regione sulla mappa** — viene mostrata una mappa interattiva dell'Italia (SVG con confini reali delle regioni) e si tocca direttamente la regione in cui si pensa si trovi la città.
4. **Comuni minori** — prima si sceglie una regione toccandola sulla mappa d'Italia, poi si gioca solo con i **comuni minori** (borghi piccoli/poco noti, flaggati con `minor: true` nel dataset) di quella regione, da collocare sulla provincia giusta toccando una mappa zoomata sulle sole province della regione scelta.

Dopo aver scelto la modalità, la Home chiede **come** giocarla:

- **▶️ Modalità normale** — round da massimo 10 domande (o quante sono le province della regione, per "Comuni minori").
- **🔥 Showdown (sopravvivenza)** — nessun limite di round: continua finché non sbagli una risposta, per vedere quante città di fila conosci, con lo stile di gioco (scelta multipla, mappa, testo libero...) della modalità selezionata sopra. Appena scelto, l'interfaccia passa a una palette rosso/nero dedicata ("tema sopravvivenza"), attiva per tutta la partita (incluso l'eventuale schermo di scelta regione, Game, Results e Report).

Altre funzionalità:

- **Tema chiaro/scuro**, con una piccola icona in alto a destra nella Home, persistito tra le sessioni.
- **Ultimo risultato** mostrato in Home (punteggio e modalità dell'ultima partita giocata), aggiornato automaticamente ogni volta che si torna alla Home.
- **Grafico a barre** in Home con la percentuale di risposte corrette per ciascuna modalità di gioco, calcolata sullo storico delle partite salvate.
- **Report delle risposte** a fine partita: dalla schermata dei risultati si può aprire un riepilogo domanda per domanda con la risposta data, quella corretta e l'esito (✅/❌).
- Feedback visivo immediato (verde/rosso) su ogni risposta, con rivelazione della risposta corretta quando si sbaglia.

## Stack tecnico

- [Expo](https://expo.dev/) (SDK 57) + React Native, **JavaScript** (no TypeScript)
- [React Navigation](https://reactnavigation.org/) (`@react-navigation/native` + `native-stack`) per la navigazione tra le schermate Home → (RegionPicker) → Game → Results → Report
- `useContext` per il tema chiaro/scuro ([`src/context/ThemeContext.js`](src/context/ThemeContext.js))
- `useState` / `useEffect` (logica di gioco, fetch del punteggio salvato, ecc.)
- [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/) per la persistenza locale (storico partite, statistiche per modalità, preferenza tema)
- [`react-native-svg`](https://github.com/software-mansion/react-native-svg) per la mappa interattiva delle regioni

Non è previsto nessun backend: tutto funziona offline, il "third-party backend" citato nella consegna non è stato necessario per lo scope di questa app.

## Come avviare il progetto

### Prerequisiti

- [Node.js](https://nodejs.org/) 18 o superiore (sviluppato e testato con Node 24)
- npm (incluso con Node)
- L'app **[Expo Go](https://expo.dev/go)** installata sul telefono (Android o iOS) — è gratuita, disponibile su Play Store / App Store
- Telefono e computer sulla **stessa rete Wi-Fi**

Non serve Android Studio, Xcode né alcun emulatore: si può testare l'app direttamente sul proprio telefono tramite Expo Go.

### Setup

```bash
git clone <url-del-repo>
cd StivalQuiz
npm install
npm start
```

Verrà aperto Metro Bundler e mostrato un **QR code** nel terminale: basta inquadrarlo con la fotocamera (iOS) o dall'interno dell'app Expo Go (Android) per aprire l'app sul telefono.

**Nessun dato da inserire**: non è richiesto login, non servono API key né variabili d'ambiente. L'app è pronta all'uso subito dopo `npm start`.

> Nota: se Expo Go richiede il login (versioni recenti lo richiedono per aprire progetti in sviluppo), basta eseguire `npx expo login` sul computer e accedere con lo stesso account anche nell'app Expo Go sul telefono.

### Script disponibili

| Comando | Descrizione |
|---|---|
| `npm start` | Avvia Metro Bundler, mostra il QR code per Expo Go |
| `npm run android` | Avvia il progetto puntando a un emulatore/dispositivo Android collegato |
| `npm run ios` | Avvia il progetto puntando a un simulatore iOS (richiede macOS) |

## Struttura del progetto

```
App.js                        # Entry point: ThemeProvider + NavigationContainer + Stack Navigator
index.js                      # Registrazione del componente root (richiesta da Expo)
src/
  components/
    MultipleChoiceAnswer.js   # UI modalità "scelta multipla"
    FreeTextAnswer.js         # UI modalità "risposta libera" con autocomplete
    RegionMapAnswer.js        # Wrapper mappa regioni con feedback testuale
    ItalyRegionMap.js         # Mappa SVG interattiva delle 20 regioni
    ProvinceMapAnswer.js      # Wrapper mappa province con feedback testuale
    ProvinceMap.js            # Mappa SVG delle province di UNA regione (modalità Comuni minori)
    ModeStatsChart.js         # Grafico a barre % risposte corrette per modalità
  constants/
    modes.js                  # Elenco modalità di gioco (id, etichetta, descrizione)
    survivalTheme.js          # Palette rosso/nero dedicata alla modalità Showdown
  context/
    ThemeContext.js           # useContext per tema chiaro/scuro (con persistenza)
  data/
    cities.js                 # Dataset città → provincia → regione (+ flag minor)
    italyRegionsMap.js        # Path SVG semplificati dei confini regionali
    provincesByRegion.js      # Path SVG dei confini provinciali, raggruppati per regione
  hooks/
    useGame.js                # Logica di gioco (punteggio, domande, verifica risposte, log risposte)
  screens/
    HomeScreen.js             # Selezione modalità + ultimo risultato + grafico + toggle tema
    RegionPickerScreen.js     # Scelta della regione (solo modalità Comuni minori)
    GameScreen.js              # Schermata di gioco (domanda + risposta)
    ResultsScreen.js           # Riepilogo fine partita
    ReportScreen.js            # Report dettagliato delle risposte dell'ultimo round
  storage/
    scores.js                 # Lettura/scrittura AsyncStorage (punteggio, storico, statistiche)
```

## Note tecniche

- **Dataset geografico**: 951 città distribuite su tutte le 107 province italiane — 481 "maggiori" e **470 flaggate `minor: true`** (comuni minori, usati dalla modalità "Comuni minori" insieme alle città maggiori della stessa regione). Creato manualmente incrociando conoscenza geografica generale e, per la Toscana, l'elenco completo dei comuni da Wikipedia/ISTAT — utile verificarne l'accuratezza se si nota qualche imprecisione.
- **Mappa delle regioni e delle province**: i confini SVG sono stati generati semplificando (algoritmo di Douglas-Peucker) i dati geografici di [openpolis/geojson-italy](https://github.com/openpolis/geojson-italy) (dati ISTAT, pubblico dominio), mantenendo solo la sagoma principale di ogni regione/provincia (isole minori escluse per leggerezza). Le 4 vecchie sub-province sarde pre-2016 (Sulcis Iglesiente, Medio Campidano, Ogliastra, Gallura Nord-Est Sardegna) sono state unite in un unico contorno "Sud Sardegna" tramite hull convesso, per allinearsi alla provincia attuale.
- **Modalità "risposta libera"**: il tasto Invio compila sempre con il **primo suggerimento** disponibile (non con il testo digitato "as-is"), come richiesto in fase di progettazione.
- **Safe area**: l'icona del tema (Home) e l'header con domanda/punteggio (Game) usano `useSafeAreaInsets` di `react-native-safe-area-context` per non sovrapporsi alla status bar/notch del dispositivo.

## Funzionalità future

Idee non implementate per mancanza di tempo, potenziali sviluppi futuri:

- Schermata "storico partite" (i dati sono già salvati in `AsyncStorage` tramite `getHistory()` in `src/storage/scores.js`, ma non ancora mostrati in UI)
- Timer per domanda e bonus di punteggio per le risposte rapide / streak di risposte corrette consecutive
- Leaderboard online (richiederebbe un backend/servizio terze parti, es. Firebase)
- Suoni ed effetti haptic sulla risposta corretta/sbagliata
- Localizzazione multilingua (attualmente solo italiano)
- Miglioramento dell'accessibilità della mappa SVG (etichette per screen reader sulle singole regioni)
- Test automatici (unit test sulla logica di `useGame`, test di integrazione sulle schermate)

## Riferimenti utili

- [Documentazione Expo](https://docs.expo.dev/)
- [Documentazione React Native](https://reactnative.dev/docs/getting-started)
- [React Navigation — Getting started](https://reactnavigation.org/docs/getting-started)
- [React Navigation — useContext / theming](https://reactnavigation.org/docs/themes/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage)
- [openpolis/geojson-italy](https://github.com/openpolis/geojson-italy) — dataset geografico italiano (regioni/province/comuni) usato per la mappa
- [Elenco province italiane — ISTAT](https://www.istat.it/it/archivio/6789)
