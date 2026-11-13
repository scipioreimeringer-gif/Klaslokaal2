# Klaslokaal 2.0 v22 — leerlinguitnodigingen

## Installatie
1. Upload deze complete projectinhoud naar de **testbranch Klaslokaal22** (niet main).
2. In Supabase SQL Editor: voer `supabase/v22-invitations.sql` uit **na** `schema.sql` en `v21-approval.sql` (die eerder al uitgevoerd moeten zijn).
3. Supabase Authentication → Providers: Google actief; Email ingeschakeld, met OTP/magic link e-mails. Controleer mailverzendlimieten en SMTP voor productie.
4. Supabase Authentication → URL Configuration: voeg de exacte Vercel Preview-URL met `/**` toe. Behoud de productie-URL.
5. Vercel Preview: behoud NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
6. Log in als docent/admin → Leerlingen → selecteer leerling → Uitnodigingslink maken. Stuur die privé naar het **e-mailadres dat in het leerlingprofiel staat**.
7. Leerling opent link → Google of e-maillink → na verificatie `/mijn-profiel`.

## Veiligheid en beperkingen
- Token is willekeurig, 7 dagen geldig en éénmalig te claimen. Alleen SHA-256-hash staat in de database.
- Koppelen vereist een ingelogde gebruiker met exact het e-mailadres dat de docent voor de leerling heeft ingevoerd.
- De leerling krijgt alleen SELECT-rechten op gekoppelde `students` records via RLS. Geen bewerkingsrechten.
- AI-analyse, opnames, voortgangsgrafieken, huiswerkuploads, leslinks en koppeling van het oude live-klaslokaal zijn **nog niet geïmplementeerd**.
- Bestaande velden `notes`, `goals`, `homework`, `history` worden aan de leerling getoond: zet hier alleen feedback in die je wilt publiceren. Voor toekomstige AI-concepten komt een aparte tabel met goedkeuring.
- Preview en productie hebben afzonderlijke browsersessies. E-mailmagiclinks kunnen door e-mailbeveiligingsscanners vooraf geopend worden; Supabase PKCE/OTP-verificatie kan hiervoor later worden aangescherpt.
- Geen leerlinggegevens gebruiken in de testomgeving totdat de rechten en de gehele app grondig getest zijn. De Preview deelt momenteel dezelfde Supabase-database tenzij een aparte testdatabase is geconfigureerd.
