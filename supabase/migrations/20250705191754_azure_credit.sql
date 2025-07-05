/*
  # Comprehensive fix for user registration issues

  1. Database Setup
    - Ensure all required reference data exists
    - Fix any constraint issues
    - Update trigger function with better error handling

  2. Changes
    - Add all required ranks and regions
    - Fix the handle_new_user function
    - Make profile creation more robust
    - Add proper error handling

  3. Security
    - Maintain RLS policies
    - Ensure proper permissions
*/

-- First, let's ensure we have all the required reference data

-- Insert all Mobile Legends ranks
INSERT INTO ranks (id, name, image_url, color, tier) VALUES
  ('warrior', 'Warrior', '', '#8B5A2B', 1),
  ('elite', 'Elite', '', '#C0C0C0', 2),
  ('master', 'Master', '', '#CD7F32', 3),
  ('grandmaster', 'Grandmaster', '', '#FFD700', 4),
  ('epic', 'Epic', '', '#8B5CF6', 5),
  ('legend', 'Legend', '', '#F59E0B', 6),
  ('mythic', 'Mythic', '', '#EF4444', 7),
  ('mythical_honor', 'Mythical Honor', '', '#06B6D4', 8),
  ('mythical_glory', 'Mythical Glory', '', '#10B981', 9),
  ('mythical_immortal', 'Mythical Immortal', '', '#F97316', 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color,
  tier = EXCLUDED.tier;

-- Insert all Brazilian regions
INSERT INTO regions (id, name, state_abbr, region_name) VALUES
  -- Norte
  ('ac', 'Acre', 'AC', 'Norte'),
  ('ap', 'Amapá', 'AP', 'Norte'),
  ('am', 'Amazonas', 'AM', 'Norte'),
  ('pa', 'Pará', 'PA', 'Norte'),
  ('ro', 'Rondônia', 'RO', 'Norte'),
  ('rr', 'Roraima', 'RR', 'Norte'),
  ('to', 'Tocantins', 'TO', 'Norte'),
  
  -- Nordeste
  ('al', 'Alagoas', 'AL', 'Nordeste'),
  ('ba', 'Bahia', 'BA', 'Nordeste'),
  ('ce', 'Ceará', 'CE', 'Nordeste'),
  ('ma', 'Maranhão', 'MA', 'Nordeste'),
  ('pb', 'Paraíba', 'PB', 'Nordeste'),
  ('pe', 'Pernambuco', 'PE', 'Nordeste'),
  ('pi', 'Piauí', 'PI', 'Nordeste'),
  ('rn', 'Rio Grande do Norte', 'RN', 'Nordeste'),
  ('se', 'Sergipe', 'SE', 'Nordeste'),
  
  -- Centro-Oeste
  ('go', 'Goiás', 'GO', 'Centro-Oeste'),
  ('mt', 'Mato Grosso', 'MT', 'Centro-Oeste'),
  ('ms', 'Mato Grosso do Sul', 'MS', 'Centro-Oeste'),
  ('df', 'Distrito Federal', 'DF', 'Centro-Oeste'),
  
  -- Sudeste
  ('es', 'Espírito Santo', 'ES', 'Sudeste'),
  ('mg', 'Minas Gerais', 'MG', 'Sudeste'),
  ('rj', 'Rio de Janeiro', 'RJ', 'Sudeste'),
  ('sp', 'São Paulo', 'SP', 'Sudeste'),
  
  -- Sul
  ('pr', 'Paraná', 'PR', 'Sul'),
  ('rs', 'Rio Grande do Sul', 'RS', 'Sul'),
  ('sc', 'Santa Catarina', 'SC', 'Sul')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  state_abbr = EXCLUDED.state_abbr,
  region_name = EXCLUDED.region_name;

-- Insert basic lanes
INSERT INTO lanes (id, name, image_url, color) VALUES
  ('jungle', 'Jungle', '', '#22C55E'),
  ('exp', 'EXP Lane', '', '#EF4444'),
  ('gold', 'Gold Lane', '', '#F59E0B'),
  ('mid', 'Mid Lane', '', '#8B5CF6'),
  ('roam', 'Roam', '', '#3B82F6')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color;

-- Insert basic heroes
INSERT INTO heroes (id, name, image_url, role) VALUES
  ('fanny', 'Fanny', '', 'Assassin'),
  ('gusion', 'Gusion', '', 'Assassin'),
  ('kagura', 'Kagura', '', 'Mage'),
  ('granger', 'Granger', '', 'Marksman'),
  ('tigreal', 'Tigreal', '', 'Tank'),
  ('angela', 'Angela', '', 'Support')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Now let's fix the profiles table constraints
-- Make username nullable and add a better unique constraint
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT '';

-- Drop existing username constraint and create a better one
DROP INDEX IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS profiles_username_unique;

-- Create a unique constraint that allows multiple empty usernames but ensures non-empty ones are unique
CREATE UNIQUE INDEX profiles_username_unique 
ON profiles (username) 
WHERE username IS NOT NULL AND username != '';

-- Make sure age has proper constraints and defaults
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check 
CHECK (age >= 18 AND age <= 100);
ALTER TABLE profiles ALTER COLUMN age SET DEFAULT 18;

-- Make city nullable with default
ALTER TABLE profiles ALTER COLUMN city DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN city SET DEFAULT '';

-- Now let's recreate the handle_new_user function with better error handling
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_username TEXT;
  profile_exists BOOLEAN;
BEGIN
  -- Check if profile already exists (prevent duplicates)
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = NEW.id) INTO profile_exists;
  
  IF profile_exists THEN
    RETURN NEW;
  END IF;
  
  -- Generate a unique username
  default_username := 'user_' || substr(NEW.id::text, 1, 8);
  
  -- Insert a new profile for the user with safe defaults
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
    default_username,
    18, -- Default age
    '', -- Empty bio
    '', -- Empty city
    'sp', -- Default to São Paulo
    'warrior', -- Default to warrior rank
    '', -- Empty avatar URL
    false, -- Not online by default
    NOW() -- Current timestamp
  );
  
  RETURN NEW;
EXCEPTION
  WHEN foreign_key_violation THEN
    -- If foreign key constraint fails, try with different defaults
    BEGIN
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
        default_username,
        18,
        '',
        '',
        (SELECT id FROM regions LIMIT 1), -- Use any available region
        (SELECT id FROM ranks ORDER BY tier LIMIT 1), -- Use lowest tier rank
        '',
        false,
        NOW()
      );
      RETURN NEW;
    EXCEPTION
      WHEN OTHERS THEN
        -- Log the error but don't fail user creation
        RAISE LOG 'Error creating profile for user % (attempt 2): %', NEW.id, SQLERRM;
        RETURN NEW;
    END;
  WHEN unique_violation THEN
    -- If username already exists, try with a different one
    BEGIN
      default_username := 'user_' || substr(NEW.id::text, 1, 8) || '_' || extract(epoch from now())::text;
      
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
        default_username,
        18,
        '',
        '',
        'sp',
        'warrior',
        '',
        false,
        NOW()
      );
      RETURN NEW;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE LOG 'Error creating profile for user % (unique violation): %', NEW.id, SQLERRM;
        RETURN NEW;
    END;
  WHEN OTHERS THEN
    -- Log any other error but don't fail user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure RLS is enabled and policies are correct
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies to be more permissive for profile creation
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Make sure other policies exist
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);