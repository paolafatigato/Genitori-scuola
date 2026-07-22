# 📔 Il Diario Insieme

Sito per il rapporto scuola-famiglia: checklist dello zaino, termometro delle
emozioni e diario del sonno, con collegamento Famiglia ↔ Docente su consenso
esplicito della famiglia.

Progetto Firebase già configurato in `js/firebase-config.js`: **genitori-scuola**.

## Struttura del progetto

```
index.html                  Login Google + scelta ruolo al primo accesso
famiglia/dashboard.html     "Oggi": riepilogo strumenti, codice, richieste
famiglia/zaino.html         Checklist zaino, oggi + storico 30 giorni
famiglia/emozioni.html      Termometro emozioni, oggi + storico
famiglia/sonno.html         Diario del sonno, oggi + storico
famiglia/organizzazione.html Organizzazione e gestione del tempo
famiglia/ansia.html         Tracciamento ansia scolastica
famiglia/attenzione.html    Monitoraggio concentrazione e attenzione
famiglia/autostima.html     Valutazione autostima del bambino
famiglia/impostazioni.html  Nome alunno/a, personalizzazione checklist
docente/dashboard.html      Inserimento codice, elenco famiglie collegate
docente/famiglia.html       Vista sola lettura di una famiglia + commenti
css/style.css                Tutto lo stile del sito
js/firebase-config.js        Le tue credenziali Firebase
js/firebase-init.js          Inizializzazione Firebase (Auth + Firestore)
js/auth.js                   Login, scelta ruolo, protezione delle pagine
js/utils.js                  Date, codice di condivisione, notifiche
firestore.rules              Regole di sicurezza, commentate
firestore.indexes.json       Indice richiesto dalla dashboard Docente
firebase.json / .firebaserc  Configurazione Hosting e progetto
```

Nessun passaggio di build: sono file statici, pronti per l'hosting così come sono.

## 1. Attivare Google Sign-In

1. Console Firebase → **Authentication** → scheda **Sign-in method**.
2. Attiva il provider **Google**.
3. In **Authentication → Settings → Authorized domains**, verifica che ci
   sia il dominio di hosting che userai (per il dominio predefinito
   `genitori-scuola.web.app` / `.firebaseapp.com` è già incluso).

## 2. Creare il database Firestore

1. Console Firebase → **Firestore Database** → **Crea database**.
2. Scegli una regione vicina (es. `eur3 (europe-west)`), modalità **Produzione**
   (le regole scritte in `firestore.rules` sostituiranno quelle di default).

## 3. Installare la Firebase CLI e collegare il progetto

```bash
npm install -g firebase-tools
firebase login
cd diario-insieme      # la cartella di questo progetto
firebase use genitori-scuola
```

## 4. Pubblicare regole e indici Firestore

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

L'indice in `firestore.indexes.json` serve alla dashboard del Docente per
trovare tutte le famiglie collegate a lui (query "collection group" su
`collegamenti`). Senza deploy dell'indice, Firestore mostrerà in console
un errore con un link diretto per crearlo manualmente: funziona comunque,
ma conviene farlo via file per tenerlo versionato.

## 5. Pubblicare il sito

```bash
firebase deploy --only hosting
```

Il sito sarà online su `https://genitori-scuola.web.app`.

## Come funziona il collegamento Famiglia ↔ Docente

1. Alla creazione dell'account, ogni Famiglia riceve un **codice a 6 caratteri**
   (visibile nella dashboard), salvato anche in una piccola mappa separata
   `codici_condivisione/{codice} → uid_famiglia`. Questa mappa non contiene
   dati personali: serve solo a far "trovare" la famiglia a un Docente,
   senza dargli accesso ai suoi dati.
2. Il Docente inserisce il codice → si crea una richiesta in
   `famiglie/{uid}/collegamenti/{uid_docente}` con stato `in_attesa`.
3. La Famiglia vede la richiesta e la accetta o la rifiuta.
4. Solo dopo l'accettazione le regole di sicurezza permettono al Docente di
   leggere (mai scrivere) i dati della famiglia, e di scrivere commenti.
5. La Famiglia può revocare in ogni momento: cancellando il collegamento,
   l'accesso del Docente sparisce immediatamente (le regole lo impediscono).

## Aggiungere un nuovo strumento in futuro

L'architettura è pensata per crescere (organizzazione avanzata, ansia
scolastica, autostima, prevenzione DCA):

1. Aggiungi una nuova sotto-collezione, es. `famiglie/{uid}/voci_ansia/{data}`.
2. Aggiungi le relative regole in `firestore.rules` (stesso schema delle
   altre: lettura a famiglia+docente accettato, scrittura solo famiglia).
3. Aggiungi la voce nella mappa `strumenti_attivi` del documento famiglia.
4. Crea `famiglia/nuovo-strumento.html` copiando la struttura di una pagina
   esistente (stessa `subject-tab`, stesso schema di storico) e aggiungi la
   voce di navigazione nella `bottom-nav` di tutte le pagine famiglia.
5. Se serve, aggiungi la vista corrispondente in sola lettura in
   `docente/famiglia.html`.

## Note e limiti da conoscere

- Il codice di condivisione viene generato lato client: la probabilità di
  collisione tra due famiglie è bassissima ma non nulla. Per un uso su scala
  scolastica va benissimo così; se in futuro servisse una garanzia assoluta
  di unicità, si può spostare la generazione in una Cloud Function.
- Non c'è (ancora) modo di rigenerare il codice o eliminare un account dal
  sito stesso: si può fare da console Firebase se necessario.
- I colori sono presi dalla palette che mi hai indicato: verde per lo zaino,
  petrolio/ciano per il sonno, arancio/rosso per le emozioni, viola per la
  vista Docente, magenta come accento generale — così ogni "materia" ha il
  suo colore, come i divisori di un diario scolastico.
