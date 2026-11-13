# v25 — compactere lesruimte en duidelijke login

- Compacte bovenbalk, volledige schermhoogte voor het bestaande v16-iframe.
- Veiligheidswaarschuwing beschikbaar onder `ⓘ Testversie` in plaats van permanent groot blok.
- Login toont keuze leerling/docent, met Google of e-mail magic link. De keuze bepaalt alleen de uitleg: de werkelijke rol komt uitsluitend uit Supabase `profiles.role`. Geen rolverhoging op basis van UI.
- Bestaande functies en database ongewijzigd. Geen SQL nodig.

**Beperkingen:** De legacy lesruimte heeft nog geen veilige leerling-authenticatie en tenant-isolatie. De login-keuze is geen aparte autorisatie. Laat geen echte leerlingen in de legacy ruimte toe voordat dit is opgelost.
