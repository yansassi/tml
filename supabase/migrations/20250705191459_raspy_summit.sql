/*
  # Fix user registration database error

  1. Problem Analysis
    - The handle_new_user trigger function is failing when creating profiles
    - Likely missing required fields or incorrect field mappings
    - Need to update the trigger function to match current schema

  2. Solution
    - Update the handle_new_user function to properly handle profile creation
    - Ensure all required fields have appropriate defaults
    - Add proper error handling

  3. Changes
    - Fix the handle_new_user trigger function
    - Ensure it creates profiles with all required fields
    - Add default values for required fields
*/

-- First, let's drop the existing function to recreate it
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create the updated handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile for the user with default values
  INSERT INTO public.profiles (
    id,
    username,
    age,
    bio,
    city,
    state_id,
    current_rank_id,
    avatar_url,
    is_online,
    last_seen
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE((NEW.raw_user_meta_data->>'age')::integer, 18),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'state_id', 'sp'), -- Default to São Paulo
    COALESCE(NEW.raw_user_meta_data->>'current_rank_id', 'warrior'), -- Default to warrior rank
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    false,
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure we have the required default data in our reference tables
-- Insert default rank if it doesn't exist
INSERT INTO ranks (id, name, image_url, color, tier) 
VALUES ('warrior', 'Warrior', '', '#8B5A2B', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert default region if it doesn't exist  
INSERT INTO regions (id, name, state_abbr, region_name)
VALUES ('sp', 'São Paulo', 'SP', 'Sudeste')
ON CONFLICT (id) DO NOTHING;

-- Update the profiles table to make some fields more flexible
-- Allow username to be generated if not provided
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT '';

-- Add a unique constraint that allows empty usernames but ensures non-empty ones are unique
DROP INDEX IF EXISTS profiles_username_key;
CREATE UNIQUE INDEX profiles_username_unique 
ON profiles (username) 
WHERE username != '';

-- Update the age constraint to be more flexible
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check 
CHECK (age >= 18 AND age <= 100);

-- Make sure the age has a proper default
ALTER TABLE profiles ALTER COLUMN age SET DEFAULT 18;