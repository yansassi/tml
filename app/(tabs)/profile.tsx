import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, MapPin, Crown, Target } from 'lucide-react-native';
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

// Popular Mobile Legends heroes with local images
const heroes = [
  { id: 'fanny', name: 'Fanny', image: require('../../img/hero/Fanny.webp'), role: 'Assassin' },
  { id: 'gusion', name: 'Gusion', image: require('../../img/hero/Gusion.webp'), role: 'Assassin' },
  { id: 'kagura', name: 'Kagura', image: require('../../img/hero/Kagura.webp'), role: 'Mage' },
  { id: 'granger', name: 'Granger', image: require('../../img/hero/Granger.webp'), role: 'Marksman' },
  { id: 'tigreal', name: 'Tigreal', image: require('../../img/hero/Tigreal.webp'), role: 'Tank' },
  { id: 'ling', name: 'Ling', image: require('../../img/hero/Ling.webp'), role: 'Assassin' },
];

const userProfile = {
  name: 'Alex',
  age: 26,
  location: 'São Paulo, SP',
  bio: 'Mythic player looking for serious duo partners. Main jungle but can flex to other roles. Let\'s climb together! 🏆',
  photos: [
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  currentRank: 'mythic',
  selectedLanes: ['jungle', 'mid', 'exp'],
  favoriteHeroes: ['fanny', 'gusion', 'kagura'],
};

interface RankDisplayProps {
  rankId: string;
}

function RankDisplay({ rankId }: RankDisplayProps) {
  const rank = ranks.find(r => r.id === rankId);
  if (!rank) return null;
  
  return (
    <View style={[styles.rankDisplay, { backgroundColor: rank.color }]}>
      <Image source={rank.image} style={styles.rankDisplayImage} />
      <Text style={styles.rankDisplayText}>{rank.name}</Text>
    </View>
  );
}

interface LaneDisplayProps {
  laneIds: string[];
}

function LaneDisplay({ laneIds }: LaneDisplayProps) {
  const selectedLanes = lanes.filter(lane => laneIds.includes(lane.id));
  
  return (
    <View style={styles.lanesDisplay}>
      {selectedLanes.map((lane) => (
        <View 
          key={lane.id}
          style={[styles.laneDisplayTag, { backgroundColor: lane.color }]}
        >
          <Image source={lane.image} style={styles.laneDisplayImage} />
          <Text style={styles.laneDisplayText}>{lane.name}</Text>
        </View>
      ))}
    </View>
  );
}

interface HeroDisplayProps {
  heroIds: string[];
}

function HeroDisplay({ heroIds }: HeroDisplayProps) {
  const selectedHeroes = heroes.filter(hero => heroIds.includes(hero.id));
  
  return (
    <View style={styles.heroesDisplay}>
      {selectedHeroes.map((hero) => (
        <View key={hero.id} style={styles.heroDisplayCard}>
          <Image source={hero.image} style={styles.heroDisplayImage} />
          <Text style={styles.heroDisplayName}>{hero.name}</Text>
          <Text style={styles.heroDisplayRole}>{hero.role}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
            <Settings size={24} color="#FF4458" />
          </TouchableOpacity>
        </View>

        {/* Profile Photos */}
        <View style={styles.photosSection}>
          <View style={styles.photosGrid}>
            <View style={styles.mainPhotoSlot}>
              <Image source={{ uri: userProfile.photos[0] }} style={styles.photo} />
            </View>
            <View style={styles.smallPhotos}>
              <View style={styles.photoSlot}>
                <Image source={{ uri: userProfile.photos[1] }} style={styles.photo} />
              </View>
              <View style={styles.photoSlot}>
                <Image source={{ uri: userProfile.photos[2] }} style={styles.photo} />
              </View>
              <View style={[styles.photoSlot, styles.emptyPhotoSlot]}>
                <View style={styles.emptyPhoto}>
                  <Text style={styles.addPhotoText}>+</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{userProfile.name}, {userProfile.age}</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>{userProfile.location}</Text>
          </View>

          <Text style={styles.bio}>{userProfile.bio}</Text>

          {/* Current Rank */}
          <View style={styles.gameStatsRow}>
            <RankDisplay rankId={userProfile.currentRank} />
          </View>
        </View>

        {/* Preferred Lanes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Preferred Lanes</Text>
          <LaneDisplay laneIds={userProfile.selectedLanes} />
        </View>

        {/* Favorite Heroes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Favorite Heroes</Text>
          <HeroDisplay heroIds={userProfile.favoriteHeroes} />
        </View>

        {/* Edit Profile Button */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <LinearGradient
              colors={['#FF4458', '#FF8A00']}
              style={styles.editProfileGradient}
            >
              <Settings size={20} color="#ffffff" />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  photosSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 8,
    height: 200,
  },
  mainPhotoSlot: {
    flex: 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  gameStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rankDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankDisplayImage: {
    width: 28,
    height: 28,
  },
  rankDisplayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  lanesDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  laneDisplayTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  laneDisplayImage: {
    width: 20,
    height: 20,
    tintColor: '#ffffff',
  },
  laneDisplayText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  heroesDisplay: {
    flexDirection: 'row',
    gap: 16,
  },
  heroDisplayCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FF4458',
  },
  heroDisplayImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  heroDisplayName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  heroDisplayRole: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  editProfileButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  editProfileGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});