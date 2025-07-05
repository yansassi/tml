import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, MapPin, Target, Crown, Users, X, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mobile Legends ranks/elos
const ranks = [
  { id: 'all', name: 'Todos os Elos', icon: '🌟', color: '#6B7280' },
  { id: 'warrior', name: 'Warrior', icon: '⚔️', color: '#8B5A2B' },
  { id: 'elite', name: 'Elite', icon: '🛡️', color: '#C0C0C0' },
  { id: 'master', name: 'Master', icon: '🎖️', color: '#CD7F32' },
  { id: 'grandmaster', name: 'Grandmaster', icon: '🏅', color: '#FFD700' },
  { id: 'epic', name: 'Epic', icon: '💜', color: '#8B5CF6' },
  { id: 'legend', name: 'Legend', icon: '🔥', color: '#F59E0B' },
  { id: 'mythic', name: 'Mythic', icon: '👑', color: '#EF4444' },
  { id: 'mythical_honor', name: 'Mythical Honor', icon: '💎', color: '#06B6D4' },
  { id: 'mythical_glory', name: 'Mythical Glory', icon: '✨', color: '#10B981' },
  { id: 'mythical_immortal', name: 'Mythical Immortal', icon: '🌟', color: '#F97316' },
];

// Regiões do Brasil
const regions = [
  { id: 'all', name: 'Todas as Regiões', icon: '🌎' },
  { id: 'norte', name: 'Norte', icon: '🌿' },
  { id: 'nordeste', name: 'Nordeste', icon: '☀️' },
  { id: 'centro-oeste', name: 'Centro-Oeste', icon: '🌾' },
  { id: 'sudeste', name: 'Sudeste', icon: '🏙️' },
  { id: 'sul', name: 'Sul', icon: '❄️' },
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
  preferredRegions: string[];
  preferredHeroes: string[];
  ageRange: { min: number; max: number };
  maxDistance: number;
  onlyShowOnline: boolean;
}

interface SelectionModalProps {
  visible: boolean;
  title: string;
  items: any[];
  selectedItems: string[];
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
  multiSelect?: boolean;
}

function SelectionModal({ 
  visible, 
  title, 
  items, 
  selectedItems, 
  onClose, 
  onToggleItem, 
  multiSelect = true 
}: SelectionModalProps) {
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
          {item.icon && <Text style={styles.modalItemIcon}>{item.icon}</Text>}
          <View style={styles.modalItemInfo}>
            <Text style={[
              styles.modalItemName,
              isSelected && styles.modalItemNameSelected,
              item.isCategory && styles.modalCategoryName
            ]}>
              {item.name}
            </Text>
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

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.modalList}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
}

