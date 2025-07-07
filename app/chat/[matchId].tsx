import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Heart, Image as ImageIcon, X, MapPin, Crown, Gem } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: string;
  type: 'text' | 'match' | 'diamond';
  diamondCount?: number;
}

// Mock messages data - expanded to include new matches
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: '10:30 AM',
      type: 'match',
    },
    {
      id: '2',
      text: 'Hey! How are you?',
      isMe: false,
      timestamp: '10:32 AM',
      type: 'text',
    },
    {
      id: '3',
      text: 'Hi Sofia! I\'m doing great, thanks! How about you?',
      isMe: true,
      timestamp: '10:35 AM',
      type: 'text',
    },
    {
      id: '4',
      text: 'I\'m good! I saw you love coffee too ☕️',
      isMe: false,
      timestamp: '10:38 AM',
      type: 'text',
    },
    {
      id: '5',
      text: 'Yes! I\'m always looking for new coffee shops to try. Any recommendations?',
      isMe: true,
      timestamp: '10:40 AM',
      type: 'text',
    },
  ],
  '2': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: '2:15 PM',
      type: 'match',
    },
    {
      id: '2',
      text: 'Would love to meet up!',
      isMe: false,
      timestamp: '2:18 PM',
      type: 'text',
    },
  ],
  '3': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: '9:45 AM',
      type: 'match',
    },
    {
      id: '2',
      text: 'Thanks for the like! 😊',
      isMe: false,
      timestamp: '9:47 AM',
      type: 'text',
    },
  ],
  '4': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: 'Yesterday',
      type: 'match',
    },
    {
      id: '2',
      text: 'Great photos! 📸',
      isMe: false,
      timestamp: 'Yesterday',
      type: 'text',
    },
  ],
  // New matches - start with just the match message
  '5': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: 'Just now',
      type: 'match',
    },
  ],
  '6': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: 'Just now',
      type: 'match',
    },
  ],
  '7': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: 'Just now',
      type: 'match',
    },
  ],
  '8': [
    {
      id: '1',
      text: "It's a match! 🎉",
      isMe: false,
      timestamp: 'Just now',
      type: 'match',
    },
  ],
};

const matchNames: Record<string, string> = {
  '1': 'Sofia',
  '2': 'Elena',
  '3': 'Marina',
  '4': 'Valentina',
  '5': 'Lucia',
  '6': 'Isabella',
  '7': 'Camila',
  '8': 'Beatriz',
};

