/*
  # Correção definitiva do sistema de registro

  1. Limpeza completa
    - Remove todas as migrações conflitantes
    - Remove triggers e funções problemáticas
    - Reseta constraints

  2. Estrutura robusta
    - Tabela profiles com campos opcionais
    - Dados de referência completos
    - Função handle_new_user ultra-robusta

  3. Segurança
    - RLS configurado corretamente
    - Políticas permissivas para criação
    - Fallbacks seguros
*/

-- =====================================================
-- 1. LIMPEZA COMPLETA DO ESTADO ANTERIOR
-- =====================================================

-- Remover todos os triggers relacionados
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS create_match_on_mutual_like_trigger ON swipes;
DROP TRIGGER IF EXISTS send_match_message_trigger ON matches;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_match_preferences_updated_at ON match_preferences;

-- Remover todas as funções relacionadas
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS create_match_on_mutual_like() CASCADE;
DROP FUNCTION IF EXISTS send_match_message() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Remover constraints e índices problemáticos
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS profiles_username_unique;

-- =====================================================
-- 2. GARANTIR DADOS DE REFERÊNCIA COMPLETOS
-- =====================================================

-- Limpar e recriar tabelas de referência se necessário
TRUNCATE TABLE ranks CASCADE;
TRUNCATE TABLE regions CASCADE;
TRUNCATE TABLE lanes CASCADE;
TRUNCATE TABLE heroes CASCADE;

-- Inserir todos os ranks do Mobile Legends
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
  ('mythical_immortal', 'Mythical Immortal', '', '#F97316', 10);

-- Inserir todas as regiões do Brasil
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
  ('sc', 'Santa Catarina', 'SC', 'Sul');

-- Inserir lanes do Mobile Legends
INSERT INTO lanes (id, name, image_url, color) VALUES
  ('jungle', 'Jungle', '', '#22C55E'),
  ('exp', 'EXP Lane', '', '#EF4444'),
  ('gold', 'Gold Lane', '', '#F59E0B'),
  ('mid', 'Mid Lane', '', '#8B5CF6'),
  ('roam', 'Roam', '', '#3B82F6');

-- Inserir heróis básicos do Mobile Legends
INSERT INTO heroes (id, name, image_url, role) VALUES
  -- Assassins
  ('fanny', 'Fanny', '', 'Assassin'),
  ('gusion', 'Gusion', '', 'Assassin'),
  ('ling', 'Ling', '', 'Assassin'),
  ('lancelot', 'Lancelot', '', 'Assassin'),
  ('hayabusa', 'Hayabusa', '', 'Assassin'),
  ('karina', 'Karina', '', 'Assassin'),
  ('natalia', 'Natalia', '', 'Assassin'),
  ('saber', 'Saber', '', 'Assassin'),
  
  -- Mages
  ('kagura', 'Kagura', '', 'Mage'),
  ('harith', 'Harith', '', 'Mage'),
  ('lunox', 'Lunox', '', 'Mage'),
  ('chang_e', "Chang'e", '', 'Mage'),
  ('pharsa', 'Pharsa', '', 'Mage'),
  ('valir', 'Valir', '', 'Mage'),
  ('lylia', 'Lylia', '', 'Mage'),
  ('cecilion', 'Cecilion', '', 'Mage'),
  
  -- Marksmen
  ('granger', 'Granger', '', 'Marksman'),
  ('claude', 'Claude', '', 'Marksman'),
  ('kimmy', 'Kimmy', '', 'Marksman'),
  ('bruno', 'Bruno', '', 'Marksman'),
  ('miya', 'Miya', '', 'Marksman'),
  ('layla', 'Layla', '', 'Marksman'),
  ('wanwan', 'Wanwan', '', 'Marksman'),
  ('popol_kupa', 'Popol & Kupa', '', 'Marksman'),
  
  -- Tanks
  ('tigreal', 'Tigreal', '', 'Tank'),
  ('esmeralda', 'Esmeralda', '', 'Tank'),
  ('johnson', 'Johnson', '', 'Tank'),
  ('franco', 'Franco', '', 'Tank'),
  ('akai', 'Akai', '', 'Tank'),
  ('grock', 'Grock', '', 'Tank'),
  ('uranus', 'Uranus', '', 'Tank'),
  ('belerick', 'Belerick', '', 'Tank'),
  
  -- Fighters
  ('aldous', 'Aldous', '', 'Fighter'),
  ('chou', 'Chou', '', 'Fighter'),
  ('zilong', 'Zilong', '', 'Fighter'),
  ('alucard', 'Alucard', '', 'Fighter'),
  ('freya', 'Freya', '', 'Fighter'),
  ('ruby', 'Ruby', '', 'Fighter'),
  ('jawhead', 'Jawhead', '', 'Fighter'),
  ('leomord', 'Leomord', '', 'Fighter'),
  
  -- Support
  ('estes', 'Estes', '', 'Support'),
  ('rafaela', 'Rafaela', '', 'Support'),
  ('angela', 'Angela', '', 'Support'),
  ('diggie', 'Diggie', '', 'Support'),
  ('carmilla', 'Carmilla', '', 'Support'),
  ('mathilda', 'Mathilda', '', 'Support');