export default function SettingsScreen() {
  const [matchPreferences, setMatchPreferences] = useState<MatchPreferences>({
    preferredRanks: ['all'],
    preferredRegions: ['all'],
    preferredHeroes: ['all_assassins', 'all_mages'],
    ageRange: { min: 18, max: 35 },
    maxDistance: 50,
    onlyShowOnline: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'ranks' | 'regions' | 'heroes'>('ranks');

  const openModal = (type: 'ranks' | 'regions' | 'heroes') => {
    setModalType(type);
    setModalVisible(true);
  };

  const toggleItem = (itemId: string) => {
    const key = modalType === 'ranks' ? 'preferredRanks' : 
                modalType === 'regions' ? 'preferredRegions' : 'preferredHeroes';
    
    setMatchPreferences(prev => {
      const currentItems = prev[key];
      
      // Se for "all", limpa outros e adiciona só o "all"
      if (itemId.startsWith('all')) {
        return { ...prev, [key]: [itemId] };
      }
      
      // Se já tem "all" selecionado, remove e adiciona o novo item
      if (currentItems.includes('all') || currentItems.includes('all_assassins') || 
          currentItems.includes('all_mages') || currentItems.includes('all_marksmen') ||
          currentItems.includes('all_tanks') || currentItems.includes('all_fighters') ||
          currentItems.includes('all_supports')) {
        const filteredItems = currentItems.filter(id => !id.startsWith('all'));
        return { ...prev, [key]: [...filteredItems, itemId] };
      }
      
      // Toggle normal
      if (currentItems.includes(itemId)) {
        const newItems = currentItems.filter(id => id !== itemId);
        return { ...prev, [key]: newItems.length === 0 ? ['all'] : newItems };
      } else {
        return { ...prev, [key]: [...currentItems, itemId] };
      }
    });
  };

  const getSelectedItemsText = (type: 'ranks' | 'regions' | 'heroes') => {
    const key = type === 'ranks' ? 'preferredRanks' : 
                type === 'regions' ? 'preferredRegions' : 'preferredHeroes';
    const items = type === 'ranks' ? ranks : type === 'regions' ? regions : heroes;
    const selectedIds = matchPreferences[key];
    
    if (selectedIds.includes('all') || selectedIds.some(id => id.startsWith('all'))) {
      return 'Todos';
    }
    
    const selectedNames = items
      .filter(item => selectedIds.includes(item.id))
      .map(item => item.name);
    
    if (selectedNames.length === 0) return 'Nenhum selecionado';
    if (selectedNames.length === 1) return selectedNames[0];
    if (selectedNames.length <= 3) return selectedNames.join(', ');
    return `${selectedNames.slice(0, 2).join(', ')} +${selectedNames.length - 2}`;
  };

  const getCurrentModalData = () => {
    switch (modalType) {
      case 'ranks':
        return { items: ranks, selected: matchPreferences.preferredRanks, title: 'Elos Preferidos' };
      case 'regions':
        return { items: regions, selected: matchPreferences.preferredRegions, title: 'Regiões Preferidas' };
      case 'heroes':
        return { items: heroes, selected: matchPreferences.preferredHeroes, title: 'Heróis Preferidos' };
      default:
        return { items: [], selected: [], title: '' };
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

          {/* Regiões Preferidas */}
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={() => openModal('regions')}
          >
            <View style={styles.preferenceItemLeft}>
              <View style={[styles.preferenceIcon, { backgroundColor: '#3B82F6' }]}>
                <MapPin size={20} color="#ffffff" />
              </View>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Regiões Preferidas</Text>
                <Text style={styles.preferenceValue}>
                  {getSelectedItemsText('regions')}
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
          <View style={styles.preferenceItem}>
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
          </View>

          {/* Distância Máxima */}
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceItemLeft}>
              <View style={[styles.preferenceIcon, { backgroundColor: '#10B981' }]}>
                <MapPin size={20} color="#ffffff" />
              </View>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Distância Máxima</Text>
                <Text style={styles.preferenceValue}>
                  {matchPreferences.maxDistance} km
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </View>

          {/* Mostrar apenas online */}
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceItemLeft}>
              <View style={[styles.preferenceIcon, { backgroundColor: '#4ADE80' }]}>
                <Users size={20} color="#ffffff" />
              </View>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Apenas Usuários Online</Text>
                <Text style={styles.preferenceValue}>
                  {matchPreferences.onlyShowOnline ? 'Ativado' : 'Desativado'}
                </Text>
              </View>
            </View>
            <Switch
              value={matchPreferences.onlyShowOnline}
              onValueChange={(value) => 
                setMatchPreferences(prev => ({ ...prev, onlyShowOnline: value }))
              }
              trackColor={{ false: '#E5E7EB', true: '#FF4458' }}
              thumbColor="#ffffff"
            />
          </View>
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
      </ScrollView>

      {/* Modal de Seleção */}
      <SelectionModal
        visible={modalVisible}
        title={modalData.title}
        items={modalData.items}
        selectedItems={modalData.selected}
        onClose={() => setModalVisible(false)}
        onToggleItem={toggleItem}
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
    paddingBottom: 40,
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
  modalItemIcon: {
    fontSize: 20,
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
});