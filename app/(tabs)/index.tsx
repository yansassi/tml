import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, X, MapPin } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  { id: 'angela', name: 'Angela', image: require('../../img/hero/Angela.webp'), role: 'Support' },
  { id: 'chang_e', name: "Chang'e", image: require('../../img/hero/Chang\'e.webp'), role: 'Mage' },
  { id: 'claude', name: 'Claude', image: require('../../img/hero/Claude.webp'), role: 'Marksman' },
  { id: 'harith', name: 'Harith', image: require('../../img/hero/Harith.webp'), role: 'Mage' },
];

// Enhanced user data with complete profiles
const users = [
  {
    id: 1,
    name: 'Sofia',
    age: 25,
    bio: 'Adventure seeker, coffee lover ☕️ Looking for someone to explore the city with and maybe find some hidden gems! I love playing Mobile Legends in my free time and I\'m always up for duo ranked games.',
    distance: '2 km away',
    location: 'São Paulo, SP',
    photos: [
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    currentRank: 'epic',
    selectedLanes: ['mid', 'roam'],
    favoriteHeroes: ['kagura', 'angela', 'chang_e'],
  },
  {
    id: 2,
    name: 'Elena',
    age: 28,
    bio: 'Artist & dreamer 🎨✨ Love creating beautiful things and playing ML in my free time. Looking for someone who appreciates art and can carry me to Mythic rank! 😄',
    distance: '5 km away',
    location: 'Rio de Janeiro, RJ',
    photos: [
      'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    currentRank: 'legend',
    selectedLanes: ['gold', 'mid'],
    favoriteHeroes: ['granger', 'claude', 'harith'],
  },
  {
    id: 3,
    name: 'Marina',
    age: 26,
    bio: 'Fitness enthusiast & dog mom 🐕 When I\'m not at the gym, you\'ll find me climbing ranks in Mobile Legends. Main tank but can flex to other roles. Let\'s duo and dominate!',
    distance: '3 km away',
    location: 'Belo Horizonte, MG',
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    currentRank: 'mythic',
    selectedLanes: ['roam', 'exp'],
    favoriteHeroes: ['tigreal', 'angela', 'fanny'],
  },
  {
    id: 4,
    name: 'Valentina',
    age: 24,
    bio: 'Photographer capturing life 📸 Love taking photos and playing Mobile Legends. Always looking for new adventures and duo partners. Can we climb to Mythical Glory together?',
    distance: '1 km away',
    location: 'Salvador, BA',
    photos: [
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    currentRank: 'grandmaster',
    selectedLanes: ['jungle', 'mid'],
    favoriteHeroes: ['fanny', 'gusion', 'kagura'],
  },
  {
    id: 5,
    name: 'Lucia',
    age: 27,
    bio: 'Traveler & foodie 🌍🍜 Always up for new adventures and duo ranked games! I love exploring new places and trying different cuisines. Looking for someone to share both real and virtual adventures with.',
    distance: '4 km away',
    location: 'Porto Alegre, RS',
    photos: [
      'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    currentRank: 'mythical_honor',
    selectedLanes: ['gold', 'jungle'],
    favoriteHeroes: ['granger', 'claude', 'fanny'],
  },
];

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

interface ProfileCardProps {
  user: typeof users[0];
  onAction: (action: 'like' | 'pass') => void;
}

const ProfileCard = React.memo(({ user, onAction }: ProfileCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleAction = (action: 'like' | 'pass') => {
    // Scroll to top before calling the action
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    onAction(action);
  };

  return (
    <View style={styles.fullScreenCard}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.cardScrollView}
        contentContainerStyle={styles.cardContent}
      >
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentPhotoIndex(index);
            }}
          >
            {user.photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.cardImage} />
              </View>
            ))}
          </ScrollView>
          
          {/* Photo indicators */}
          {user.photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {user.photos.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.photoIndicator,
                    currentPhotoIndex === index && styles.photoIndicatorActive
                  ]} 
                />
              ))}
            </View>
          )}

          {/* Gradient overlay for better text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.photoGradient}
          />
        </View>

        {/* Profile Information */}
        <View style={styles.profileInfo}>
          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <Text style={styles.cardName}>{user.name}, {user.age}</Text>
            
            <View style={styles.locationRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.cardLocation}>{user.location}</Text>
            </View>

            <Text style={styles.cardDistance}>{user.distance}</Text>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.cardBio}>{user.bio}</Text>
          </View>

          {/* Current Rank */}
          <View style={styles.gameStatsSection}>
            <Text style={styles.sectionTitle}>Current Rank</Text>
            <RankDisplay rankId={user.currentRank} />
          </View>

          {/* Preferred Lanes */}
          <View style={styles.lanesSection}>
            <Text style={styles.sectionTitle}>Preferred Lanes</Text>
            <LaneDisplay laneIds={user.selectedLanes} />
          </View>

          {/* Favorite Heroes */}
          <View style={styles.heroesSection}>
            <Text style={styles.sectionTitle}>Favorite Heroes</Text>
            <HeroDisplay heroIds={user.favoriteHeroes} />
          </View>

          {/* Action Buttons at the bottom */}
          <View style={styles.cardActionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.passButton]}
              onPress={() => handleAction('pass')}
            >
              <X size={32} color="#FF4458" />
              <Text style={styles.passButtonText}>Pass</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => handleAction('like')}
            >
              <Heart size={32} color="#ffffff" />
              <Text style={styles.likeButtonText}>Like</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<number[]>([]);

  const handleAction = useCallback((action: 'like' | 'pass') => {
    if (action === 'like') {
      setMatches(prev => [...prev, users[currentIndex].id]);
    }
    
    // Move to next profile
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  if (currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No more profiles!</Text>
          <Text style={styles.emptySubtitle}>Check back later for more matches</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>

      <View style={styles.cardContainer}>
        <ProfileCard
          key={currentIndex} // Add key to force re-render and reset scroll position
          user={users[currentIndex]}
          onAction={handleAction}
        />
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FF4458',
  },
  cardContainer: {
    flex: 1,
  },
  fullScreenCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cardScrollView: {
    flex: 1,
  },
  cardContent: {
    flexGrow: 1,
  },
  photoSection: {
    height: screenHeight * 0.5,
    position: 'relative',
  },
  photoContainer: {
    width: screenWidth,
    height: screenHeight * 0.5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  photoIndicators: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  photoIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  photoIndicatorActive: {
    backgroundColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  basicInfo: {
    marginBottom: 20,
  },
  cardName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  cardDistance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  bioSection: {
    marginBottom: 24,
  },
  cardBio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
  },
  gameStatsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  rankDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rankDisplayImage: {
    width: 28,
    height: 28,
  },
  rankDisplayText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  lanesSection: {
    marginBottom: 24,
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
    paddingVertical: 10,
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
  heroesSection: {
    marginBottom: 32,
  },
  heroesDisplay: {
    flexDirection: 'row',
    gap: 16,
  },
  heroDisplayCard: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 80,
  },
  heroDisplayImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  heroDisplayName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  heroDisplayRole: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  cardActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  passButton: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#FF4458',
  },
  likeButton: {
    backgroundColor: '#FF4458',
  },
  passButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF4458',
  },
  likeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});