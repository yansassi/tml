import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Heart, Save, Search, X, Plus, Crown, ChevronDown, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Mobile Legends ranks/elos
const ranks = [
  { id: 'warrior', name: 'Warrior', image: require('../../img/elo/warrior.webp'), color: '#8B5A2B', tier: 1 },
  { id: 'elite', name: 'Elite', image: require('../../img/elo/Elite.webp'), color: '#C0C0C0', tier: 2 },
  { id: 'master', name: 'Master', image: require('../../img/elo/Master.webp'), color: '#CD7F32', tier: 3 },
  { id: 'grandmaster', name: 'Grandmaster', image: require('../../img/elo/Grandmaster.webp'), color: '#FFD700', tier: 4 },
  { id: 'epic', name: 'Epic', image: require('../../img/elo/Epic.webp'), color: '#8B5CF6', tier: 5 },
  { id: 'legend', name: 'Legend', image: require('../../img/elo/Legend.webp'), color: '#F59E0B', tier: 6 },
  { id: 'mythic', name: 'Mythic', image: require('../../img/elo/mythic.webp'), color: '#EF4444', tier: 7 },
  { id: 'mythical_honor', name: 'Mythical Honor', image: require('../../img/elo/mythical_honor.webp'), color: '#06B6D4', tier: 8 },
  { id: 'mythical_glory', name: 'Mythical Glory', image: require('../../img/elo/mythical_glory.webp'), color: '#10B981', tier: 9 },
  { id: 'mythical_immortal', name: 'Mythical Immortal', image: require('../../img/elo/Mythical_immortal.webp'), color: '#F97316', tier: 10 },
];

// Mobile Legends lanes/roles with local images
const lanes = [
  { id: 'jungle', name: 'Jungle', image: require('../../img/lane/jungle.webp'), color: '#22C55E' },
  { id: 'exp', name: 'EXP Lane', image: require('../../img/lane/exp.webp'), color: '#EF4444' },
  { id: 'gold', name: 'Gold Lane', image: require('../../img/lane/gold.webp'), color: '#F59E0B' },
  { id: 'mid', name: 'Mid Lane', image: require('../../img/lane/mid.webp'), color: '#8B5CF6' },
  { id: 'roam', name: 'Roam', image: require('../../img/lane/Roam.webp'), color: '#3B82F6' },
];

// Estados e cidades do Brasil
const locations = [
  // Norte
  { id: 'ac', name: 'Acre', state: 'AC', region: 'Norte' },
  { id: 'ap', name: 'Amapá', state: 'AP', region: 'Norte' },
  { id: 'am', name: 'Amazonas', state: 'AM', region: 'Norte' },
  { id: 'pa', name: 'Pará', state: 'PA', region: 'Norte' },
  { id: 'ro', name: 'Rondônia', state: 'RO', region: 'Norte' },
  { id: 'rr', name: 'Roraima', state: 'RR', region: 'Norte' },
  { id: 'to', name: 'Tocantins', state: 'TO', region: 'Norte' },
  
  // Nordeste
  { id: 'al', name: 'Alagoas', state: 'AL', region: 'Nordeste' },
  { id: 'ba', name: 'Bahia', state: 'BA', region: 'Nordeste' },
  { id: 'ce', name: 'Ceará', state: 'CE', region: 'Nordeste' },
  { id: 'ma', name: 'Maranhão', state: 'MA', region: 'Nordeste' },
  { id: 'pb', name: 'Paraíba', state: 'PB', region: 'Nordeste' },
  { id: 'pe', name: 'Pernambuco', state: 'PE', region: 'Nordeste' },
  { id: 'pi', name: 'Piauí', state: 'PI', region: 'Nordeste' },
  { id: 'rn', name: 'Rio Grande do Norte', state: 'RN', region: 'Nordeste' },
  { id: 'se', name: 'Sergipe', state: 'SE', region: 'Nordeste' },
  
  // Centro-Oeste
  { id: 'go', name: 'Goiás', state: 'GO', region: 'Centro-Oeste' },
  { id: 'mt', name: 'Mato Grosso', state: 'MT', region: 'Centro-Oeste' },
  { id: 'ms', name: 'Mato Grosso do Sul', state: 'MS', region: 'Centro-Oeste' },
  { id: 'df', name: 'Distrito Federal', state: 'DF', region: 'Centro-Oeste' },
  
  // Sudeste
  { id: 'es', name: 'Espírito Santo', state: 'ES', region: 'Sudeste' },
  { id: 'mg', name: 'Minas Gerais', state: 'MG', region: 'Sudeste' },
  { id: 'rj', name: 'Rio de Janeiro', state: 'RJ', region: 'Sudeste' },
  { id: 'sp', name: 'São Paulo', state: 'SP', region: 'Sudeste' },
  
  // Sul
  { id: 'pr', name: 'Paraná', state: 'PR', region: 'Sul' },
  { id: 'rs', name: 'Rio Grande do Sul', state: 'RS', region: 'Sul' },
  { id: 'sc', name: 'Santa Catarina', state: 'SC', region: 'Sul' },
];

