-- MIGRATION SCRIPT
-- Purpose: Remove 'ON DELETE CASCADE' from expenses -> members foreign key.
-- This ensures that deleting a member does not automatically delete their expenses.

-- 1. Drop the existing foreign key constraint
-- The default name for this constraint in Supabase/Postgres is usually 'expenses_member_id_fkey'.
ALTER TABLE public.expenses
DROP CONSTRAINT IF EXISTS expenses_member_id_fkey;

-- 2. Add the new foreign key constraint WITHOUT 'ON DELETE CASCADE'
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_member_id_fkey
FOREIGN KEY (member_id)
REFERENCES public.members (id)
ON DELETE NO ACTION; -- This prevents deletion of a member if they still have expenses (logic handled in App.tsx)

-- 3. Ensure the Trigger is up to date (this part is safe to run multiple times)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.members (user_id, name, email, role)
  values (
    new.id, 
    coalesce(
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name', 
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1), 
      'Member'
    ), 
    new.email, 
    'Admin'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Re-create trigger just in case
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
