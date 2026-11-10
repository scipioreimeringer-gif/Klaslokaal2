# Klaslokaal 2.0 — v21 (docentgoedkeuring)

1. Upload deze projectbestanden naar de **nieuwe** Klaslokaal2 GitHub-repository (niet je oude v15-project).
2. In Supabase → SQL Editor: open `supabase/v21-approval.sql`. Voer eerst de SQL uit zonder de laatste, uitgecommentarieerde admin-update.
3. Zet vervolgens **alleen jouw eigen bestaande docentaccount** om naar beheerder:
   `update public.profiles set role='admin' where email='JOUW_ECHTE_EMAIL' and role='teacher' returning email,role;`
4. Wacht tot Vercel klaar is met deployen. Log uit en weer in, open `/beheer`.
5. Test met een **ander Google-account**: log in, klik `Docenttoegang aanvragen`, en keur de aanvraag vanuit jouw beheerdersaccount goed.

Veiligheid: een gebruiker kan de rol niet zelf wijzigen; een docentaanvraag gaat via een beperkte databasefunctie en goedkeuring vereist adminrechten. Docenten zien alleen eigen leerlingrecords via bestaande RLS-regels.

Let op: dit is de **eerste v21-stap** (rollen en goedkeuring), nog niet het live videobellen of realtime gedeelde canvas.
