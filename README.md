# OPERATION THESIS

Sito statico mobile-first per un quiz scherzoso di cybersecurity.

## Avvio locale
1. Estrai lo ZIP.
2. Apri la cartella in Visual Studio Code.
3. Installa l'estensione **Live Server**.
4. Tasto destro su `index.html` > **Open with Live Server**.

Puoi anche aprire `index.html` direttamente nel browser, ma Live Server è preferibile.

## Comportamento
- 10 domande effettive, 10 punti ciascuna.
- L'interfaccia mostra un contatore su 15; l'evento scatta dopo la domanda 10.
- Il punteggio massimo è 100.
- Il nickname è l'unico identificativo richiesto.
- Se Supabase non è configurato, la classifica è salvata solo nel browser corrente (modalità demo).
- Con Supabase configurato, i risultati sono condivisi online.

## Attivare la classifica pubblica con Supabase
1. Crea un progetto su https://supabase.com/.
2. Apri **SQL Editor** e incolla il contenuto di `supabase/schema.sql`, quindi esegui.
3. Apri **Project Settings > API** (o Connect/API nella nuova interfaccia).
4. Copia Project URL e chiave pubblica `Publishable` (oppure la legacy `anon`, se il progetto la mostra).
5. Incolla i due valori in `js/config.js`.
6. Ricarica il sito e fai una prova da due browser/dispositivi diversi.

Non inserire mai `service_role` o secret key nel codice del sito. La chiave Publishable è progettata per il browser; le policy RLS e i GRANT limitano le operazioni.

## Pubblicare con GitHub Pages
1. Crea un account GitHub e un nuovo repository pubblico, ad esempio `operation-thesis`.
2. Carica tutti i file e le cartelle mantenendo la struttura.
3. Nel repository vai su **Settings > Pages**.
4. In **Build and deployment**, seleziona **Deploy from a branch**.
5. Seleziona `main` e `/ (root)`, poi **Save**.
6. Attendi la pubblicazione: GitHub mostrerà l'indirizzo del sito nella sezione Pages.

## Importante: limiti della prima versione
- La modalità locale non condivide i risultati tra dispositivi.
- La modalità Supabase con questa configurazione accetta punteggi inviati dal browser: per un quiz tra amici va bene come prototipo, ma un utente esperto potrebbe manipolare la richiesta. Per una classifica competitiva serve validare le risposte e calcolare il punteggio lato server (ad esempio con una Supabase Edge Function).
- I nickname e i punteggi sono pubblici. Non raccogliere dati personali.
- Il finto incidente è solo una schermata del sito: non blocca il telefono, non legge file e non accede al dispositivo.
- Il suono parte solo dopo l'interazione dell'utente e può essere bloccato dalle impostazioni del browser.
