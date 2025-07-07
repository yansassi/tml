import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, FlatList, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Target, Crown, Users, X, Check, Search, Globe, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AgeRangeSlider from '@/components/AgeRangeSlider';

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

// Estados brasileiros organizados por região
const brazilianStates = [
  { id: 'all_states', name: 'Todos os Estados', state: 'BR', region: 'Brasil' },
  
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

// Lista completa de heróis do Mobile Legends com imagens locais
const heroes = [
  // Assassins
  { id: 'all_assassins', name: 'Todos os Assassinos', role: 'Assassin', isCategory: true },
  { id: 'fanny', name: 'Fanny', role: 'Assassin', image: require('../../img/hero/Fanny.webp') },
  { id: 'gusion', name: 'Gusion', role: 'Assassin', image: require('../../img/hero/Gusion.webp') },
  { id: 'ling', name: 'Ling', role: 'Assassin', image: require('../../img/hero/Ling.webp') },
  { id: 'lancelot', name: 'Lancelot', role: 'Assassin', image: require('../../img/hero/Lancelot.webp') },
  { id: 'hayabusa', name: 'Hayabusa', role: 'Assassin', image: require('../../img/hero/Hayabusa.webp') },
  { id: 'karina', name: 'Karina', role: 'Assassin', image: require('../../img/hero/Karina.webp') },
  { id: 'natalia', name: 'Natalia', role: 'Assassin', image: require('../../img/hero/Natalia.webp') },
  { id: 'saber', name: 'Saber', role: 'Assassin', image: require('../../img/hero/Saber.webp') },
  
  // Mages
  { id: 'all_mages', name: 'Todos os Magos', role: 'Mage', isCategory: true },
  { id: 'kagura', name: 'Kagura', role: 'Mage', image: require('../../img/hero/Kagura.webp') },
  { id: 'harith', name: 'Harith', role: 'Mage', image: require('../../img/hero/Harith.webp') },
  { id: 'lunox', name: 'Lunox', role: 'Mage', image: require('../../img/hero/Lunox.webp') },
  { id: 'chang_e', name: "Chang'e", role: 'Mage', image: require('../../img/hero/Chang\'e.webp') },
  { id: 'pharsa', name: 'Pharsa', role: 'Mage', image: require('../../img/hero/Pharsa.webp') },
  { id: 'valir', name: 'Valir', role: 'Mage', image: require('../../img/hero/Valir.webp') },
  { id: 'lylia', name: 'Lylia', role: 'Mage', image: require('../../img/hero/Lylia.webp') },
  { id: 'cecilion', name: 'Cecilion', role: 'Mage', image: require('../../img/hero/Cecilion.webp') },
  
  // Marksmen
  { id: 'all_marksmen', name: 'Todos os Atiradores', role: 'Marksman', isCategory: true },
  { id: 'granger', name: 'Granger', role: 'Marksman', image: require('../../img/hero/Granger.webp') },
  { id: 'claude', name: 'Claude', role: 'Marksman', image: require('../../img/hero/Claude.webp') },
  { id: 'kimmy', name: 'Kimmy', role: 'Marksman', image: require('../../img/hero/Kimmy.webp') },
  { id: 'bruno', name: 'Bruno', role: 'Marksman', image: require('../../img/hero/Bruno.webp') },
  { id: 'miya', name: 'Miya', role: 'Marksman', image: require('../../img/hero/Miya.webp') },
  { id: 'layla', name: 'Layla', role: 'Marksman', image: require('../../img/hero/Layla.webp') },
  { id: 'wanwan', name: 'Wanwan', role: 'Marksman', image: require('../../img/hero/Wanwan.webp') },
  { id: 'popol_kupa', name: 'Popol & Kupa', role: 'Marksman', image: require('../../img/hero/Popol_and_kupa.webp') },
  
  // Tanks
  { id: 'all_tanks', name: 'Todos os Tanques', role: 'Tank', isCategory: true },
  { id: 'tigreal', name: 'Tigreal', role: 'Tank', image: require('../../img/hero/Tigreal.webp') },
  { id: 'esmeralda', name: 'Esmeralda', role: 'Tank', image: require('../../img/hero/Esmeralda.webp') },
  { id: 'johnson', name: 'Johnson', role: 'Tank', image: require('../../img/hero/Johnson.webp') },
  { id: 'franco', name: 'Franco', role: 'Tank', image: require('../../img/hero/Franco.webp') },
  { id: 'akai', name: 'Akai', role: 'Tank', image: require('../../img/hero/Akai.webp') },
  { id: 'grock', name: 'Grock', role: 'Tank', image: require('../../img/hero/Grock.webp') },
  { id: 'uranus', name: 'Uranus', role: 'Tank', image: require('../../img/hero/Uranus.webp') },
  { id: 'belerick', name: 'Belerick', role: 'Tank', image: require('../../img/hero/Belerick.webp') },
  
  // Fighters
  { id: 'all_fighters', name: 'Todos os Lutadores', role: 'Fighter', isCategory: true },
  { id: 'aldous', name: 'Aldous', role: 'Fighter', image: require('../../img/hero/Aldous.webp') },
  { id: 'chou', name: 'Chou', role: 'Fighter', image: require('../../img/hero/Chou.webp') },
  { id: 'zilong', name: 'Zilong', role: 'Fighter', image: require('../../img/hero/Zilong.webp') },
  { id: 'alucard', name: 'Alucard', role: 'Fighter', image: require('../../img/hero/Alucard.webp') },
  { id: 'freya', name: 'Freya', role: 'Fighter', image: require('../../img/hero/Freya.webp') },
  { id: 'ruby', name: 'Ruby', role: 'Fighter', image: require('../../img/hero/Ruby.webp') },
  { id: 'jawhead', name: 'Jawhead', role: 'Fighter', image: require('../../img/hero/Jawhead.webp') },
  { id: 'leomord', name: 'Leomord', role: 'Fighter', image: require('../../img/hero/Leomord.webp') },
  
  // Support
  { id: 'all_supports', name: 'Todos os Suportes', role: 'Support', isCategory: true },
  { id: 'estes', name: 'Estes', role: 'Support', image: require('../../img/hero/Estes.webp') },
  { id: 'rafaela', name: 'Rafaela', role: 'Support', image: require('../../img/hero/Rafaela.webp') },
  { id: 'angela', name: 'Angela', role: 'Support', image: require('../../img/hero/Angela.webp') },
  { id: 'diggie', name: 'Diggie', role: 'Support', image: require('../../img/hero/Diggie.webp') },
  { id: 'carmilla', name: 'Carmilla', role: 'Support', image: require('../../img/hero/Carmilla.webp') },
  { id: 'mathilda', name: 'Mathilda', role: 'Support', image: require('../../img/hero/Mathilda.webp') },
];

interface MatchPreferences {
  preferredRanks: string[];
  preferredStates: string[];
  preferredHeroes: string[];
  ageRange: { min: number; max: number };
}

interface SelectionModalProps {
  visible: boolean;
  title: string;
  items: any[];
  selectedItems: string[];
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
  multiSelect?: boolean;
  searchable?: boolean;
}

function SelectionModal({ 
  visible, 
  title, 
  items, 
  selectedItems, 
  onClose, 
  onToggleItem, 
  multiSelect = true,
  searchable = false
}: SelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = searchable 
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.state && item.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : items;

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={[
          styles.modalItem,
          isSelected && styles.modalItemSelected,
          item.isCategory && styles.modalCategoryItem
        ]}
        onPress={() => onToggleItem(item.id)}
      >
        <View style={styles.modalItemContent}>
          {item.image && <Image source={item.image} style={styles.modalItemImage} />}
          <View style={styles.modalItemInfo}>
            <Text style={[
              styles.modalItemName,
              isSelected && styles.modalItemNameSelected,
              item.isCategory && styles.modalCategoryName
            ]}>
              {item.name}
            </Text>
            {item.state && item.state !== 'BR' && (
              <Text style={styles.modalItemSubtext}>
                {item.state} • {item.region}
              </Text>
            )}
            {item.role && !item.isCategory && (
              <Text style={styles.modalItemRole}>{item.role}</Text>
            )}
            {item.color && (
              <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            )}
          </View>
        </View>
        {isSelected && (
          <Check size={20} color="#FF4458" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {searchable && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar estados..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        )}

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.modalList}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
}

interface AgeRangeModalProps {
  visible: boolean;
  ageRange: { min: number; max: number };
  onClose: () => void;
  onSave: (ageRange: { min: number; max: number }) => void;
}

function AgeRangeModal({ visible, ageRange, onClose, onSave }: AgeRangeModalProps) {
  const [currentRange, setCurrentRange] = useState(ageRange);

  const handleRangeChange = (min: number, max: number) => {
    setCurrentRange({ min, max });
  };

  const handleSave = () => {
    onSave(currentRange);
    onClose();
  };

  const handleCancel = () => {
    setCurrentRange(ageRange);
    onClose();
  };

  // Reset range when modal opens
  React.useEffect(() => {
    if (visible) {
      setCurrentRange(ageRange);
    }
  }, [visible, ageRange]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.ageModalOverlay}>
        <View style={styles.ageModalContent}>
          <View style={styles.ageModalHeader}>
            <Text style={styles.ageModalTitle}>Faixa Etária</Text>
          </View>

          <View style={styles.ageModalBody}>
            <Text style={styles.ageModalSubtitle}>
              Selecione a faixa etária dos perfis que deseja ver
            </Text>

            <AgeRangeSlider
              minAge={currentRange.min}
              maxAge={currentRange.max}
              absoluteMin={18}
              absoluteMax={65}
              onRangeChange={handleRangeChange}
            />
          </View>

          <View style={styles.ageModalActions}>
            <TouchableOpacity style={styles.ageModalCancelButton} onPress={handleCancel}>
              <Text style={styles.ageModalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ageModalSaveButton} onPress={handleSave}>
              <LinearGradient
                colors={['#FF4458', '#FF8A00']}
                style={styles.ageModalSaveGradient}
              >
                <Text style={styles.ageModalSaveText}>Salvar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const [matchPreferences, setMatchPreferences] = useState<MatchPreferences>({
    preferredRanks: ['all'],
    preferredStates: ['all_states'],
    preferredHeroes: ['all_assassins', 'all_mages'],
    ageRange: { min: 18, max: 35 },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'ranks' | 'states' | 'heroes'>('ranks');
  const [ageModalVisible, setAgeModalVisible] = useState(false);

  const openModal = (type: 'ranks' | 'states' | 'heroes') => {
    setModalType(type);
    setModalVisible(true);
  };

  const toggleItem = (itemId: string) => {
    const key = modalType === 'ranks' ? 'preferredRanks' : 
                modalType === 'states' ? 'preferredStates' : 'preferredHeroes';
    
    setMatchPreferences(prev => {
      const currentItems = prev[key];
      
      // Se for "all" ou "all_states", limpa outros e adiciona só o "all"
      if (itemId === 'all' || itemId === 'all_states' || itemId.startsWith('all_')) {
        return { ...prev, [key]: [itemId] };
      }
      
      // Se já tem "all" selecionado, remove e adiciona o novo item
      if (currentItems.some(id => id === 'all' || id === 'all_states' || id.startsWith('all_'))) {
        return { ...prev, [key]: [itemId] };
      }
      
      // Toggle normal
      if (currentItems.includes(itemId)) {
        const newItems = currentItems.filter(id => id !== itemId);
        return { ...prev, [key]: newItems.length === 0 ? [modalType === 'states' ? 'all_states' : 'all'] : newItems };
      } else {
        return { ...prev, [key]: [...currentItems, itemId] };
      }
    });
  };

  const handleAgeRangeSave = (newAgeRange: { min: number; max: number }) => {
    setMatchPreferences(prev => ({ ...prev, ageRange: newAgeRange }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            // Aqui você limparia os dados de autenticação
            // Por exemplo: AsyncStorage.removeItem('userToken')
            console.log('User logged out');
            
            // Navegar para a tela de login
            router.replace('/login');
          },
        },
      ]
    );
  };

  const getSelectedItemsText = (type: 'ranks' | 'states' | 'heroes') => {
    const key = type === 'ranks' ? 'preferredRanks' : 
                type === 'states' ? 'preferredStates' : 'preferredHeroes';
    const items = type === 'ranks' ? ranks : type === 'states' ? brazilianStates : heroes;
    const selectedIds = matchPreferences[key];
    
    if (selectedIds.includes('all') || selectedIds.includes('all_states') || selectedIds.some(id => id.startsWith('all_'))) {
      return 'Todos';
    }
    
    const selectedNames = items
      .filter(item => selectedIds.includes(item.id))
      .map(item => type === 'states' ? `${item.name} (${item.state})` : item.name);
    
    if (selectedNames.length === 0) return 'Nenhum selecionado';
    if (selectedNames.length === 1) return selectedNames[0];
    if (selectedNames.length <= 3) return selectedNames.join(', ');
    return `${selectedNames.slice(0, 2).join(', ')} +${selectedNames.length - 2}`;
  };

  const getCurrentModalData = () => {
    switch (modalType) {
      case 'ranks':
        return { 
          items: ranks, 
          selected: matchPreferences.preferredRanks, 
          title: 'Elos Preferidos',
          searchable: false
        };
      case 'states':
        return { 
          items: brazilianStates, 
          selected: matchPreferences.preferredStates, 
          title: 'Estados Preferidos',
          searchable: true
        };
      case 'heroes':
        return { 
          items: heroes, 
          selected: matchPreferences.preferredHeroes, 
          title: 'Heróis Preferidos',
          searchable: false
        };
      default:
        return { items: [], selected: [], title: '', searchable: false };
    }
  };

  const modalData = getCurrentModalData();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>

        {/* Preferências de Match */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências de Match</Text>
          <Text style={styles.sectionSubtitle}>
            Configure suas preferências para encontrar os melhores parceiros
          </Text>

          {/* Elos Preferidos */}
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={() => openModal('ranks')}
          >
            <View style={styles.preferenceItemLeft}>
              <View style={[styles.preferenceIcon, { backgroundColor: '#EF4444' }]}>
                <Crown size={20} color="#ffffff" />
              </View>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Elos Preferidos</Text>
                <Text style={styles.preferenceValue}>
                  {getSelectedItemsText('ranks')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Estados Preferidos */}
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={() => openModal('states')}
          >
            <View style={styles.preferenceItemLeft}>
              <View style={[styles.preferenceIcon, { backgroundColor: '#3B82F6' }]}>
                <Globe size={20} color="#ffffff" />
              </View>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Estados Preferidos</Text>
                <Text style={styles.preferenceValue}>
                  {getSelectedItemsText('states')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Heróis Preferidos */}
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={() => openModal('heroes')}
          >
            <View style={styles.preferenceItemLeft}>
              <View style={[styles.preferenceIcon, { backgroundColor: '#8B5CF6' }]}>
                <Target size={20} color="#ffffff" />
              </View>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Heróis Preferidos</Text>
                <Text style={styles.preferenceValue}>
                  {getSelectedItemsText('heroes')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Faixa Etária */}
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={() => setAgeModalVisible(true)}
          >
            <View style={styles.preferenceItemLeft}>
              <View style={[styles.preferenceIcon, { backgroundColor: '#F59E0B' }]}>
                <Users size={20} color="#ffffff" />
              </View>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Faixa Etária</Text>
                <Text style={styles.preferenceValue}>
                  {matchPreferences.ageRange.min} - {matchPreferences.ageRange.max} anos
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Configurações Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações Gerais</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingTitle}>Notificações</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingTitle}>Privacidade</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingTitle}>Conta</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingTitle}>Ajuda e Suporte</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Botão Salvar */}
        <View style={styles.saveSection}>
          <TouchableOpacity style={styles.saveButton}>
            <LinearGradient
              colors={['#4ADE80', '#22C55E']}
              style={styles.saveGradient}
            >
              <Text style={styles.saveButtonText}>Salvar Preferências</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Seção de Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutButtonContent}>
              <View style={styles.logoutIcon}>
                <LogOut size={20} color="#EF4444" />
              </View>
              <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Seleção */}
      <SelectionModal
        visible={modalVisible}
        title={modalData.title}
        items={modalData.items}
        selectedItems={modalData.selected}
        onClose={() => setModalVisible(false)}
        onToggleItem={toggleItem}
        searchable={modalData.searchable}
      />

      {/* Modal de Faixa Etária */}
      <AgeRangeModal
        visible={ageModalVisible}
        ageRange={matchPreferences.ageRange}
        onClose={() => setAgeModalVisible(false)}
        onSave={handleAgeRangeSave}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  preferenceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  saveSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  // Logout Section Styles
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    flex: 1,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  modalList: {
    padding: 20,
  },
  modalItem: {
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
  modalItemSelected: {
    borderColor: '#FF4458',
    backgroundColor: '#FEF2F2',
  },
  modalCategoryItem: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalItemImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalItemName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
  modalItemNameSelected: {
    color: '#FF4458',
    fontFamily: 'Inter-SemiBold',
  },
  modalCategoryName: {
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  modalItemSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  modalItemRole: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  // Age Range Modal Styles
  ageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  ageModalHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ageModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  ageModalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  ageModalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  ageModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  ageModalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  ageModalCancelText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  ageModalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  ageModalSaveGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  ageModalSaveText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});