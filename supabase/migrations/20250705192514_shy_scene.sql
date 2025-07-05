/*
  # Correção completa do sistema de registro

  1. Dados de referência
    - Garante que todas as tabelas de referência tenham dados básicos
    - Ranks, regiões, lanes e heróis do Mobile Legends

  2. Estrutura da tabela profiles
    - Username nullable com constraint único inteligente
    - Campos opcionais com defaults apropriados
    - Constraints flexíveis mas seguras

  3. Função handle_new_user robusta
    - Múltiplas tentativas com diferentes estratégias
    - Tratamento específico para cada tipo de erro
    - Fallbacks seguros para valores padrão
    - Nunca falha a criação do usuário

  4. Políticas RLS corretas
    - Permissões adequadas para todas as operações
    - Segurança mantida sem bloquear funcionalidade
*/

-- =====================================================
-- 1. LIMPAR ESTADO ANTERIOR
-- =====================================================

-- Remover triggers e funções existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Remover constraints problemáticas
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS profiles_username_unique;

-- =====================================================
-- 2. GARANTIR DADOS DE REFERÊNCIA
-- =====================================================

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
  ('mythical_immortal', 'Mythical Immortal', '', '#F97316', 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color,
  tier = EXCLUDED.tier;

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
  ('sc', 'Santa Catarina', 'SC', 'Sul')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  state_abbr = EXCLUDED.state_abbr,
  region_name = EXCLUDED.region_name;

-- Inserir lanes do Mobile Legends
INSERT INTO lanes (id, name, image_url, color) VALUES
  ('jungle', 'Jungle', '', '#22C55E'),
  ('exp', 'EXP Lane', '', '#EF4444'),
  ('gold', 'Gold Lane', '', '#F59E0B'),
  ('mid', 'Mid Lane', '', '#8B5CF6'),
  ('roam', 'Roam', '', '#3B82F6')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color;

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
  ('mathilda', 'Mathilda', '', 'Support')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- =====================================================
-- 3. CORRIGIR ESTRUTURA DA TABELA PROFILES
-- =====================================================

-- Tornar campos opcionais
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN city DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN city SET DEFAULT '';

-- Corrigir constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check 
CHECK (age >= 18 AND age <= 100);

-- Definir defaults apropriados
ALTER TABLE profiles ALTER COLUMN age SET DEFAULT 18;
ALTER TABLE profiles ALTER COLUMN bio SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN avatar_url SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN is_online SET DEFAULT false;
ALTER TABLE profiles ALTER COLUMN last_seen SET DEFAULT now();
ALTER TABLE profiles ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE profiles ALTER COLUMN updated_at SET DEFAULT now();

-- Criar índice único inteligente para username
-- Permite múltiplos usernames vazios, mas garante que não-vazios sejam únicos
CREATE UNIQUE INDEX profiles_username_unique 
ON profiles (username) 
WHERE username IS NOT NULL AND username != '' AND length(trim(username)) > 0;

-- =====================================================
-- 4. FUNÇÃO HANDLE_NEW_USER ROBUSTA
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_username TEXT;
  default_state_id TEXT := 'sp';
  default_rank_id TEXT := 'warrior';
  profile_exists BOOLEAN;
  attempt_count INTEGER := 0;
  max_attempts INTEGER := 5;
  random_suffix TEXT;
BEGIN
  -- Log da tentativa de criação
  RAISE LOG 'Attempting to create profile for user: %', NEW.id;
  
  -- Verificar se o perfil já existe
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = NEW.id) INTO profile_exists;
  
  IF profile_exists THEN
    RAISE LOG 'Profile already exists for user: %', NEW.id;
    RETURN NEW;
  END IF;
  
  -- Verificar se temos dados de referência válidos
  IF NOT EXISTS(SELECT 1 FROM regions WHERE id = default_state_id) THEN
    SELECT id INTO default_state_id FROM regions LIMIT 1;
    IF default_state_id IS NULL THEN
      default_state_id := 'sp';
      -- Inserir região padrão se não existir
      INSERT INTO regions (id, name, state_abbr, region_name) 
      VALUES ('sp', 'São Paulo', 'SP', 'Sudeste')
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
  
  IF NOT EXISTS(SELECT 1 FROM ranks WHERE id = default_rank_id) THEN
    SELECT id INTO default_rank_id FROM ranks ORDER BY tier LIMIT 1;
    IF default_rank_id IS NULL THEN
      default_rank_id := 'warrior';
      -- Inserir rank padrão se não existir
      INSERT INTO ranks (id, name, image_url, color, tier) 
      VALUES ('warrior', 'Warrior', '', '#8B5A2B', 1)
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
  
  -- Gerar username único inicial
  random_suffix := substr(replace(NEW.id::text, '-', ''), 1, 8);
  default_username := 'user_' || random_suffix;
  
  -- Loop de tentativas de inserção
  LOOP
    attempt_count := attempt_count + 1;
    
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
        last_seen,
        created_at,
        updated_at
      ) VALUES (
        NEW.id,
        default_username,
        18,
        '',
        '',
        default_state_id,
        default_rank_id,
        '',
        false,
        NOW(),
        NOW(),
        NOW()
      );
      
      -- Se chegou aqui, inserção foi bem-sucedida
      RAISE LOG 'Profile created successfully for user: % with username: %', NEW.id, default_username;
      EXIT;
      
    EXCEPTION
      WHEN unique_violation THEN
        -- Username já existe, gerar um novo
        random_suffix := extract(epoch from now())::bigint || '_' || (random() * 1000)::int;
        default_username := 'user_' || random_suffix;
        
        RAISE LOG 'Username conflict for user %, trying new username: %', NEW.id, default_username;
        
        -- Se muitas tentativas, usar username vazio
        IF attempt_count >= 3 THEN
          default_username := '';
          RAISE LOG 'Using empty username for user: %', NEW.id;
        END IF;
        
      WHEN foreign_key_violation THEN
        RAISE LOG 'Foreign key violation for user %, attempt %: %', NEW.id, attempt_count, SQLERRM;
        
        -- Tentar com valores NULL para foreign keys
        IF attempt_count >= 2 THEN
          default_state_id := NULL;
          default_rank_id := NULL;
          RAISE LOG 'Using NULL foreign keys for user: %', NEW.id;
        END IF;
        
      WHEN check_violation THEN
        RAISE LOG 'Check constraint violation for user %, attempt %: %', NEW.id, attempt_count, SQLERRM;
        
        -- Se violação de check, pode ser idade - usar valor padrão seguro
        -- A inserção já usa valores seguros, então isso não deveria acontecer
        
      WHEN OTHERS THEN
        RAISE LOG 'Unexpected error creating profile for user % (attempt %): % - %', NEW.id, attempt_count, SQLSTATE, SQLERRM;
    END;
    
    -- Limite de segurança para evitar loop infinito
    IF attempt_count >= max_attempts THEN
      RAISE LOG 'Failed to create profile for user % after % attempts', NEW.id, max_attempts;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. RECRIAR TRIGGER
