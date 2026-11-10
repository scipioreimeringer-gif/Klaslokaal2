# Klaslokaal v20 — Google login + Supabase

## What is implemented
- Google OAuth through Supabase; session persisted by supabase-js.
- Every new account defaults to `student`. Only database administrator can promote a teacher.
- Teacher dashboard and Supabase-backed student profiles. Teacher adds student by their Google email.
- Student dashboard displays ONLY their own records, homework and goals, enforced by database RLS.
- Teacher notes and goals/homework/history saved in Supabase. Classroom notes use Supabase.
- Existing canvas still stores image in browser localStorage; it is **NOT** cloud synced or shared live.
- No live video, lesson recording, speech metrics, or AI homework yet.

## Setup
1. In Supabase SQL Editor run `supabase/schema.sql` (once). This creates tables, a new-user trigger, and RLS policies.
2. In Vercel Project Klaslokaal2 add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for Production/Preview/Development. **Never** expose a Supabase secret key.
3. In Supabase Authentication → Providers → Google set OAuth client ID and client secret; use callback `https://YOUR_PROJECT.supabase.co/auth/v1/callback` in Google Cloud.
4. In Supabase Authentication → URL Configuration set your exact Vercel Site URL and redirect allow list.
5. Deploy this source to Klaslokaal2 and sign in once with YOUR Google account.
6. In Supabase SQL Editor promote ONLY your account with: `update public.profiles set role='teacher' where email='YOUR_EMAIL@gmail.com';` (replace placeholder). Sign out and sign in again.
7. Add student with the email they use to sign in. They will see their own profile once signed in.

**Security**: RLS policies protect student rows. Do not use real student data before testing both roles, policies, and privacy. Teacher email promotion is deliberately manual to prevent self-assigned teacher privileges. OAuth in Google testing mode requires adding test users. Rotate any Google Client Secret exposed in screenshots.

**Limitations**: Not a finished multi-tenant commercial product; notes save immediately per keystroke (future version should debounce); student canvas still local; no cross-device canvas sync; no live class or recording. Old v15 files are retained under `public/legacy` but not embedded.
