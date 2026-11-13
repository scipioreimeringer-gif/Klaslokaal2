# v23 — Huiswerk en AI-conceptfeedback

1. Upload deze volledige map naar de TESTBRANCH `Klaslokaal22`.
2. Voer `supabase/v23-homework.sql` uit in Supabase SQL Editor. LET OP: de Preview-branch gebruikt mogelijk dezelfde Supabase-database als productie; maak vooraf een backup.
3. In docentprofiel `/leerlingen`: maak een conceptopdracht en publiceer die.
4. In leerlingdashboard `/mijn-profiel`: leerling schrijft antwoorden of uploadt PDF/JPG/PNG/TXT (max 10MB) en levert in.
5. Docent opent inzending, vraagt AI-conceptfeedback aan, bewerkt de tekst en klikt op 'Keur goed en publiceer'.

AI beoordeelt **alleen getypte antwoorden**, geen bijlagen. AI start **niet automatisch** na inlevering. Geen lesopname, transcriptie of automatische lesnotities in deze versie. De docent publiceert feedback handmatig. OpenAI API key moet als `OPENAI_API_KEY` in Vercel staan voor de AI-functie; zonder key blijft handmatige feedback werken. Gebruik voor echte leerlinggegevens eerst een aparte testdatabase en test de RLS-toegang.

Er is geen Vercel-build of browser-E2E-test uitgevoerd in deze omgeving.