// Mock profile data for matches - expanded to include new matches
const matchProfiles: Record<string, any> = {
  '1': {
    name: 'Sofia',
    age: 25,
    location: 'São Paulo, SP',
    bio: 'Adventure seeker, coffee lover ☕️ Looking for someone to explore the city with and maybe find some hidden gems!',
    photos: [
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'epic',
    selectedLanes: ['mid', 'roam'],
    favoriteHeroes: ['kagura', 'angela', 'chang_e'],
  },
  '2': {
    name: 'Elena',
    age: 28,
    location: 'Rio de Janeiro, RJ',
    bio: 'Artist & dreamer 🎨✨ Love creating beautiful things and playing ML in my free time.',
    photos: [
      'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'legend',
    selectedLanes: ['gold', 'mid'],
    favoriteHeroes: ['granger', 'claude', 'harith'],
  },
  '3': {
    name: 'Marina',
    age: 26,
    location: 'Belo Horizonte, MG',
    bio: 'Fitness enthusiast & dog mom 🐕 When I\'m not at the gym, you\'ll find me climbing ranks in Mobile Legends. Main tank but can flex to other roles. Let\'s duo and dominate!',
    photos: [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'mythic',
    selectedLanes: ['roam', 'exp'],
    favoriteHeroes: ['tigreal', 'angela', 'fanny'],
  },
  '4': {
    name: 'Valentina',
    age: 24,
    location: 'Salvador, BA',
    bio: 'Photographer capturing life 📸 Love taking photos and playing Mobile Legends. Always looking for new adventures and duo partners. Can we climb to Mythical Glory together?',
    photos: [
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'grandmaster',
    selectedLanes: ['jungle', 'mid'],
    favoriteHeroes: ['fanny', 'gusion', 'kagura'],
  },
  '5': {
    name: 'Lucia',
    age: 27,
    location: 'Belo Horizonte, MG',
    bio: 'Traveler & foodie 🌍🍜 Always up for new adventures and duo ranked games!',
    photos: [
      'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'mythic',
    selectedLanes: ['jungle', 'exp'],
    favoriteHeroes: ['fanny', 'ling', 'gusion'],
  },
  '6': {
    name: 'Isabella',
    age: 24,
    location: 'Salvador, BA',
    bio: 'Beach lover 🏖️ and ML enthusiast! Looking for someone to climb ranks with.',
    photos: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'grandmaster',
    selectedLanes: ['roam', 'mid'],
    favoriteHeroes: ['angela', 'tigreal', 'kagura'],
  },
  '7': {
    name: 'Camila',
    age: 26,
    location: 'Porto Alegre, RS',
    bio: 'Competitive gamer 🎮 Always aiming for Mythical Glory! Let\'s duo and dominate!',
    photos: [
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'mythical_honor',
    selectedLanes: ['gold', 'jungle'],
    favoriteHeroes: ['granger', 'claude', 'fanny'],
  },
  '8': {
    name: 'Beatriz',
    age: 23,
    location: 'Fortaleza, CE',
    bio: 'Support main 💖 Love helping my team win! Looking for a reliable ADC partner.',
    photos: [
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    currentRank: 'legend',
    selectedLanes: ['roam', 'gold'],
    favoriteHeroes: ['angela', 'estes', 'rafaela'],
  },
};

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
  { id: 'estes', name: 'Estes', image: require('../../img/hero/Estes.webp'), role: 'Support' },
  { id: 'rafaela', name: 'Rafaela', image: require('../../img/hero/Rafaela.webp'), role: 'Support' },
];

// Diamond packages for sending
const diamondPackages = [
  { id: '1', count: 1, price: '$0.99', color: '#60A5FA' },
  { id: '5', count: 5, price: '$4.99', color: '#8B5CF6' },
  { id: '10', count: 10, price: '$9.99', color: '#F59E0B' },
  { id: '25', count: 25, price: '$19.99', color: '#EF4444' },
  { id: '50', count: 50, price: '$39.99', color: '#10B981' },
  { id: '100', count: 100, price: '$79.99', color: '#F97316' },
];

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  if (message.type === 'match') {
    return (
      <View style={styles.matchMessage}>
        <LinearGradient
          colors={['#FF4458', '#FF8A00']}
          style={styles.matchGradient}
        >
          <Heart size={20} color="#ffffff" fill="#ffffff" />
          <Text style={styles.matchText}>{message.text}</Text>
        </LinearGradient>
      </View>
    );
  }

  if (message.type === 'diamond') {
    return (
      <View style={[
        styles.diamondMessage,
        message.isMe ? styles.myDiamondMessage : styles.theirDiamondMessage
      ]}>
        <LinearGradient
          colors={message.isMe ? ['#8B5CF6', '#EC4899'] : ['#60A5FA', '#3B82F6']}
          style={styles.diamondGradient}
        >
          <View style={styles.diamondContent}>
            <Gem size={24} color="#ffffff" fill="#ffffff" />
            <Text style={styles.diamondText}>
              {message.diamondCount} Diamond{message.diamondCount !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.diamondSubtext}>
              {message.isMe ? 'Sent' : 'Received'}
            </Text>
          </View>
        </LinearGradient>
        <Text style={styles.diamondTimestamp}>
          {message.timestamp}
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.messageBubble,
      message.isMe ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={[
        styles.messageText,
        message.isMe ? styles.myMessageText : styles.theirMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp}
      </Text>
    </View>
  );
}

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

interface ProfileModalProps {
  visible: boolean;
  profile: any;
  onClose: () => void;
}

function ProfileModal({ visible, profile, onClose }: ProfileModalProps) {
  if (!profile) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.profileModalContainer}>
        <View style={styles.profileModalHeader}>
          <Text style={styles.profileModalTitle}>{profile.name}'s Profile</Text>
          <TouchableOpacity style={styles.profileModalCloseButton} onPress={onClose}>
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.profileModalContent}>
          {/* Profile Photos */}
          <View style={styles.profilePhotosSection}>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.photosScrollView}
            >
              {profile.photos.map((photo: string, index: number) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.profilePhoto} />
                </View>
              ))}
            </ScrollView>
            
            {/* Photo indicators */}
            {profile.photos.length > 1 && (
              <View style={styles.photoIndicators}>
                {profile.photos.map((_: any, index: number) => (
                  <View key={index} style={styles.photoIndicator} />
                ))}
              </View>
            )}
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfoSection}>
            <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
            
            <View style={styles.profileLocationRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.profileLocation}>{profile.location}</Text>
            </View>

            <Text style={styles.profileBio}>{profile.bio}</Text>

            {/* Current Rank */}
            <View style={styles.profileGameStatsRow}>
              <RankDisplay rankId={profile.currentRank} />
            </View>
          </View>

          {/* Preferred Lanes */}
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Preferred Lanes</Text>
            <LaneDisplay laneIds={profile.selectedLanes} />
          </View>

          {/* Favorite Heroes */}
          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Favorite Heroes</Text>
            <HeroDisplay heroIds={profile.favoriteHeroes} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

interface DiamondModalProps {
  visible: boolean;
  matchName: string;
  onClose: () => void;
  onSendDiamonds: (count: number) => void;
}

function DiamondModal({ visible, matchName, onClose, onSendDiamonds }: DiamondModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleSendDiamonds = () => {
    if (selectedPackage) {
      const packageData = diamondPackages.find(pkg => pkg.id === selectedPackage);
      if (packageData) {
        onSendDiamonds(packageData.count);
        setSelectedPackage(null);
        onClose();
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.diamondModalOverlay}>
        <View style={styles.diamondModalContent}>
          <View style={styles.diamondModalHeader}>
            <Text style={styles.diamondModalTitle}>Send Diamonds</Text>
            <TouchableOpacity style={styles.diamondModalCloseButton} onPress={onClose}>
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <View style={styles.diamondModalBody}>
            <Text style={styles.diamondModalSubtitle}>
              Send diamonds to {matchName} to show your appreciation! 💎
            </Text>

            <View style={styles.diamondPackagesGrid}>
              {diamondPackages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.diamondPackage,
                    selectedPackage === pkg.id && styles.diamondPackageSelected,
                    { borderColor: pkg.color }
                  ]}
                  onPress={() => setSelectedPackage(pkg.id)}
                >
                  <LinearGradient
                    colors={selectedPackage === pkg.id ? [pkg.color, pkg.color + '80'] : ['#F9FAFB', '#F3F4F6']}
                    style={styles.diamondPackageGradient}
                  >
                    <Gem 
                      size={32} 
                      color={selectedPackage === pkg.id ? '#ffffff' : pkg.color} 
                      fill={selectedPackage === pkg.id ? '#ffffff' : pkg.color}
                    />
                    <Text style={[
                      styles.diamondPackageCount,
                      selectedPackage === pkg.id && styles.diamondPackageCountSelected
                    ]}>
                      {pkg.count}
                    </Text>
                    <Text style={[
                      styles.diamondPackagePrice,
                      selectedPackage === pkg.id && styles.diamondPackagePriceSelected
                    ]}>
                      {pkg.price}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.diamondModalNote}>
              💡 This is a demo feature. In a real app, this would integrate with RevenueCat for in-app purchases.
            </Text>
          </View>

          <View style={styles.diamondModalActions}>
            <TouchableOpacity style={styles.diamondModalCancelButton} onPress={onClose}>
              <Text style={styles.diamondModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.diamondModalSendButton,
                !selectedPackage && styles.diamondModalSendButtonDisabled
              ]} 
              onPress={handleSendDiamonds}
              disabled={!selectedPackage}
            >
              <LinearGradient
                colors={selectedPackage ? ['#8B5CF6', '#EC4899'] : ['#D1D5DB', '#9CA3AF']}
                style={styles.diamondModalSendGradient}
              >
                <Gem size={20} color="#ffffff" />
                <Text style={styles.diamondModalSendText}>Send Diamonds</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages[matchId] || []);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [diamondModalVisible, setDiamondModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const matchName = matchNames[matchId] || 'Unknown';
  const matchProfile = matchProfiles[matchId];

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        isMe: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Auto-scroll to bottom after sending message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const sendDiamonds = (count: number) => {
    const diamondMessage: Message = {
      id: Date.now().toString(),
      text: '',
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'diamond',
      diamondCount: count,
    };
    
    setMessages(prev => [...prev, diamondMessage]);
    
    // Auto-scroll to bottom after sending diamonds
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Show success alert
    Alert.alert(
      'Diamonds Sent! 💎',
      `You sent ${count} diamond${count !== 1 ? 's' : ''} to ${matchName}!`,
      [{ text: 'OK' }]
    );
  };

  const handleHeaderPress = () => {
    if (matchProfile) {
      setProfileModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerCenter}
          onPress={handleHeaderPress}
          disabled={!matchProfile}
        >
          <Text style={styles.headerTitle}>{matchName}</Text>
          {matchProfile && (
            <Text style={styles.headerSubtitle}>Tap to view profile</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <View style={[styles.onlineIndicator, styles.online]} />
        </View>
      </View>

      {/* Main Content with Keyboard Avoiding */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.messagesContainer}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.imageButton}>
              <ImageIcon size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.diamondButton}
              onPress={() => setDiamondModalVisible(true)}
            >
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.diamondButtonGradient}
              >
                <Gem size={20} color="#ffffff" fill="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            
            <TouchableOpacity 
              style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Send size={20} color={message.trim() ? "#ffffff" : "#9CA3AF"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Profile Modal */}
      <ProfileModal
        visible={profileModalVisible}
        profile={matchProfile}
        onClose={() => setProfileModalVisible(false)}
      />

      {/* Diamond Modal */}
      <DiamondModal
        visible={diamondModalVisible}
        matchName={matchName}
        onClose={() => setDiamondModalVisible(false)}
        onSendDiamonds={sendDiamonds}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  online: {
    backgroundColor: '#4ADE80',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  matchMessage: {
    alignItems: 'center',
    marginVertical: 16,
  },
  matchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  matchText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  diamondMessage: {
    alignItems: 'center',
    marginVertical: 12,
  },
  myDiamondMessage: {
    alignSelf: 'flex-end',
  },
  theirDiamondMessage: {
    alignSelf: 'flex-start',
  },
  diamondGradient: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  diamondContent: {
    alignItems: 'center',
    gap: 4,
  },
  diamondText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  diamondSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  diamondTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF4458',
    borderBottomRightRadius: 6,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  myMessageText: {
    color: '#ffffff',
  },
  theirMessageText: {
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  imageButton: {
    padding: 8,
    marginBottom: 4,
  },
  diamondButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 2,
  },
  diamondButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: '#FF4458',
  },
  // Diamond Modal Styles
  diamondModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondModalContent: {
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
  diamondModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  diamondModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  diamondModalCloseButton: {
    padding: 8,
  },
  diamondModalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  diamondModalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  diamondPackagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  diamondPackage: {
    width: '30%',
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  diamondPackageSelected: {
    borderWidth: 3,
  },
  diamondPackageGradient: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  diamondPackageCount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  diamondPackageCountSelected: {
    color: '#ffffff',
  },
  diamondPackagePrice: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  diamondPackagePriceSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  diamondModalNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  diamondModalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  diamondModalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  diamondModalCancelText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  diamondModalSendButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  diamondModalSendButtonDisabled: {
    opacity: 0.5,
  },
  diamondModalSendGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  diamondModalSendText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  // Profile Modal Styles
  profileModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  profileModalCloseButton: {
    padding: 8,
  },
  profileModalContent: {
    flex: 1,
  },
  profilePhotosSection: {
    height: 400,
    backgroundColor: '#ffffff',
    marginBottom: 16,
    position: 'relative',
  },
  photosScrollView: {
    flex: 1,
  },
  photoContainer: {
    width: screenWidth,
    height: 400,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  photoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  profileInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  profileLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  profileBio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  profileGameStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  rankDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankDisplayImage: {
    width: 18,
    height: 18,
  },
  rankDisplayText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileSectionTitle: {
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
});