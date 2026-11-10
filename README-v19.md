# Klaslokaal v19 — nieuwe classroom-preview

Deze versie vervangt de iframe van `/legacy/index.html` op de pagina `/klaslokaal` door een nieuwe Next.js classroom.

## Wel werkend
- Groot tekenbord met pen, kleuren, gum, pendikte, undo, wissen en PNG-download.
- Automatisch lokaal opslaan van het tekenbord, apart per leerling-ID (via `/klaslokaal?student=...`).
- Lesnotities per leerling blijven gekoppeld aan bestaande v18 leerlingprofielen.
- PDF tijdelijk openen in een viewer onder het canvas.
- Compacte werkbalk en uitklapbaar notitiepaneel.

## Nog niet werkend / niet claimen
- Geen videochat of realtime gedeeld canvas in de nieuwe interface. De oude v15-pagina blijft als bron in `public/legacy/index.html`, maar wordt niet meer als iframe geladen.
- Geen Supabase/cloudopslag, leerlinglogin of cross-device sync. localStorage is beperkt en browsergebonden.
- PDF-bestanden worden niet opgeslagen; alleen tijdens de huidige sessie weergegeven.
- Geen automatische lesstatistieken of AI-rapportage.

## Installatie
Pak de ZIP uit en upload **de inhoud** van `Klaslokaal2-main/` naar de root van de GitHub-repository Klaslokaal2. Controleer de Vercel build. Laat het oorspronkelijke v15-project ongemoeid.

## Let op
Deze preview is niet geschikt voor echte leerlinggegevens. Maak eerst een back-up van je huidige repository en test in een aparte branch of deployment.
