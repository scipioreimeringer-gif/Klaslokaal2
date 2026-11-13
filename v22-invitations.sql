-- v22: run AFTER schema.sql and v21-approval.sql. Does not overwrite existing student data.
create extension if not exists pgcrypto with schema extensions;
alter table public.students add column if not exists user_id uuid references auth.users(id) on delete set null;
create unique index if not exists students_teacher_user_unique on public.students(teacher_id,user_id) where user_id is not null;
create table if not exists public.student_invitations (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references public.students(id) on delete cascade,
 teacher_id uuid not null references public.profiles(id) on delete cascade,
 token_hash text not null unique,
 expires_at timestamptz not null default now()+interval '7 days',
 claimed_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists invitations_teacher_idx on public.student_invitations(teacher_id);
alter table public.student_invitations enable row level security;
-- No direct client read/write policies: only the verified RPC functions below can access tokens.
create or replace function public.create_student_invitation(target_student uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare secret text;
begin
 if not public.is_teacher() then raise exception 'Only teachers can invite students'; end if;
 if not exists(select 1 from public.students where id=target_student and teacher_id=auth.uid()) then
  raise exception 'Student not found';
 end if;
 secret := replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','');
 insert into public.student_invitations(student_id,teacher_id,token_hash)
 values(target_student,auth.uid(),encode(extensions.digest(secret,'sha256'),'hex'));
 return secret;
end; $$;
revoke all on function public.create_student_invitation(uuid) from public;
grant execute on function public.create_student_invitation(uuid) to authenticated;
create or replace function public.claim_student_invitation(invitation_token text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare inv record; account_email text; student_email text;
begin
 if auth.uid() is null then raise exception 'Log in first'; end if;
 if invitation_token is null or length(invitation_token)<>64 then raise exception 'Invalid invitation'; end if;
 select i.id,i.student_id,i.teacher_id into inv
 from public.student_invitations i
 where i.token_hash=encode(extensions.digest(invitation_token,'sha256'),'hex')
 and i.claimed_at is null and i.expires_at>now() for update;
 if not found then raise exception 'Invitation expired or already used'; end if;
 select lower(email) into account_email from auth.users where id=auth.uid();
 select lower(email) into student_email from public.students where id=inv.student_id and teacher_id=inv.teacher_id;
 if account_email is null or account_email<>student_email then
  raise exception 'Log in with the email address invited by your teacher';
 end if;
 if exists(select 1 from public.students where id=inv.student_id and user_id is not null and user_id<>auth.uid()) then
  raise exception 'This student profile is already linked to another account';
 end if;
 update public.students set user_id=auth.uid(),updated_at=now() where id=inv.student_id;
 update public.student_invitations set claimed_at=now() where id=inv.id;
 return inv.student_id;
end; $$;
revoke all on function public.claim_student_invitation(text) from public;
grant execute on function public.claim_student_invitation(text) to authenticated;
-- Student access is based on their verified auth UID, not a guessed URL or editable email.
drop policy if exists "student reads own records" on public.students;
create policy "student reads linked records" on public.students for select to authenticated using (user_id=auth.uid());
-- Explicitly no student UPDATE privileges on these records; teacher controls publication.
