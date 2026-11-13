# Klaslokaal 2.0 — v22 integratiepreview

Deze eerste stap integreert de **v16 lesomgeving** in het bestaande v21 Next.js project via `/klaslokaal/live` en voegt een link toe op `/klaslokaal`.

## Wat werkt in deze stap
- De oorspronkelijke v16 HTML/JS is integraal opgenomen onder `public/legacy/index.html`.
- De docent/beheerder ziet een aparte live-previewpagina vanuit het bestaande dashboard.
- Bestaande Google-login, docentgoedkeuring en Supabase-tabellen zijn niet gewijzigd.

## Wat NOG NIET werkt / veiligheidsbeperkingen
- De iframe-lesomgeving heeft nog de oude opslag en is NIET gekoppeld aan het gekozen Supabase-leerlingprofiel.
- De statische URL `/legacy/index.html` is direct publiek bereikbaar; een client-side rolcheck op de previewpagina beschermt die URL niet.
- De oude leslinks zijn niet beveiligd met leerlinggebonden, kortlevende tokens.
- TURN-credentials staan in de oude clientcode en kunnen publiek zichtbaar zijn. Roteer en vervang deze vóór publieke lancering.
- Geen audio-opnames, huiswerkbeoordeling of AI-voortgangsanalyse.
- De oorspronkelijke `/api/data` en `/api/ai` kunnen nog gedeelde/legacy opslag gebruiken. Niet geschikt voor productie met meerdere docenten.

**Gebruik alleen dummygegevens in een geïsoleerde Vercel Preview-deployment.** Maak een aparte GitHub branch `v22-test`; deploy die als Preview, niet naar `main`/Production. Verifieer dat Preview niet naar de productiedatabase schrijft voordat je gaat testen.

## Test
1. Open Preview-URL `/klaslokaal/live` als docent/beheerder.
2. Controleer video, camera, schermdelen, whiteboard, typen en PDF op laptop.
3. Test mobiel en tweede apparaat met dummygegevens.
4. Noteer eventuele console- en verbindingsfouten.

## Volgende implementatiestap
Supabase-schema voor `lessons`, `lesson_participants`, `boards`, `notes`, `homework`, `assessments` met RLS per docent/leerling; gesigneerde gastlinks; veilige server-side autorisatie voor lesopslag; daarna Realtime en docent-goedkeuring van AI-concepten.
