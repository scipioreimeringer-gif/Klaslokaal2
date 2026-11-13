-- Run once after v22-invitations.sql. Uses existing student-to-teacher and student-to-user links.
create table if not exists public.assignments (
 id uuid primary key default gen_random_uuid(), student_id uuid not null references public.students(id) on delete cascade,
 title text not null, instructions text not null, created_at timestamptz not null default now(),
 published_at timestamptz, constraint assignment_title_length check (char_length(title) between 1 and 200)
);
create table if not exists public.homework_submissions (
 id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.assignments(id) on delete cascade,
 student_user_id uuid not null references auth.users(id), answer text not null default '',
 file_path text, file_name text, submitted_at timestamptz not null default now(),
 ai_draft text, teacher_feedback text, feedback_published_at timestamptz
);
create index if not exists assignments_student_idx on public.assignments(student_id);
create index if not exists submissions_assignment_idx on public.homework_submissions(assignment_id);
alter table public.assignments enable row level security;
alter table public.homework_submissions enable row level security;
create or replace function public.owns_assignment(aid uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.assignments a join public.students s on s.id=a.student_id where a.id=aid and s.teacher_id=auth.uid() and public.is_teacher());
$$;
create or replace function public.is_assignment_student(aid uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.assignments a join public.students s on s.id=a.student_id where a.id=aid and s.user_id=auth.uid() and a.published_at is not null);
$$;
revoke all on function public.owns_assignment(uuid), public.is_assignment_student(uuid) from public;
grant execute on function public.owns_assignment(uuid), public.is_assignment_student(uuid) to authenticated;
create policy "teachers manage assignments" on public.assignments for all to authenticated using (public.owns_assignment(id)) with check (exists(select 1 from public.students s where s.id=student_id and s.teacher_id=auth.uid() and public.is_teacher()));
create policy "students view published assignments" on public.assignments for select to authenticated using (public.is_assignment_student(id));
create policy "teachers view submissions" on public.homework_submissions for select to authenticated using (public.owns_assignment(assignment_id));
create policy "students view own submissions" on public.homework_submissions for select to authenticated using (student_user_id=auth.uid() and public.is_assignment_student(assignment_id));
create policy "students submit homework" on public.homework_submissions for insert to authenticated with check (student_user_id=auth.uid() and public.is_assignment_student(assignment_id) and ai_draft is null and teacher_feedback is null and feedback_published_at is null);
create policy "teachers update feedback" on public.homework_submissions for update to authenticated using (public.owns_assignment(assignment_id)) with check (public.owns_assignment(assignment_id));
-- Avoid direct student access to draft AI feedback through a row select.
revoke select on public.homework_submissions from authenticated;
grant select (id,assignment_id,student_user_id,answer,file_path,file_name,submitted_at,teacher_feedback,feedback_published_at) on public.homework_submissions to authenticated;
-- Teachers need to access drafts via a separate authenticated RPC.
create or replace function public.teacher_submission_draft(sid uuid) returns text language sql stable security definer set search_path='' as $$
 select h.ai_draft from public.homework_submissions h where h.id=sid and public.owns_assignment(h.assignment_id);
$$;
revoke all on function public.teacher_submission_draft(uuid) from public;
grant execute on function public.teacher_submission_draft(uuid) to authenticated;
-- Teacher can update feedback and drafts via a checked RPC.
create or replace function public.save_homework_review(sid uuid, draft text, feedback text, publish boolean)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.homework_submissions h where h.id=sid and public.owns_assignment(h.assignment_id)) then raise exception 'No access'; end if;
 update public.homework_submissions set ai_draft=case when publish then draft else feedback end, teacher_feedback=case when publish then feedback else null end,
 feedback_published_at=case when publish then now() else null end where id=sid;
end; $$;
revoke all on function public.save_homework_review(uuid,text,text,boolean) from public;
grant execute on function public.save_homework_review(uuid,text,text,boolean) to authenticated;
-- Private bucket; uploads are restricted to a student's own UID prefix.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('homework','homework',false,10485760,array['application/pdf','image/png','image/jpeg','text/plain'])
on conflict(id) do nothing;
create policy "student uploads homework" on storage.objects for insert to authenticated
 with check (bucket_id='homework' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "student reads own homework files" on storage.objects for select to authenticated
 using (bucket_id='homework' and (storage.foldername(name))[1]=auth.uid()::text);
-- Teachers download via signed URLs generated server-side after verifying the assignment.
create policy "teacher reads assigned homework files" on storage.objects for select to authenticated using (
 bucket_id='homework' and exists (
 select 1 from public.homework_submissions h where h.file_path=name and public.owns_assignment(h.assignment_id)
 ));