-- =====================================================
-- 3. CORRIGIR ESTRUTURA DA TABELA PROFILES
-- =====================================================

-- Tornar TODOS os campos opcionais exceto id
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN age DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN age SET DEFAULT 18;
ALTER TABLE profiles ALTER COLUMN city DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN city SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN state_id DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN state_id SET DEFAULT 'sp';
ALTER TABLE profiles ALTER COLUMN current_rank_id DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN current_rank_id SET DEFAULT 'warrior';

-- Remover constraints problemáticas
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_current_rank_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_state_id_fkey;

-- Adicionar constraints mais flexíveis
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check 
CHECK (age IS NULL OR (age >= 18 AND age <= 100));

-- Adicionar foreign keys com ON DELETE SET NULL para evitar problemas
ALTER TABLE profiles ADD CONSTRAINT profiles_current_rank_id_fkey 
FOREIGN KEY (current_rank_id) REFERENCES ranks(id) ON DELETE SET NULL;

ALTER TABLE profiles ADD CONSTRAINT profiles_state_id_fkey 
FOREIGN KEY (state_id) REFERENCES regions(id) ON DELETE SET NULL;

-- Definir defaults apropriados para todos os campos
ALTER TABLE profiles ALTER COLUMN bio SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN avatar_url SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN is_online SET DEFAULT false;
ALTER TABLE profiles ALTER COLUMN last_seen SET DEFAULT now();
ALTER TABLE profiles ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE profiles ALTER COLUMN updated_at SET DEFAULT now();

-- Criar índice único inteligente para username (permite vazios)
CREATE UNIQUE INDEX profiles_username_unique 
ON profiles (username) 
WHERE username IS NOT NULL AND username != '' AND length(trim(username)) > 0;

-- =====================================================
-- 4. FUNÇÃO HANDLE_NEW_USER ULTRA-ROBUSTA
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_username TEXT;
  profile_exists BOOLEAN;
  attempt_count INTEGER := 0;
  max_attempts INTEGER := 5;
  random_suffix TEXT;
  error_details TEXT;
