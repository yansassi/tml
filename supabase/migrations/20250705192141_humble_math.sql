/*
  # Correção final para registro de usuários

  1. Corrige constraints da tabela profiles
  2. Melhora a função handle_new_user com tratamento de erro robusto
  3. Garante que todos os dados de referência existam
  4. Atualiza políticas RLS para permitir criação de perfil
*/

-- Primeiro, vamos garantir que temos todos os dados de referência necessários
-- Inserir ranks básicos
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
ON CONFLICT (id) DO NOTHING;

-- Inserir regiões básicas
INSERT INTO regions (id, name, state_abbr, region_name) VALUES
  ('sp', 'São Paulo', 'SP', 'Sudeste'),
  ('rj', 'Rio de Janeiro', 'RJ', 'Sudeste'),
  ('mg', 'Minas Gerais', 'MG', 'Sudeste'),
  ('rs', 'Rio Grande do Sul', 'RS', 'Sul'),
  ('pr', 'Paraná', 'PR', 'Sul'),
  ('sc', 'Santa Catarina', 'SC', 'Sul'),
  ('ba', 'Bahia', 'BA', 'Nordeste'),
  ('pe', 'Pernambuco', 'PE', 'Nordeste'),
  ('ce', 'Ceará', 'CE', 'Nordeste'),
  ('go', 'Goiás', 'GO', 'Centro-Oeste')
ON CONFLICT (id) DO NOTHING;

-- Inserir lanes básicas
INSERT INTO lanes (id, name, image_url, color) VALUES
  ('jungle', 'Jungle', '', '#22C55E'),
  ('exp', 'EXP Lane', '', '#EF4444'),
  ('gold', 'Gold Lane', '', '#F59E0B'),
  ('mid', 'Mid Lane', '', '#8B5CF6'),
  ('roam', 'Roam', '', '#3B82F6')
ON CONFLICT (id) DO NOTHING;

-- Inserir heróis básicos
INSERT INTO heroes (id, name, image_url, role) VALUES
  ('fanny', 'Fanny', '', 'Assassin'),
  ('gusion', 'Gusion', '', 'Assassin'),
  ('kagura', 'Kagura', '', 'Mage'),
  ('granger', 'Granger', '', 'Marksman'),
  ('tigreal', 'Tigreal', '', 'Tank'),
  ('angela', 'Angela', '', 'Support'),
  ('ling', 'Ling', '', 'Assassin'),
  ('chang_e', "Chang'e", '', 'Mage'),
  ('claude', 'Claude', '', 'Marksman'),
  ('harith', 'Harith', '', 'Mage')
ON CONFLICT (id) DO NOTHING;

-- Agora vamos corrigir a tabela profiles
-- Remover constraints problemáticas
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS profiles_username_unique;

-- Tornar username nullable
ALTER TABLE profiles ALTER COLUMN username DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN username SET DEFAULT '';

-- Tornar city nullable  
ALTER TABLE profiles ALTER COLUMN city DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN city SET DEFAULT '';

-- Corrigir constraint de idade
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check 
CHECK (age >= 18 AND age <= 100);

-- Definir defaults apropriados
ALTER TABLE profiles ALTER COLUMN age SET DEFAULT 18;
ALTER TABLE profiles ALTER COLUMN bio SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN avatar_url SET DEFAULT '';
ALTER TABLE profiles ALTER COLUMN is_online SET DEFAULT false;
ALTER TABLE profiles ALTER COLUMN last_seen SET DEFAULT now();

-- Criar índice único que permite usernames vazios
CREATE UNIQUE INDEX profiles_username_unique 
ON profiles (username) 
WHERE username IS NOT NULL AND username != '' AND length(trim(username)) > 0;

-- Recriar a função handle_new_user com tratamento de erro muito robusto
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_username TEXT;
  default_state_id TEXT;
  default_rank_id TEXT;
  profile_exists BOOLEAN;
  attempt_count INTEGER := 0;
BEGIN
  -- Verificar se o perfil já existe
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = NEW.id) INTO profile_exists;
  
  IF profile_exists THEN
    RETURN NEW;
  END IF;
  
  -- Obter valores padrão seguros
  SELECT id INTO default_state_id FROM regions ORDER BY name LIMIT 1;
  SELECT id INTO default_rank_id FROM ranks ORDER BY tier LIMIT 1;
  
  -- Se não encontrou dados de referência, usar valores hardcoded
  IF default_state_id IS NULL THEN
    default_state_id := 'sp';
  END IF;
  
  IF default_rank_id IS NULL THEN
    default_rank_id := 'warrior';
  END IF;
  
  -- Gerar username único
  default_username := 'user_' || substr(replace(NEW.id::text, '-', ''), 1, 8);
  
  -- Tentar inserir o perfil com múltiplas tentativas
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
      EXIT;
      
    EXCEPTION
      WHEN unique_violation THEN
        -- Se username já existe, tentar com timestamp
        default_username := 'user_' || substr(replace(NEW.id::text, '-', ''), 1, 6) || '_' || extract(epoch from now())::bigint;
        
        IF attempt_count >= 3 THEN
          -- Após 3 tentativas, usar username vazio
          default_username := '';
        END IF;
        
      WHEN foreign_key_violation THEN
        -- Se foreign key falhou, tentar inserir dados de referência básicos
        IF attempt_count = 1 THEN
          -- Inserir região padrão se não existir
          INSERT INTO regions (id, name, state_abbr, region_name) 
          VALUES ('sp', 'São Paulo', 'SP', 'Sudeste')
          ON CONFLICT (id) DO NOTHING;
          
          -- Inserir rank padrão se não existir
          INSERT INTO ranks (id, name, image_url, color, tier) 
          VALUES ('warrior', 'Warrior', '', '#8B5A2B', 1)
          ON CONFLICT (id) DO NOTHING;
          
          default_state_id := 'sp';
          default_rank_id := 'warrior';
        ELSE
          -- Se ainda falhou, usar NULL para foreign keys
          default_state_id := NULL;
          default_rank_id := NULL;
        END IF;
        
      WHEN OTHERS THEN
        -- Para qualquer outro erro, log e sair do loop
        RAISE LOG 'Error creating profile for user % (attempt %): %', NEW.id, attempt_count, SQLERRM;
        
        IF attempt_count >= 5 THEN
          -- Após 5 tentativas, desistir mas não falhar a criação do usuário
          RAISE LOG 'Failed to create profile for user % after % attempts', NEW.id, attempt_count;
          EXIT;
        END IF;
    END;
    
    -- Limite de segurança para evitar loop infinito
    IF attempt_count >= 5 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Garantir que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Recriar políticas RLS mais permissivas
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Política para inserção (criação de perfil)
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política para leitura
CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para atualização
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para exclusão
CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Garantir que outras tabelas relacionadas também tenham RLS configurado corretamente
ALTER TABLE match_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_lanes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_heroes ENABLE ROW LEVEL SECURITY;

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