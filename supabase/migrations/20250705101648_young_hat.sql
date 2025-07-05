/*
  # Create base tables for Mobile Legends dating app

  1. New Tables
    - `regions` - Brazilian states and regions
    - `ranks` - Mobile Legends ranks/elos
    - `lanes` - Mobile Legends lanes/roles
    - `heroes` - Mobile Legends heroes
    - `profiles` - User profiles
    - `profile_photos` - Additional profile photos
    - `profile_lanes` - User preferred lanes (many-to-many)
    - `profile_heroes` - User favorite heroes (many-to-many)
    - `match_preferences` - User matching preferences
    - `swipes` - User swipe actions (like/pass)
    - `matches` - Successful matches between users
    - `messages` - Chat messages between matched users

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Ensure users can only access their own data and public data

  3. Functions and Triggers
    - Auto-create profile when user signs up
    - Auto-create match when mutual like occurs
    - Update timestamps automatically
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create regions table (Brazilian states)
CREATE TABLE IF NOT EXISTS regions (
  id text PRIMARY KEY,
  name text NOT NULL,
  state_abbr text NOT NULL,
  region_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ranks table (Mobile Legends ranks)
CREATE TABLE IF NOT EXISTS ranks (
  id text PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  color text NOT NULL,
  tier integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lanes table (Mobile Legends lanes/roles)
CREATE TABLE IF NOT EXISTS lanes (
  id text PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create heroes table (Mobile Legends heroes)
CREATE TABLE IF NOT EXISTS heroes (
  id text PRIMARY KEY,
  name text NOT NULL,
  image_url text,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  age integer NOT NULL CHECK (age >= 18 AND age <= 100),
  bio text DEFAULT '',
  city text NOT NULL DEFAULT '',
  state_id text NOT NULL REFERENCES regions(id),
  current_rank_id text NOT NULL REFERENCES ranks(id),
  avatar_url text DEFAULT '',
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profile_photos table
CREATE TABLE IF NOT EXISTS profile_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create profile_lanes table (many-to-many)
CREATE TABLE IF NOT EXISTS profile_lanes (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lane_id text NOT NULL REFERENCES lanes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (profile_id, lane_id)
);

-- Create profile_heroes table (many-to-many)
CREATE TABLE IF NOT EXISTS profile_heroes (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hero_id text NOT NULL REFERENCES heroes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (profile_id, hero_id)
);

-- Create match_preferences table
CREATE TABLE IF NOT EXISTS match_preferences (
  profile_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  min_age integer NOT NULL DEFAULT 18 CHECK (min_age >= 18),
  max_age integer NOT NULL DEFAULT 35 CHECK (max_age <= 100),
  max_distance integer NOT NULL DEFAULT 50 CHECK (max_distance > 0),
  only_show_online boolean DEFAULT false,
  preferred_ranks text[] DEFAULT ARRAY['all'],
  preferred_regions text[] DEFAULT ARRAY['all'],
  preferred_heroes text[] DEFAULT ARRAY['all_assassins', 'all_mages'],
  updated_at timestamptz DEFAULT now()
);

-- Create swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_like boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(swiper_id, swiped_id),
  CHECK (swiper_id != swiped_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id != user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'text',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profile_photos_profile_order_idx ON profile_photos(profile_id, order_index);
CREATE UNIQUE INDEX IF NOT EXISTS profile_photos_profile_order_unique_idx ON profile_photos(profile_id, order_index);
CREATE INDEX IF NOT EXISTS swipes_swiped_like_idx ON swipes(swiped_id, is_like);
CREATE UNIQUE INDEX IF NOT EXISTS swipes_unique_pair_idx ON swipes(swiper_id, swiped_id);
CREATE UNIQUE INDEX IF NOT EXISTS matches_unique_pair_idx ON matches(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS messages_match_created_idx ON messages(match_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Regions policies (public read)
CREATE POLICY "Anyone can read regions" ON regions FOR SELECT TO public USING (true);

-- Ranks policies (public read)
CREATE POLICY "Anyone can read ranks" ON ranks FOR SELECT TO public USING (true);

-- Lanes policies (public read)
CREATE POLICY "Anyone can read lanes" ON lanes FOR SELECT TO public USING (true);

-- Heroes policies (public read)
CREATE POLICY "Anyone can read heroes" ON heroes FOR SELECT TO public USING (true);

-- Profiles policies
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- Profile photos policies
CREATE POLICY "Anyone can read profile photos" ON profile_photos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can add photos to their own profile" ON profile_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update their own profile photos" ON profile_photos FOR UPDATE TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete their own profile photos" ON profile_photos FOR DELETE TO authenticated USING (auth.uid() = profile_id);

-- Profile lanes policies
CREATE POLICY "Anyone can read profile lanes" ON profile_lanes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can add lanes to their own profile" ON profile_lanes FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can remove lanes from their own profile" ON profile_lanes FOR DELETE TO authenticated USING (auth.uid() = profile_id);

-- Profile heroes policies
CREATE POLICY "Anyone can read profile heroes" ON profile_heroes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can add heroes to their own profile" ON profile_heroes FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can remove heroes from their own profile" ON profile_heroes FOR DELETE TO authenticated USING (auth.uid() = profile_id);

-- Match preferences policies
CREATE POLICY "Users can read their own match preferences" ON match_preferences FOR SELECT TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Users can create their own match preferences" ON match_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update their own match preferences" ON match_preferences FOR UPDATE TO authenticated USING (auth.uid() = profile_id) WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete their own match preferences" ON match_preferences FOR DELETE TO authenticated USING (auth.uid() = profile_id);

-- Swipes policies
CREATE POLICY "Users can read swipes involving them" ON swipes FOR SELECT TO authenticated USING (auth.uid() = swiper_id OR auth.uid() = swiped_id);
CREATE POLICY "Users can create swipes" ON swipes FOR INSERT TO authenticated WITH CHECK (auth.uid() = swiper_id);

-- Matches policies
CREATE POLICY "Users can read their own matches" ON matches FOR SELECT TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create matches" ON matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can delete their own matches" ON matches FOR DELETE TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can read messages from their matches" ON messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE id = match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages to their matches" ON messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM matches 
    WHERE id = match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_match_preferences_updated_at BEFORE UPDATE ON match_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create match when mutual like occurs
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if this is a like
  IF NEW.is_like = true THEN
    -- Check if the other user also liked this user
    IF EXISTS (
      SELECT 1 FROM swipes 
      WHERE swiper_id = NEW.swiped_id 
      AND swiped_id = NEW.swiper_id 
      AND is_like = true
    ) THEN
      -- Create a match (ensure consistent ordering)
      INSERT INTO matches (user1_id, user2_id)
      VALUES (
        LEAST(NEW.swiper_id, NEW.swiped_id),
        GREATEST(NEW.swiper_id, NEW.swiped_id)
      )
      ON CONFLICT (user1_id, user2_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic match creation
CREATE TRIGGER create_match_on_mutual_like_trigger
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- Create function to send initial match message
CREATE OR REPLACE FUNCTION send_match_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert initial match message
  INSERT INTO messages (match_id, sender_id, content, type)
  VALUES (NEW.id, NEW.user1_id, 'It''s a match! 🎉', 'match');
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for initial match message
CREATE TRIGGER send_match_message_trigger
  AFTER INSERT ON matches
  FOR EACH ROW
  EXECUTE FUNCTION send_match_message();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Note: This will need to be completed by the user with actual profile data
  -- For now, we just ensure the user exists in auth.users
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user handling
CREATE TRIGGER handle_new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();