// Complete Mobile Legends heroes list with local images
const heroes = [
  // Assassins
  { id: 'fanny', name: 'Fanny', image: require('../../img/hero/Fanny.webp'), role: 'Assassin' },
  { id: 'gusion', name: 'Gusion', image: require('../../img/hero/Gusion.webp'), role: 'Assassin' },
  { id: 'ling', name: 'Ling', image: require('../../img/hero/Ling.webp'), role: 'Assassin' },
  { id: 'lancelot', name: 'Lancelot', image: require('../../img/hero/Lancelot.webp'), role: 'Assassin' },
  { id: 'hayabusa', name: 'Hayabusa', image: require('../../img/hero/Hayabusa.webp'), role: 'Assassin' },
  { id: 'karina', name: 'Karina', image: require('../../img/hero/Karina.webp'), role: 'Assassin' },
  { id: 'natalia', name: 'Natalia', image: require('../../img/hero/Natalia.webp'), role: 'Assassin' },
  { id: 'saber', name: 'Saber', image: require('../../img/hero/Saber.webp'), role: 'Assassin' },
  
  // Mages
  { id: 'kagura', name: 'Kagura', image: require('../../img/hero/Kagura.webp'), role: 'Mage' },
  { id: 'harith', name: 'Harith', image: require('../../img/hero/Harith.webp'), role: 'Mage' },
  { id: 'lunox', name: 'Lunox', image: require('../../img/hero/Lunox.webp'), role: 'Mage' },
  { id: 'chang_e', name: "Chang'e", image: require('../../img/hero/Chang\'e.webp'), role: 'Mage' },
  { id: 'pharsa', name: 'Pharsa', image: require('../../img/hero/Pharsa.webp'), role: 'Mage' },
  { id: 'valir', name: 'Valir', image: require('../../img/hero/Valir.webp'), role: 'Mage' },
  { id: 'lylia', name: 'Lylia', image: require('../../img/hero/Lylia.webp'), role: 'Mage' },
  { id: 'cecilion', name: 'Cecilion', image: require('../../img/hero/Cecilion.webp'), role: 'Mage' },
  
  // Marksmen
  { id: 'granger', name: 'Granger', image: require('../../img/hero/Granger.webp'), role: 'Marksman' },
  { id: 'claude', name: 'Claude', image: require('../../img/hero/Claude.webp'), role: 'Marksman' },
  { id: 'kimmy', name: 'Kimmy', image: require('../../img/hero/Kimmy.webp'), role: 'Marksman' },
  { id: 'bruno', name: 'Bruno', image: require('../../img/hero/Bruno.webp'), role: 'Marksman' },
  { id: 'miya', name: 'Miya', image: require('../../img/hero/Miya.webp'), role: 'Marksman' },
  { id: 'layla', name: 'Layla', image: require('../../img/hero/Layla.webp'), role: 'Marksman' },
  { id: 'wanwan', name: 'Wanwan', image: require('../../img/hero/Wanwan.webp'), role: 'Marksman' },
  { id: 'popol_kupa', name: 'Popol & Kupa', image: require('../../img/hero/Popol_and_kupa.webp'), role: 'Marksman' },
  
  // Tanks
  { id: 'tigreal', name: 'Tigreal', image: require('../../img/hero/Tigreal.webp'), role: 'Tank' },
  { id: 'esmeralda', name: 'Esmeralda', image: require('../../img/hero/Esmeralda.webp'), role: 'Tank' },
  { id: 'johnson', name: 'Johnson', image: require('../../img/hero/Johnson.webp'), role: 'Tank' },
  { id: 'franco', name: 'Franco', image: require('../../img/hero/Franco.webp'), role: 'Tank' },
  { id: 'akai', name: 'Akai', image: require('../../img/hero/Akai.webp'), role: 'Tank' },
  { id: 'grock', name: 'Grock', image: require('../../img/hero/Grock.webp'), role: 'Tank' },
  { id: 'uranus', name: 'Uranus', image: require('../../img/hero/Uranus.webp'), role: 'Tank' },
  { id: 'belerick', name: 'Belerick', image: require('../../img/hero/Belerick.webp'), role: 'Tank' },
  
  // Fighters
  { id: 'aldous', name: 'Aldous', image: require('../../img/hero/Aldous.webp'), role: 'Fighter' },
  { id: 'chou', name: 'Chou', image: require('../../img/hero/Chou.webp'), role: 'Fighter' },
  { id: 'zilong', name: 'Zilong', image: require('../../img/hero/Zilong.webp'), role: 'Fighter' },
  { id: 'alucard', name: 'Alucard', image: require('../../img/hero/Alucard.webp'), role: 'Fighter' },
  { id: 'freya', name: 'Freya', image: require('../../img/hero/Freya.webp'), role: 'Fighter' },
  { id: 'ruby', name: 'Ruby', image: require('../../img/hero/Ruby.webp'), role: 'Fighter' },
  { id: 'jawhead', name: 'Jawhead', image: require('../../img/hero/Jawhead.webp'), role: 'Fighter' },
  { id: 'leomord', name: 'Leomord', image: require('../../img/hero/Leomord.webp'), role: 'Fighter' },
  
  // Support
  { id: 'estes', name: 'Estes', image: require('../../img/hero/Estes.webp'), role: 'Support' },
  { id: 'rafaela', name: 'Rafaela', image: require('../../img/hero/Rafaela.webp'), role: 'Support' },
  { id: 'angela', name: 'Angela', image: require('../../img/hero/Angela.webp'), role: 'Support' },
  { id: 'diggie', name: 'Diggie', image: require('../../img/hero/Diggie.webp'), role: 'Support' },
  { id: 'carmilla', name: 'Carmilla', image: require('../../img/hero/Carmilla.webp'), role: 'Support' },
  { id: 'mathilda', name: 'Mathilda', image: require('../../img/hero/Mathilda.webp'), role: 'Support' },
];

