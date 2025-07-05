/*
  # Insert static data for Mobile Legends dating app

  1. Regions (Brazilian states)
  2. Ranks (Mobile Legends ranks/elos)
  3. Lanes (Mobile Legends lanes/roles)
  4. Heroes (Mobile Legends heroes)
*/

-- Insert Brazilian regions/states
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

ON CONFLICT (id) DO NOTHING;

-- Insert Mobile Legends ranks
INSERT INTO ranks (id, name, image_url, color, tier) VALUES
('warrior', 'Warrior', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100', '#8B5A2B', 1),
('elite', 'Elite', 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100', '#C0C0C0', 2),
('master', 'Master', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', '#CD7F32', 3),
('grandmaster', 'Grandmaster', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', '#FFD700', 4),
('epic', 'Epic', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', '#8B5CF6', 5),
('legend', 'Legend', 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100', '#F59E0B', 6),
('mythic', 'Mythic', 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=100', '#EF4444', 7),
('mythical_honor', 'Mythical Honor', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100', '#06B6D4', 8),
('mythical_glory', 'Mythical Glory', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', '#10B981', 9),
('mythical_immortal', 'Mythical Immortal', 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100', '#F97316', 10)

ON CONFLICT (id) DO NOTHING;

-- Insert Mobile Legends lanes
INSERT INTO lanes (id, name, image_url, color) VALUES
('jungle', 'Jungle', 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=100', '#22C55E'),
('exp', 'EXP Lane', 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100', '#EF4444'),
('gold', 'Gold Lane', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100', '#F59E0B'),
('mid', 'Mid Lane', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', '#8B5CF6'),
('roam', 'Roam', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', '#3B82F6')

ON CONFLICT (id) DO NOTHING;

-- Insert Mobile Legends heroes
INSERT INTO heroes (id, name, image_url, role) VALUES
-- Assassins
('fanny', 'Fanny', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),
('gusion', 'Gusion', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),
('ling', 'Ling', 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),
('lancelot', 'Lancelot', 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),
('hayabusa', 'Hayabusa', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),
('karina', 'Karina', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),
('natalia', 'Natalia', 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),
('saber', 'Saber', 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=100', 'Assassin'),

-- Mages
('kagura', 'Kagura', 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),
('harith', 'Harith', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),
('lunox', 'Lunox', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),
('chang_e', 'Chang''e', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),
('pharsa', 'Pharsa', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),
('valir', 'Valir', 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),
('lylia', 'Lylia', 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),
('cecilion', 'Cecilion', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mage'),

-- Marksmen
('granger', 'Granger', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),
('claude', 'Claude', 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),
('kimmy', 'Kimmy', 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),
('bruno', 'Bruno', 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),
('miya', 'Miya', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),
('layla', 'Layla', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),
('wanwan', 'Wanwan', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),
('popol_kupa', 'Popol & Kupa', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Marksman'),

-- Tanks
('tigreal', 'Tigreal', 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),
('esmeralda', 'Esmeralda', 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),
('johnson', 'Johnson', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),
('franco', 'Franco', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),
('akai', 'Akai', 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),
('grock', 'Grock', 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),
('uranus', 'Uranus', 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),
('belerick', 'Belerick', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100', 'Tank'),

-- Fighters
('aldous', 'Aldous', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),
('chou', 'Chou', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),
('zilong', 'Zilong', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),
('alucard', 'Alucard', 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),
('freya', 'Freya', 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),
('ruby', 'Ruby', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),
('jawhead', 'Jawhead', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),
('leomord', 'Leomord', 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fighter'),

-- Support
('estes', 'Estes', 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=100', 'Support'),
('rafaela', 'Rafaela', 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=100', 'Support'),
('angela', 'Angela', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100', 'Support'),
('diggie', 'Diggie', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', 'Support'),
('carmilla', 'Carmilla', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', 'Support'),
('mathilda', 'Mathilda', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Support')

ON CONFLICT (id) DO NOTHING;