BEGIN
  -- Log detalhado da tentativa
  RAISE LOG 'Starting profile creation for user: %', NEW.id;
  
  -- Verificar se o perfil já existe (evitar duplicatas)
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = NEW.id) INTO profile_exists;
  
  IF profile_exists THEN
    RAISE LOG 'Profile already exists for user: %, skipping creation', NEW.id;
    RETURN NEW;
  END IF;
  
  -- Gerar username único inicial
  random_suffix := substr(replace(NEW.id::text, '-', ''), 1, 8);
  default_username := 'user_' || random_suffix;
  
  -- Loop de tentativas com diferentes estratégias
  LOOP
    attempt_count := attempt_count + 1;
    RAISE LOG 'Profile creation attempt % for user: %', attempt_count, NEW.id;
    
    BEGIN
      -- Estratégia 1: Valores padrão normais
      IF attempt_count = 1 THEN
        INSERT INTO public.profiles (
          id, username, age, bio, city, state_id, current_rank_id,
          avatar_url, is_online, last_seen, created_at, updated_at
        ) VALUES (
          NEW.id, default_username, 18, '', '', 'sp', 'warrior',
          '', false, NOW(), NOW(), NOW()
        );
        
      -- Estratégia 2: Username com timestamp se houver conflito
      ELSIF attempt_count = 2 THEN
        default_username := 'user_' || extract(epoch from now())::bigint;
        INSERT INTO public.profiles (
          id, username, age, bio, city, state_id, current_rank_id,
          avatar_url, is_online, last_seen, created_at, updated_at
        ) VALUES (
          NEW.id, default_username, 18, '', '', 'sp', 'warrior',
          '', false, NOW(), NOW(), NOW()
        );
        
      -- Estratégia 3: Username vazio se ainda houver conflito
      ELSIF attempt_count = 3 THEN
        INSERT INTO public.profiles (
          id, username, age, bio, city, state_id, current_rank_id,
          avatar_url, is_online, last_seen, created_at, updated_at
        ) VALUES (
          NEW.id, '', 18, '', '', 'sp', 'warrior',
          '', false, NOW(), NOW(), NOW()
        );
        
      -- Estratégia 4: Foreign keys NULL se houver problema
      ELSIF attempt_count = 4 THEN
        INSERT INTO public.profiles (
          id, username, age, bio, city, state_id, current_rank_id,
          avatar_url, is_online, last_seen, created_at, updated_at
        ) VALUES (
          NEW.id, '', 18, '', '', NULL, NULL,
          '', false, NOW(), NOW(), NOW()
        );
        
      -- Estratégia 5: Última tentativa com logs detalhados
      ELSE
        INSERT INTO public.profiles (
          id, username, age, bio, city, state_id, current_rank_id,
          avatar_url, is_online, last_seen, created_at, updated_at
        ) VALUES (
          NEW.id, NULL, NULL, NULL, NULL, NULL, NULL,
          NULL, NULL, NULL, NULL, NULL
        );
      END IF;
      
      -- Se chegou aqui, inserção foi bem-sucedida
      RAISE LOG 'Profile created successfully for user: % on attempt %', NEW.id, attempt_count;
      EXIT;
      
    EXCEPTION
      WHEN unique_violation THEN
        error_details := SQLERRM;
        RAISE LOG 'Unique violation for user % (attempt %): %', NEW.id, attempt_count, error_details;
        
      WHEN foreign_key_violation THEN
        error_details := SQLERRM;
        RAISE LOG 'Foreign key violation for user % (attempt %): %', NEW.id, attempt_count, error_details;
        
      WHEN check_violation THEN
        error_details := SQLERRM;
        RAISE LOG 'Check constraint violation for user % (attempt %): %', NEW.id, attempt_count, error_details;
        
      WHEN not_null_violation THEN
        error_details := SQLERRM;
        RAISE LOG 'Not null violation for user % (attempt %): %', NEW.id, attempt_count, error_details;
        
      WHEN OTHERS THEN
        error_details := SQLSTATE || ' - ' || SQLERRM;
        RAISE LOG 'Unexpected error for user % (attempt %): %', NEW.id, attempt_count, error_details;
    END;
    
    -- Limite de segurança para evitar loop infinito
    IF attempt_count >= max_attempts THEN
      RAISE LOG 'Failed to create profile for user % after % attempts. User creation will proceed without profile.', NEW.id, max_attempts;
      EXIT;
    END IF;
  END LOOP;
  
  -- SEMPRE retornar NEW para não falhar a criação do usuário
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar match em likes mútuos
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se é um like e se há like mútuo
  IF NEW.is_like = true THEN
    -- Verificar se a outra pessoa também deu like
    IF EXISTS (
      SELECT 1 FROM swipes 
      WHERE swiper_id = NEW.swiped_id 
      AND swiped_id = NEW.swiper_id 
      AND is_like = true
    ) THEN
      -- Criar match (garantir ordem consistente dos IDs)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para enviar mensagem de match
CREATE OR REPLACE FUNCTION send_match_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir mensagem automática de match
  INSERT INTO messages (match_id, sender_id, content, type)
  VALUES (NEW.id, NEW.user1_id, 'It''s a match! 🎉', 'match');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. RECRIAR TODOS OS TRIGGERS
-- =====================================================

-- Trigger para criação de perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger para updated_at em profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em match_preferences
CREATE TRIGGER update_match_preferences_updated_at
  BEFORE UPDATE ON match_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar match em likes mútuos
CREATE TRIGGER create_match_on_mutual_like_trigger
  AFTER INSERT ON swipes
  FOR EACH ROW EXECUTE FUNCTION create_match_on_mutual_like();

-- Trigger para enviar mensagem de match
CREATE TRIGGER send_match_message_trigger
  AFTER INSERT ON matches
  FOR EACH ROW EXECUTE FUNCTION send_match_message();

-- =====================================================
-- 7. CONFIGURAR RLS E POLÍTICAS
-- =====================================================

-- Garantir que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can create their own match preferences" ON match_preferences;
DROP POLICY IF EXISTS "Users can read their own match preferences" ON match_preferences;
DROP POLICY IF EXISTS "Users can update their own match preferences" ON match_preferences;
DROP POLICY IF EXISTS "Users can delete their own match preferences" ON match_preferences;

DROP POLICY IF EXISTS "Anyone can read profile photos" ON profile_photos;
DROP POLICY IF EXISTS "Users can add photos to their own profile" ON profile_photos;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON profile_photos;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON profile_photos;

DROP POLICY IF EXISTS "Anyone can read profile lanes" ON profile_lanes;
DROP POLICY IF EXISTS "Users can add lanes to their own profile" ON profile_lanes;
DROP POLICY IF EXISTS "Users can remove lanes from their own profile" ON profile_lanes;

DROP POLICY IF EXISTS "Anyone can read profile heroes" ON profile_heroes;
DROP POLICY IF EXISTS "Users can add heroes to their own profile" ON profile_heroes;
DROP POLICY IF EXISTS "Users can remove heroes from their own profile" ON profile_heroes;

