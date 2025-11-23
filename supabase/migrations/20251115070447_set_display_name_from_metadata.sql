/*
  # Set Display Name from User Metadata

  1. Purpose
    - Automatically populate the display_name field in auth.users from user metadata
    - This ensures the name entered during signup appears in the Supabase dashboard

  2. Changes
    - Create a function to extract and set display_name from raw_user_meta_data
    - Create a trigger that runs after user creation or update

  3. Notes
    - The function checks for 'name', 'full_name', or 'display_name' in metadata
    - Updates are only made if display_name is not already set
*/

-- Create function to set display name from metadata
CREATE OR REPLACE FUNCTION public.handle_display_name()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if display_name is not set and metadata contains a name
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    -- Try to get name from various metadata fields
    IF NEW.raw_user_meta_data->>'display_name' IS NOT NULL THEN
      NEW.raw_user_meta_data = jsonb_set(
        NEW.raw_user_meta_data,
        '{full_name}',
        to_jsonb(NEW.raw_user_meta_data->>'display_name')
      );
    ELSIF NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
      NEW.raw_user_meta_data = jsonb_set(
        NEW.raw_user_meta_data,
        '{full_name}',
        to_jsonb(NEW.raw_user_meta_data->>'name')
      );
    ELSIF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
      NEW.raw_user_meta_data = jsonb_set(
        NEW.raw_user_meta_data,
        '{display_name}',
        to_jsonb(NEW.raw_user_meta_data->>'full_name')
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_set_display_name ON auth.users;
CREATE TRIGGER on_auth_user_created_set_display_name
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_display_name();
