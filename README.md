# Indovina la Provincia

App mobile in **React Native (Expo)** per allenarsi sulla geografia italiana: viene mostrato il nome di una città italiana e bisogna indovinare in quale **provincia** (o **regione**) si trova, in tre modalità di gioco diverse. Il punteggio viene salvato in locale sul dispositivo.

## Funzionalità

Un round è composto da **10 domande**, ciascuna con una città italiana scelta a caso dal dataset.

Tre modalità di gioco, selezionabili dalla Home:

1. **Scelta multipla** — 4 opzioni tra cui scegliere la provincia corretta.
2. **Risposta libera** — si scrive il nome della provincia; mentre si digita vengono suggerite in tempo reale le province compatibili con il testo inserito, e premendo **Invio** si compila automaticamente il campo con il primo suggerimento disponibile e si invia la risposta.
3. **Regione sulla mappa** — viene mostrata una mappa interattiva dell'Italia (SVG con confini reali delle regioni) e si tocca direttamente la regione in cui si pensa si trovi la città.

Altre funzionalità:

- **Tema chiaro/scuro**, con un pulsante in Home, persistito tra le sessioni tramite `useContext` + AsyncStorage.
- Feedback visivo immediato (verde/rosso) su ogni risposta, con rivelazione della risposta corretta quando si sbaglia.

## Stack tecnico

- [Expo](https://expo.dev/) (SDK 57) + React Native, **JavaScript** (no TypeScript)
- [React Navigation](https://reactnavigation.org/) (`@react-navigation/native` + `native-stack`) per la navigazione tra le schermate Home → Game → Results
- `useContext` per il tema chiaro/scuro ([`src/context/ThemeContext.js`](src/context/ThemeContext.js))
- `useState` / `useEffect` (logica di gioco, fetch del punteggio salvato, ecc.)
- [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/) per la persistenza locale del punteggio
- [`react-native-svg`](https://github.com/software-mansion/react-native-svg) per la mappa interattiva delle regioni

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

## Funzionalità future

- Report delle risposte a fine partita
- Statistiche per modalità di gioco
- Ulteriori modalità di gioco

## Riferimenti utili

- [Documentazione Expo](https://docs.expo.dev/)
- [Documentazione React Native](https://reactnative.dev/docs/getting-started)
- [React Navigation — Getting started](https://reactnavigation.org/docs/getting-started)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/docs/usage)
