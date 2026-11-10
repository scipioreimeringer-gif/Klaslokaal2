# Klaslokaal 2.0 — aparte testbasis (v16 start)

## Wat werkt in deze eerste oplevering
- Nieuwe Next.js App Router basis met dashboard en navigatie.
- Originele v15 classroom bereikbaar via `/klaslokaal` of `/legacy/index.html`.
- Originele v15 API-handlers gekopieerd naar `pages/api/data.js` en `pages/api/ai.js`.
- Demo voor afzonderlijke leerlingnotities in browser-localStorage (niet de bestaande v15 canvasdata).

## Wat nog NIET gebouwd is
- Veilige docent-/leerlingaccounts, Supabase, online autosave voor het nieuwe dashboard.
- Volledige canvasmigratie, quizzen, huiswerk, agenda, AI-lesanalyse, audio-opnames, e-mail, betalingen.
- De v15-functies zijn overgenomen maar niet end-to-end getest met echte camera, PeerJS of Vercel.

## Lokaal draaien
1. Installeer Node.js 20.9+.
2. Open deze map in een terminal.
3. `npm install`
4. Kopieer `.env.example` naar `.env.local`, vul zelf je bestaande Vercel-waarden in.
5. `npm run dev`
6. Open `http://localhost:3000`.

## Veilig online testen
1. Maak een **nieuwe** GitHub-repository, niet je bestaande v15-repository.
2. Upload deze projectmap naar de nieuwe repository.
3. Importeer deze repository in Vercel als **nieuw project**.
4. Voeg de vereiste omgevingsvariabelen toe aan het nieuwe Vercel-project.
5. Gebruik voor een veilige test bij voorkeur een **aparte Redis-database**. Anders wijst de testomgeving naar dezelfde leerlinggegevens als productie.
6. Scherm de testomgeving af voordat je echte leerlinggegevens gebruikt. De nieuwe dashboardprototype heeft nog geen toegangscontrole.

## Belangrijke beperkingen
De bestaande v15-HTML heeft een `<base href="/">` gekregen zodat `api/data` en `api/ai` vanuit `/legacy/index.html` naar de originele API-paden verwijzen. Verder is het HTML-bestand ongewijzigd. De originele API-handlers zijn inhoudelijk ongewijzigd. De classroom kan het beste rechtstreeks op `/legacy/index.html` worden geopend als camera- of schermdeling in de iframe beperkt is.

## Volgende ontwikkelstap
1. Automatische tests en regressietests voor v15.
2. Supabase-project en RLS-datamodel met docent-, leerling-, canvas- en pagina-tabellen.
3. Read-only import van bestaande v15 Redis-data en expliciete migratie.
4. Echte canvas-editor met opslag en conflictbehandeling per leerling.
5. Pas daarna accounts, leerlingportaal, huiswerk, agenda en AI-analyse.