const initialProfile = {
  name: 'Alex',
  age: 26,
  bio: 'Mythic player looking for serious duo partners. Main jungle but can flex to other roles. Let\'s climb together! 🏆',
  location: 'sp', // São Paulo
  city: 'São Paulo',
  photos: [
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  selectedLanes: ['jungle', 'mid', 'exp'],
  favoriteHeroes: ['fanny', 'gusion', 'kagura'],
  currentRank: 'mythic',
};

interface PhotoSlotProps {
  photo?: string;
  isMain?: boolean;
  onPress: () => void;
}

function PhotoSlot({ photo, isMain = false, onPress }: PhotoSlotProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.photoSlot, 
        isMain && styles.mainPhotoSlot,
        !photo && styles.emptyPhotoSlot
      ]}
      onPress={onPress}
    >
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <View style={styles.emptyPhoto}>
          <Camera size={24} color="#9CA3AF" />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </View>
      )}
      <View style={styles.photoOverlay}>
        <Camera size={16} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
}

interface RankSelectorProps {
  selectedRank: string;
  onRankSelect: (rankId: string) => void;
}

function RankSelector({ selectedRank, onRankSelect }: RankSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedRankData = ranks.find(rank => rank.id === selectedRank);

  return (
    <View style={styles.rankSelectorContainer}>
      <TouchableOpacity 
        style={styles.rankSelector}
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.rankSelectorContent}>
          <View style={[styles.rankIcon, { backgroundColor: selectedRankData?.color }]}>
            <Image source={selectedRankData?.image} style={styles.rankImage} />
          </View>
          <Text style={styles.rankSelectorText}>{selectedRankData?.name}</Text>
        </View>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.rankModalContainer}>
          <View style={styles.rankModalHeader}>
            <Text style={styles.rankModalTitle}>Select Your Current Rank</Text>
            <TouchableOpacity 
              style={styles.rankModalCloseButton} 
              onPress={() => setIsOpen(false)}
            >
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.ranksList} showsVerticalScrollIndicator={false}>
            {ranks.map((rank) => (
              <TouchableOpacity
                key={rank.id}
                style={[
                  styles.rankOption,
                  selectedRank === rank.id && styles.rankOptionSelected
                ]}
                onPress={() => {
                  onRankSelect(rank.id);
                  setIsOpen(false);
                }}
              >
                <View style={[styles.rankOptionIcon, { backgroundColor: rank.color }]}>
                  <Image source={rank.image} style={styles.rankOptionImage} />
                </View>
                <View style={styles.rankOptionInfo}>
                  <Text style={[
                    styles.rankOptionName,
                    selectedRank === rank.id && styles.rankOptionNameSelected
                  ]}>
                    {rank.name}
                  </Text>
                  <Text style={styles.rankOptionTier}>Tier {rank.tier}</Text>
                </View>
                {selectedRank === rank.id && (
                  <Crown size={20} color="#FF4458" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

interface LocationSelectorProps {
  selectedLocation: string;
  selectedCity: string;
  onLocationSelect: (locationId: string, city: string) => void;
}

function LocationSelector({ selectedLocation, selectedCity, onLocationSelect }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCity, setCustomCity] = useState(selectedCity);
  
  const selectedLocationData = locations.find(loc => loc.id === selectedLocation);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: typeof locations[0]) => {
    onLocationSelect(location.id, customCity || location.name);
    setIsOpen(false);
  };

  return (
    <View style={styles.locationSelectorContainer}>
      <TouchableOpacity 
        style={styles.locationSelector}
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.locationSelectorContent}>
          <View style={styles.locationIcon}>
            <MapPin size={20} color="#FF4458" />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              {selectedCity}, {selectedLocationData?.state || 'BR'}
            </Text>
            <Text style={styles.locationSubtext}>
              {selectedLocationData?.region || 'Brasil'}
            </Text>
          </View>
        </View>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.locationModalContainer}>
          <View style={styles.locationModalHeader}>
            <Text style={styles.locationModalTitle}>Selecione sua Localização</Text>
            <TouchableOpacity 
              style={styles.locationModalCloseButton} 
              onPress={() => setIsOpen(false)}
            >
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar estado..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Custom City Input */}
          <View style={styles.cityInputContainer}>
            <Text style={styles.cityInputLabel}>Cidade:</Text>
            <TextInput
              style={styles.cityInput}
              placeholder="Digite sua cidade"
              value={customCity}
              onChangeText={setCustomCity}
            />
          </View>

          <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
            {filteredLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationOption,
                  selectedLocation === location.id && styles.locationOptionSelected
                ]}
                onPress={() => handleLocationSelect(location)}
              >
                <View style={styles.locationOptionInfo}>
                  <Text style={[
                    styles.locationOptionName,
                    selectedLocation === location.id && styles.locationOptionNameSelected
                  ]}>
                    {location.name} ({location.state})
                  </Text>
                  <Text style={styles.locationOptionRegion}>{location.region}</Text>
                </View>
                {selectedLocation === location.id && (
                  <MapPin size={20} color="#FF4458" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

interface LaneTagProps {
  lane: typeof lanes[0];
  isSelected: boolean;
  onPress: () => void;
}

function LaneTag({ lane, isSelected, onPress }: LaneTagProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.laneTag, 
        isSelected && { backgroundColor: lane.color, borderColor: lane.color }
      ]}
      onPress={onPress}
    >
      <Image source={lane.image} style={[
        styles.laneTagImage,
        { tintColor: isSelected ? '#ffffff' : '#6B7280' }
      ]} />
      <Text style={[
        styles.laneText,
        isSelected && styles.laneTextSelected
      ]}>
        {lane.name}
      </Text>
    </TouchableOpacity>
  );
}

