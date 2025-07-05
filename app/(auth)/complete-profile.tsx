import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, MapPin, Crown, ChevronDown, X, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase, getRanks, getRegions, getLanes, getHeroes } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface Rank {
  id: string;
  name: string;
  image_url: string;
  color: string;
  tier: number;
}

interface Region {
  id: string;
  name: string;
  state_abbr: string;
  region_name: string;
}

interface Lane {
  id: string;
  name: string;
  image_url: string;
  color: string;
}

interface Hero {
  id: string;
  name: string;
  image_url: string;
  role: string;
}

export default function CompleteProfileScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [selectedLanes, setSelectedLanes] = useState<string[]>([]);
  const [selectedHeroes, setSelectedHeroes] = useState<string[]>([]);

  // Data
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);

  // Modals
  const [rankModalVisible, setRankModalVisible] = useState(false);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [laneModalVisible, setLaneModalVisible] = useState(false);
  const [heroModalVisible, setHeroModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ranksResult, regionsResult, lanesResult, heroesResult] = await Promise.all([
        getRanks(),
        getRegions(),
        getLanes(),
        getHeroes(),
      ]);

      if (ranksResult.data) setRanks(ranksResult.data);
      if (regionsResult.data) setRegions(regionsResult.data);
      if (lanesResult.data) setLanes(lanesResult.data);
      if (heroesResult.data) setHeroes(heroesResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCompleteProfile = async () => {
    if (!username || !age || !city || !selectedRegion || !selectedRank) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (parseInt(age) < 18 || parseInt(age) > 100) {
      Alert.alert('Error', 'Age must be between 18 and 100');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);
    try {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: username.trim(),
          age: parseInt(age),
          bio: bio.trim(),
          city: city.trim(),
          state_id: selectedRegion,
          current_rank_id: selectedRank,
        });

      if (profileError) {
        Alert.alert('Error', profileError.message);
        return;
      }

      // Add selected lanes
      if (selectedLanes.length > 0) {
        const laneInserts = selectedLanes.map(laneId => ({
          profile_id: user.id,
          lane_id: laneId,
        }));

        const { error: lanesError } = await supabase
          .from('profile_lanes')
          .insert(laneInserts);

        if (lanesError) {
          console.error('Error adding lanes:', lanesError);
        }
      }

      // Add selected heroes
      if (selectedHeroes.length > 0) {
        const heroInserts = selectedHeroes.map(heroId => ({
          profile_id: user.id,
          hero_id: heroId,
        }));

        const { error: heroesError } = await supabase
          .from('profile_heroes')
          .insert(heroInserts);

        if (heroesError) {
          console.error('Error adding heroes:', heroesError);
        }
      }

      // Create default match preferences
      const { error: preferencesError } = await supabase
        .from('match_preferences')
        .insert({
          profile_id: user.id,
          min_age: 18,
          max_age: 35,
          max_distance: 50,
          only_show_online: false,
          preferred_ranks: ['all'],
          preferred_regions: ['all'],
          preferred_heroes: ['all_assassins', 'all_mages'],
        });

      if (preferencesError) {
        console.error('Error creating preferences:', preferencesError);
      }

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Error completing profile:', error);
    } finally {
      setLoading(false);
    }
  };

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
    setSelectedHeroes(prev => {
      if (prev.includes(heroId)) {
        return prev.filter(id => id !== heroId);
      } else if (prev.length < 3) {
        return [...prev, heroId];
      }
      return prev;
    });
  };

  const selectedRankData = ranks.find(rank => rank.id === selectedRank);
  const selectedRegionData = regions.find(region => region.id === selectedRegion);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF4458', '#FF8A00']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Complete Your Profile</Text>
        <Text style={styles.headerSubtitle}>
          Tell us about yourself to find the perfect duo partners
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username *</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Age */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City *</Text>
            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#9CA3AF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your city"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          {/* Region */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>State *</Text>
            <TouchableOpacity 
              style={styles.selectorWrapper}
              onPress={() => setRegionModalVisible(true)}
            >
              <MapPin size={20} color="#9CA3AF" />
              <Text style={[styles.selectorText, !selectedRegionData && styles.placeholder]}>
                {selectedRegionData ? `${selectedRegionData.name} (${selectedRegionData.state_abbr})` : 'Select your state'}
              </Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Current Rank */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Rank *</Text>
            <TouchableOpacity 
              style={styles.selectorWrapper}
              onPress={() => setRankModalVisible(true)}
            >
              <Crown size={20} color="#9CA3AF" />
              <Text style={[styles.selectorText, !selectedRankData && styles.placeholder]}>
                {selectedRankData ? selectedRankData.name : 'Select your current rank'}
              </Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.inputWrapper, styles.bioInput]}
              placeholder="Tell others about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Preferred Lanes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Lanes (Optional)</Text>
            <Text style={styles.inputSubtitle}>Select up to 3 lanes you prefer to play</Text>
            <TouchableOpacity 
              style={styles.selectorWrapper}
              onPress={() => setLaneModalVisible(true)}
            >
              <Text style={[styles.selectorText, selectedLanes.length === 0 && styles.placeholder]}>
                {selectedLanes.length > 0 ? `${selectedLanes.length} lanes selected` : 'Select preferred lanes'}
              </Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Favorite Heroes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Favorite Heroes (Optional)</Text>
            <Text style={styles.inputSubtitle}>Select up to 3 heroes you love to play</Text>
            <TouchableOpacity 
              style={styles.selectorWrapper}
              onPress={() => setHeroModalVisible(true)}
            >
              <Text style={[styles.selectorText, selectedHeroes.length === 0 && styles.placeholder]}>
                {selectedHeroes.length > 0 ? `${selectedHeroes.length} heroes selected` : 'Select favorite heroes'}
              </Text>
              <ChevronDown size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Complete Button */}
          <TouchableOpacity 
            style={[styles.completeButton, loading && styles.completeButtonDisabled]}
            onPress={handleCompleteProfile}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4ADE80', '#22C55E']}
              style={styles.completeGradient}
            >
              <Text style={styles.completeButtonText}>
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Rank Modal */}
      <Modal visible={rankModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Your Current Rank</Text>
            <TouchableOpacity onPress={() => setRankModalVisible(false)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={ranks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, selectedRank === item.id && styles.modalItemSelected]}
                onPress={() => {
                  setSelectedRank(item.id);
                  setRankModalVisible(false);
                }}
              >
                <Image source={{ uri: item.image_url }} style={styles.modalItemImage} />
                <Text style={styles.modalItemText}>{item.name}</Text>
                {selectedRank === item.id && <Check size={20} color="#FF4458" />}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.modalList}
          />
        </SafeAreaView>
      </Modal>

      {/* Region Modal */}
      <Modal visible={regionModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Your State</Text>
            <TouchableOpacity onPress={() => setRegionModalVisible(false)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={regions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, selectedRegion === item.id && styles.modalItemSelected]}
                onPress={() => {
                  setSelectedRegion(item.id);
                  setRegionModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{item.name} ({item.state_abbr})</Text>
                <Text style={styles.modalItemSubtext}>{item.region_name}</Text>
                {selectedRegion === item.id && <Check size={20} color="#FF4458" />}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.modalList}
          />
        </SafeAreaView>
      </Modal>

      {/* Lane Modal */}
      <Modal visible={laneModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Preferred Lanes ({selectedLanes.length}/3)</Text>
            <TouchableOpacity onPress={() => setLaneModalVisible(false)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={lanes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, selectedLanes.includes(item.id) && styles.modalItemSelected]}
                onPress={() => toggleLane(item.id)}
              >
                <Image source={{ uri: item.image_url }} style={styles.modalItemImage} />
                <Text style={styles.modalItemText}>{item.name}</Text>
                {selectedLanes.includes(item.id) && <Check size={20} color="#FF4458" />}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.modalList}
          />
        </SafeAreaView>
      </Modal>

      {/* Hero Modal */}
      <Modal visible={heroModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Favorite Heroes ({selectedHeroes.length}/3)</Text>
            <TouchableOpacity onPress={() => setHeroModalVisible(false)}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={heroes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalItem, selectedHeroes.includes(item.id) && styles.modalItemSelected]}
                onPress={() => toggleHero(item.id)}
              >
                <Image source={{ uri: item.image_url }} style={styles.modalItemImage} />
                <View style={styles.modalItemInfo}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalItemSubtext}>{item.role}</Text>
                </View>
                {selectedHeroes.includes(item.id) && <Check size={20} color="#FF4458" />}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.modalList}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 40,
    paddingVertical: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  inputSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  bioInput: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  selectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  modalList: {
    padding: 20,
  },
  modalItem: {
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
  modalItemSelected: {
    borderColor: '#FF4458',
    backgroundColor: '#FEF2F2',
  },
  modalItemImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  modalItemSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});