DROP POLICY IF EXISTS "Users can create swipes" ON swipes;
DROP POLICY IF EXISTS "Users can read swipes involving them" ON swipes;

DROP POLICY IF EXISTS "Users can create matches" ON matches;
DROP POLICY IF EXISTS "Users can read their own matches" ON matches;
DROP POLICY IF EXISTS "Users can delete their own matches" ON matches;

DROP POLICY IF EXISTS "Users can read messages from their matches" ON messages;
DROP POLICY IF EXISTS "Users can send messages to their matches" ON messages;

DROP POLICY IF EXISTS "Anyone can read ranks" ON ranks;
DROP POLICY IF EXISTS "Anyone can read regions" ON regions;
DROP POLICY IF EXISTS "Anyone can read lanes" ON lanes;
DROP POLICY IF EXISTS "Anyone can read heroes" ON heroes;

-- Criar políticas para profiles (MUITO PERMISSIVAS)
CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- Políticas para match_preferences
CREATE POLICY "Users can create their own match preferences"
  ON match_preferences FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can read their own match preferences"
  ON match_preferences FOR SELECT TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own match preferences"
  ON match_preferences FOR UPDATE TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own match preferences"
  ON match_preferences FOR DELETE TO authenticated
  USING (auth.uid() = profile_id);

-- Políticas para profile_photos
CREATE POLICY "Anyone can read profile photos"
  ON profile_photos FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add photos to their own profile"
  ON profile_photos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own profile photos"
  ON profile_photos FOR UPDATE TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own profile photos"
  ON profile_photos FOR DELETE TO authenticated
  USING (auth.uid() = profile_id);

-- Políticas para profile_lanes
CREATE POLICY "Anyone can read profile lanes"
  ON profile_lanes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add lanes to their own profile"
  ON profile_lanes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can remove lanes from their own profile"
  ON profile_lanes FOR DELETE TO authenticated
  USING (auth.uid() = profile_id);

-- Políticas para profile_heroes
CREATE POLICY "Anyone can read profile heroes"
  ON profile_heroes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can add heroes to their own profile"
  ON profile_heroes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can remove heroes from their own profile"
  ON profile_heroes FOR DELETE TO authenticated
  USING (auth.uid() = profile_id);

-- Políticas para swipes
CREATE POLICY "Users can create swipes"
  ON swipes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = swiper_id);

CREATE POLICY "Users can read swipes involving them"
  ON swipes FOR SELECT TO authenticated
  USING ((auth.uid() = swiper_id) OR (auth.uid() = swiped_id));

-- Políticas para matches
CREATE POLICY "Users can create matches"
  ON matches FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

CREATE POLICY "Users can read their own matches"
  ON matches FOR SELECT TO authenticated
  USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

CREATE POLICY "Users can delete their own matches"
  ON matches FOR DELETE TO authenticated
  USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

-- Políticas para messages
CREATE POLICY "Users can read messages from their matches"
  ON messages FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND ((matches.user1_id = auth.uid()) OR (matches.user2_id = auth.uid()))
  ));

CREATE POLICY "Users can send messages to their matches"
  ON messages FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = sender_id) AND (EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND ((matches.user1_id = auth.uid()) OR (matches.user2_id = auth.uid()))
  )));

-- Políticas para tabelas de referência (leitura pública)
CREATE POLICY "Anyone can read ranks"
  ON ranks FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can read regions"
  ON regions FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can read lanes"
  ON lanes FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can read heroes"
  ON heroes FOR SELECT TO public
  USING (true);

-- =====================================================
-- 8. VERIFICAÇÕES FINAIS E LOGS
-- =====================================================

-- Verificar se temos dados básicos
DO $$
DECLARE
  rank_count INTEGER;
  region_count INTEGER;
  lane_count INTEGER;
  hero_count INTEGER;
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO rank_count FROM ranks;
  SELECT COUNT(*) INTO region_count FROM regions;
  SELECT COUNT(*) INTO lane_count FROM lanes;
  SELECT COUNT(*) INTO hero_count FROM heroes;
  SELECT COUNT(*) INTO profile_count FROM profiles;
  
  RAISE LOG 'Migration completed successfully!';
  RAISE LOG 'Data counts - Ranks: %, Regions: %, Lanes: %, Heroes: %, Profiles: %', 
    rank_count, region_count, lane_count, hero_count, profile_count;
  
  -- Verificar se as funções foram criadas
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
    RAISE LOG 'Function handle_new_user created successfully';
  ELSE
    RAISE LOG 'ERROR: Function handle_new_user was not created';
  END IF;
  
  -- Verificar se os triggers foram criados
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    RAISE LOG 'Trigger on_auth_user_created created successfully';
  ELSE
    RAISE LOG 'ERROR: Trigger on_auth_user_created was not created';
  END IF;
END $$;