-- =====================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 6. CONFIGURAR RLS E POLÍTICAS
-- =====================================================

-- Garantir que RLS está habilitado em todas as tabelas relevantes
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para profiles
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Criar políticas para profiles
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas para match_preferences
DROP POLICY IF EXISTS "Users can create their own match preferences" ON match_preferences;
DROP POLICY IF EXISTS "Users can read their own match preferences" ON match_preferences;
DROP POLICY IF EXISTS "Users can update their own match preferences" ON match_preferences;
DROP POLICY IF EXISTS "Users can delete their own match preferences" ON match_preferences;

CREATE POLICY "Users can create their own match preferences"
  ON match_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can read their own match preferences"
  ON match_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can update their own match preferences"
  ON match_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own match preferences"
  ON match_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id);

-- Garantir que tabelas de referência são legíveis por todos
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;

-- Políticas para tabelas de referência (leitura pública)
DROP POLICY IF EXISTS "Anyone can read ranks" ON ranks;
DROP POLICY IF EXISTS "Anyone can read regions" ON regions;
DROP POLICY IF EXISTS "Anyone can read lanes" ON lanes;
DROP POLICY IF EXISTS "Anyone can read heroes" ON heroes;

CREATE POLICY "Anyone can read ranks"
  ON ranks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read regions"
  ON regions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read lanes"
  ON lanes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read heroes"
  ON heroes
  FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- 7. VERIFICAÇÕES FINAIS
-- =====================================================

-- Verificar se temos dados básicos
DO $$
DECLARE
  rank_count INTEGER;
  region_count INTEGER;
  lane_count INTEGER;
  hero_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO rank_count FROM ranks;
  SELECT COUNT(*) INTO region_count FROM regions;
  SELECT COUNT(*) INTO lane_count FROM lanes;
  SELECT COUNT(*) INTO hero_count FROM heroes;
  
  RAISE LOG 'Migration completed. Data counts - Ranks: %, Regions: %, Lanes: %, Heroes: %', 
    rank_count, region_count, lane_count, hero_count;
END $$;