interface SelectedHeroDisplayProps {
  heroIds: string[];
  onRemove: (heroId: string) => void;
  onAdd: () => void;
}

function SelectedHeroDisplay({ heroIds, onRemove, onAdd }: SelectedHeroDisplayProps) {
  const selectedHeroes = heroes.filter(hero => heroIds.includes(hero.id));
  
  return (
    <View style={styles.selectedHeroesContainer}>
      {selectedHeroes.map((hero) => (
        <TouchableOpacity 
          key={hero.id} 
          style={styles.selectedHeroCard}
          onPress={() => onRemove(hero.id)}
        >
          <Image source={hero.image} style={styles.selectedHeroImage} />
          <View style={styles.selectedHeroRemove}>
            <X size={12} color="#ffffff" />
          </View>
          <Text style={styles.selectedHeroName}>{hero.name}</Text>
          <Text style={styles.selectedHeroRole}>{hero.role}</Text>
        </TouchableOpacity>
      ))}
      
      {heroIds.length < 3 && (
        <TouchableOpacity style={styles.addHeroCard} onPress={onAdd}>
          <View style={styles.addHeroIcon}>
            <Plus size={24} color="#9CA3AF" />
          </View>
          <Text style={styles.addHeroText}>Add Hero</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface HeroSelectionModalProps {
  visible: boolean;
  selectedHeroes: string[];
  onClose: () => void;
  onToggleHero: (heroId: string) => void;
}

function HeroSelectionModal({ visible, selectedHeroes, onClose, onToggleHero }: HeroSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const roles = ['All', 'Assassin', 'Mage', 'Marksman', 'Tank', 'Fighter', 'Support'];

  const filteredHeroes = heroes.filter(hero => {
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || hero.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const renderHeroItem = ({ item }: { item: typeof heroes[0] }) => {
    const isSelected = selectedHeroes.includes(item.id);
    const canSelect = !isSelected && selectedHeroes.length < 3;
    
    return (
      <TouchableOpacity 
        style={[
          styles.modalHeroCard,
          isSelected && styles.modalHeroCardSelected,
          !canSelect && !isSelected && styles.modalHeroCardDisabled
        ]}
        onPress={() => canSelect || isSelected ? onToggleHero(item.id) : null}
        disabled={!canSelect && !isSelected}
      >
        <Image source={item.image} style={styles.modalHeroImage} />
        {isSelected && (
          <View style={styles.modalHeroSelectedOverlay}>
            <Heart size={16} color="#ffffff" fill="#ffffff" />
          </View>
        )}
        <Text style={[
          styles.modalHeroName,
          isSelected && styles.modalHeroNameSelected,
          !canSelect && !isSelected && styles.modalHeroNameDisabled
        ]}>
          {item.name}
        </Text>
        <Text style={[
          styles.modalHeroRole,
          !canSelect && !isSelected && styles.modalHeroRoleDisabled
        ]}>
          {item.role}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Heroes ({selectedHeroes.length}/3)</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search heroes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Role Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.roleFilterContainer}
          contentContainerStyle={styles.roleFilterContent}
        >
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleFilterButton,
                selectedRole === role && styles.roleFilterButtonActive
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={[
                styles.roleFilterText,
                selectedRole === role && styles.roleFilterTextActive
              ]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Heroes Grid */}
        <FlatList
          data={filteredHeroes}
          renderItem={renderHeroItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.modalHeroesGrid}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
}

export default function EditProfileScreen() {
  const [profile, setProfile] = useState(initialProfile);
  const [selectedLanes, setSelectedLanes] = useState<string[]>(initialProfile.selectedLanes);
  const [favoriteHeroes, setFavoriteHeroes] = useState<string[]>(initialProfile.favoriteHeroes);
  const [currentRank, setCurrentRank] = useState<string>(initialProfile.currentRank);
  const [heroModalVisible, setHeroModalVisible] = useState(false);

  const toggleLane = (laneId: string) => {
    setSelectedLanes(prev => {
      if (prev.includes(laneId)) {
        return prev.filter(id => id !== laneId);
      } else if (prev.length < 3) {
        return [...prev, laneId];
      }
      return prev;
    });
  };

  const toggleHero = (heroId: string) => {
    setFavoriteHeroes(prev => {
      if (prev.includes(heroId)) {
        return prev.filter(id => id !== heroId);
      } else if (prev.length < 3) {
        return [...prev, heroId];
      }
      return prev;
    });
  };

  const removeHero = (heroId: string) => {
    setFavoriteHeroes(prev => prev.filter(id => id !== heroId));
  };

  const handleLocationSelect = (locationId: string, city: string) => {
    setProfile(prev => ({ ...prev, location: locationId, city }));
  };

  const handleSave = () => {
    // Here you would save the profile changes
    console.log('Saving profile:', { ...profile, selectedLanes, favoriteHeroes, currentRank });
    router.back();
  };

  const handlePhotoPress = (index: number) => {
    // Here you would open camera/gallery
    console.log('Edit photo at index:', index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={24} color="#FF4458" />
          </TouchableOpacity>
        </View>

        {/* Profile Photos */}
        <View style={styles.photosSection}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photosGrid}>
            <PhotoSlot 
              photo={profile.photos[0]} 
              isMain 
              onPress={() => handlePhotoPress(0)}
            />
            <View style={styles.smallPhotos}>
              <PhotoSlot 
                photo={profile.photos[1]} 
                onPress={() => handlePhotoPress(1)}
              />
              <PhotoSlot 
                photo={profile.photos[2]} 
                onPress={() => handlePhotoPress(2)}
              />
              <PhotoSlot onPress={() => handlePhotoPress(3)} />
            </View>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={profile.name}
              onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
              placeholder="Your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.textInput}
              value={profile.age.toString()}
              onChangeText={(text) => setProfile(prev => ({ ...prev, age: parseInt(text) || 0 }))}
              placeholder="Your age"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <LocationSelector
              selectedLocation={profile.location}
              selectedCity={profile.city}
              onLocationSelect={handleLocationSelect}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={profile.bio}
              onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
              placeholder="Tell others about yourself..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Current Rank */}
        <View style={styles.rankSection}>
          <Text style={styles.sectionTitle}>Current Rank</Text>
          <Text style={styles.sectionSubtitle}>
            Show your current Mobile Legends rank to find players at your level
          </Text>
          <RankSelector 
            selectedRank={currentRank}
            onRankSelect={setCurrentRank}
          />
        </View>

        {/* Preferred Lanes */}
        <View style={styles.lanesSection}>
          <Text style={styles.sectionTitle}>Preferred Lanes (Select up to 3)</Text>
          <Text style={styles.sectionSubtitle}>
            Selected: {selectedLanes.length}/3
          </Text>
          <View style={styles.lanesGrid}>
            {lanes.map((lane) => (
              <LaneTag
                key={lane.id}
                lane={lane}
                isSelected={selectedLanes.includes(lane.id)}
                onPress={() => toggleLane(lane.id)}
              />
            ))}
          </View>
        </View>

        {/* Favorite Heroes */}
        <View style={styles.heroesSection}>
          <Text style={styles.sectionTitle}>Favorite Heroes (Select up to 3)</Text>
          <Text style={styles.sectionSubtitle}>
            Selected: {favoriteHeroes.length}/3
          </Text>
          <SelectedHeroDisplay 
            heroIds={favoriteHeroes}
            onRemove={removeHero}
            onAdd={() => setHeroModalVisible(true)}
          />
        </View>

        {/* Save Button */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.saveProfileButton} onPress={handleSave}>
            <LinearGradient
              colors={['#4ADE80', '#22C55E']}
              style={styles.saveProfileGradient}
            >
              <Save size={20} color="#ffffff" />
              <Text style={styles.saveProfileButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Hero Selection Modal */}
      <HeroSelectionModal
        visible={heroModalVisible}
        selectedHeroes={favoriteHeroes}
        onClose={() => setHeroModalVisible(false)}
        onToggleHero={toggleHero}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  saveButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  photosSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 8,
    height: 200,
  },
  mainPhotoSlot: {
    flex: 2,
  },
  smallPhotos: {
    flex: 1,
    gap: 8,
  },
  photoSlot: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  emptyPhotoSlot: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  emptyPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 4,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  rankSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  rankSelectorContainer: {
    marginTop: 8,
  },
  rankSelector: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankImage: {
    width: 24,
    height: 24,
  },
  rankSelectorText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  rankModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  rankModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  rankModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  rankModalCloseButton: {
    padding: 8,
  },
  ranksList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  rankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  rankOptionSelected: {
    borderColor: '#FF4458',
    backgroundColor: '#FEF2F2',
  },
  rankOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankOptionImage: {
    width: 28,
    height: 28,
  },
  rankOptionInfo: {
    flex: 1,
  },
  rankOptionName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  rankOptionNameSelected: {
    color: '#FF4458',
  },
  rankOptionTier: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  // Location Selector Styles
  locationSelectorContainer: {
    marginTop: 8,
  },
  locationSelector: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  locationSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  locationModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  locationModalCloseButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  cityInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cityInputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  cityInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  locationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  locationOptionSelected: {
    borderColor: '#FF4458',
    backgroundColor: '#FEF2F2',
  },
  locationOptionInfo: {
    flex: 1,
  },
  locationOptionName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationOptionNameSelected: {
    color: '#FF4458',
  },
  locationOptionRegion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  lanesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  lanesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  laneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  laneTagImage: {
    width: 20,
    height: 20,
  },
  laneText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  laneTextSelected: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  heroesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  selectedHeroesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  selectedHeroCard: {
    width: 80,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FF4458',
    position: 'relative',
  },
  selectedHeroImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
  },
  selectedHeroRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    padding: 2,
  },
  selectedHeroName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedHeroRole: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  addHeroCard: {
    width: 80,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addHeroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  addHeroText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saveProfileButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveProfileGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveProfileButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 8,
  },
  roleFilterContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  roleFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  roleFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roleFilterButtonActive: {
    backgroundColor: '#FF4458',
    borderColor: '#FF4458',
  },
  roleFilterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  roleFilterTextActive: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  modalHeroesGrid: {
    padding: 20,
  },
  modalHeroCard: {
    flex: 1,
    margin: 6,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    minHeight: 120,
  },
  modalHeroCardSelected: {
    borderColor: '#FF4458',
    backgroundColor: '#FEF2F2',
  },
  modalHeroCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F9FAFB',
  },
  modalHeroImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  modalHeroSelectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4458',
    borderRadius: 10,
    padding: 2,
  },
  modalHeroName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalHeroNameSelected: {
    color: '#FF4458',
  },
  modalHeroNameDisabled: {
    color: '#9CA3AF',
  },
  modalHeroRole: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  modalHeroRoleDisabled: {
    color: '#D1D5DB',
  },
});