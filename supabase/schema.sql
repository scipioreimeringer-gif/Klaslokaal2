-- Run once in Supabase SQL Editor. Teacher status must be granted manually.
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text not null,
 full_name text,
 role text not null default 'student' check (role in ('teacher','student')),
 created_at timestamptz not null default now()
);
create or replace function public.create_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles(id,email,full_name) values(new.id,lower(coalesce(new.email,'')),new.raw_user_meta_data->>'full_name')
 on conflict(id) do update set email=excluded.email;
 return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_profile();
insert into public.profiles(id,email,full_name)
select id,lower(coalesce(email,'')),raw_user_meta_data->>'full_name' from auth.users
on conflict(id) do nothing;
alter table public.profiles enable row level security;
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select to authenticated using (id=auth.uid());
-- Do NOT allow users to update their own role.
create table if not exists public.students (
 id uuid primary key default gen_random_uuid(),
 teacher_id uuid not null references public.profiles(id) on delete cascade,
 email text not null,
 name text not null,
 subject text not null default '',
 notes text not null default '',
 goals text not null default '',
 homework text not null default '',
 history text not null default '',
 canvas_data text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(teacher_id,email)
);
create index if not exists students_teacher_idx on public.students(teacher_id);
create index if not exists students_email_idx on public.students(lower(email));
alter table public.students enable row level security;
create or replace function public.is_teacher() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='teacher');
$$;
revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;
drop policy if exists "teacher reads own students" on public.students;
create policy "teacher reads own students" on public.students for select to authenticated using (teacher_id=auth.uid() and public.is_teacher());
drop policy if exists "student reads own records" on public.students;
create policy "student reads own records" on public.students for select to authenticated using (lower(email)=lower(coalesce(auth.jwt()->>'email','')));
drop policy if exists "teacher inserts students" on public.students;
create policy "teacher inserts students" on public.students for insert to authenticated with check (teacher_id=auth.uid() and public.is_teacher());
drop policy if exists "teacher updates students" on public.students;
create policy "teacher updates students" on public.students for update to authenticated using (teacher_id=auth.uid() and public.is_teacher()) with check (teacher_id=auth.uid() and public.is_teacher());
drop policy if exists "teacher deletes students" on public.students;
create policy "teacher deletes students" on public.students for delete to authenticated using (teacher_id=auth.uid() and public.is_teacher());
-- After first Google sign-in, manually promote ONLY your own email, e.g.:
-- update public.profiles set role='teacher' where email='your-email@example.com';
