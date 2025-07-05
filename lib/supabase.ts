import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Profile {
  id: string;
  username: string;
  age: number;
  bio: string;
  city: string;
  state_id: string;
  current_rank_id: string;
  avatar_url: string;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilePhoto {
  id: string;
  profile_id: string;
  photo_url: string;
  order_index: number;
  created_at: string;
}

export interface Rank {
  id: string;
  name: string;
  image_url: string;
  color: string;
  tier: number;
  created_at: string;
}

export interface Lane {
  id: string;
  name: string;
  image_url: string;
  color: string;
  created_at: string;
}

export interface Hero {
  id: string;
  name: string;
  image_url: string;
  role: string;
  created_at: string;
}

export interface Region {
  id: string;
  name: string;
  state_abbr: string;
  region_name: string;
  created_at: string;
}

export interface MatchPreferences {
  profile_id: string;
  min_age: number;
  max_age: number;
  max_distance: number;
  only_show_online: boolean;
  preferred_ranks: string[];
  preferred_regions: string[];
  preferred_heroes: string[];
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  type: string;
  created_at: string;
}

export interface Swipe {
  id: string;
  swiper_id: string;
  swiped_id: string;
  is_like: boolean;
  created_at: string;
}

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helper functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_photos(*),
      profile_lanes(lane_id, lanes(*)),
      profile_heroes(hero_id, heroes(*)),
      regions(*)
    `)
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const createProfile = async (profile: Omit<Profile, 'created_at' | 'updated_at' | 'is_online' | 'last_seen'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();
  
  return { data, error };
};

// Discovery helper functions
export const getDiscoveryProfiles = async (userId: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_photos(*),
      profile_lanes(lane_id, lanes(*)),
      profile_heroes(hero_id, heroes(*)),
      regions(*)
    `)
    .neq('id', userId)
    .not('id', 'in', `(
      SELECT swiped_id FROM swipes WHERE swiper_id = '${userId}'
    )`)
    .limit(limit);
  
  return { data, error };
};

// Swipe helper functions
export const createSwipe = async (swiperId: string, swipedId: string, isLike: boolean) => {
  const { data, error } = await supabase
    .from('swipes')
    .insert({
      swiper_id: swiperId,
      swiped_id: swipedId,
      is_like: isLike,
    })
    .select()
    .single();
  
  return { data, error };
};

// Match helper functions
export const getUserMatches = async (userId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:profiles!matches_user1_id_fkey(*),
      user2:profiles!matches_user2_id_fkey(*)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Message helper functions
export const getMatchMessages = async (matchId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(*)
    `)
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });
  
  return { data, error };
};

export const sendMessage = async (matchId: string, senderId: string, content: string, type: string = 'text') => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: senderId,
      content,
      type,
    })
    .select()
    .single();
  
  return { data, error };
};

// Static data helper functions
export const getRanks = async () => {
  const { data, error } = await supabase
    .from('ranks')
    .select('*')
    .order('tier', { ascending: true });
  
  return { data, error };
};

export const getLanes = async () => {
  const { data, error } = await supabase
    .from('lanes')
    .select('*');
  
  return { data, error };
};

export const getHeroes = async () => {
  const { data, error } = await supabase
    .from('heroes')
    .select('*')
    .order('name', { ascending: true });
  
  return { data, error };
};

export const getRegions = async () => {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name', { ascending: true });
  
  return { data, error };
};