-- Run AFTER schema.sql. Keep this migration in your private project repository.
-- Step 1: explicitly designate your own EXISTING teacher account as admin.
-- Replace the email below with the email you actually used to sign in.
-- DO NOT run until the address has been replaced.
-- update public.profiles set role='admin' where email='REPLACE_WITH_YOUR_EMAIL' and role='teacher';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin','teacher','student','pending_teacher','rejected_teacher'));

-- Default new Google accounts remain students; they may request teacher access.
create or replace function public.request_teacher_access() returns void
language plpgsql security definer set search_path = '' as $$
begin
 update public.profiles set role='pending_teacher'
 where id=(select auth.uid()) and role in ('student','rejected_teacher');
 if not found then
  raise exception 'Account not eligible for teacher application';
 end if;
end; $$;
revoke all on function public.request_teacher_access() from public;
grant execute on function public.request_teacher_access() to authenticated;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Admins can read teacher applications, but not other teachers' student records.
drop policy if exists "admin reads teacher applications" on public.profiles;
create policy "admin reads teacher applications" on public.profiles for select to authenticated
 using (public.is_admin() and role in ('pending_teacher','teacher','rejected_teacher','admin'));

create or replace function public.review_teacher_application(target_id uuid, approve boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if not public.is_admin() then raise exception 'Not authorized'; end if;
 update public.profiles set role=(case when approve then 'teacher' else 'rejected_teacher' end)
 where id=target_id and role='pending_teacher';
 if not found then raise exception 'Pending application not found'; end if;
end; $$;
revoke all on function public.review_teacher_application(uuid,boolean) from public;
grant execute on function public.review_teacher_application(uuid,boolean) to authenticated;

-- Allow admin to use teacher tools for their own students, not others'.
create or replace function public.is_teacher() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id=(select auth.uid()) and role in ('teacher','admin'));
$$;
revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;
