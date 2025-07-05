import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Heart } from 'lucide-react-native';
import { router } from 'expo-router';

// Mock matches data
const matches = [
  {
    id: 1,
    name: 'Sofia',
    photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
    lastMessage: 'Hey! How are you?',
    timestamp: '2 min ago',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Elena',
    photo: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=200',
    lastMessage: 'Would love to meet up!',
    timestamp: '1 hour ago',
    isOnline: false,
  },
  {
    id: 3,
    name: 'Marina',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    lastMessage: 'Thanks for the like! 😊',
    timestamp: '3 hours ago',
    isOnline: true,
  },
  {
    id: 4,
    name: 'Valentina',
    photo: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=200',
    lastMessage: 'Great photos! 📸',
    timestamp: '1 day ago',
    isOnline: false,
  },
];

const newMatches = [
  {
    id: 5,
    name: 'Lucia',
    photo: 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 6,
    name: 'Isabella',
    photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 7,
    name: 'Camila',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 8,
    name: 'Beatriz',
    photo: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

interface MatchItemProps {
  match: typeof matches[0];
}

function MatchItem({ match }: MatchItemProps) {
  const handlePress = () => {
    router.push(`/chat/${match.id}`);
  };

  return (
    <TouchableOpacity style={styles.matchItem} onPress={handlePress}>
      <View style={styles.matchImageContainer}>
        <Image source={{ uri: match.photo }} style={styles.matchImage} />
        {match.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{match.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {match.lastMessage}
        </Text>
      </View>
      
      <View style={styles.matchMeta}>
        <Text style={styles.timestamp}>{match.timestamp}</Text>
        <MessageCircle size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

interface NewMatchItemProps {
  match: typeof newMatches[0];
}

function NewMatchItem({ match }: NewMatchItemProps) {
  const handlePress = () => {
    // Navigate to chat with the new match
    router.push(`/chat/${match.id}`);
  };

  return (
    <TouchableOpacity style={styles.newMatchItem} onPress={handlePress}>
      <Image source={{ uri: match.photo }} style={styles.newMatchImage} />
      <View style={styles.newMatchOverlay}>
        <Heart size={20} color="#ffffff" fill="#ffffff" />
      </View>
      <Text style={styles.newMatchName}>{match.name}</Text>
      <Text style={styles.newMatchAction}>Tap to chat</Text>
    </TouchableOpacity>
  );
}

export default function MatchesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <Text style={styles.matchCount}>{matches.length + newMatches.length}</Text>
      </View>

      {newMatches.length > 0 && (
        <View style={styles.newMatchesSection}>
          <Text style={styles.sectionTitle}>New Matches</Text>
          <Text style={styles.sectionSubtitle}>
            {newMatches.length} new people liked you back! Start a conversation.
          </Text>
          <FlatList
            horizontal
            data={newMatches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <NewMatchItem match={item} />}
            contentContainerStyle={styles.newMatchesList}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.messagesSection}>
        <Text style={styles.sectionTitle}>Messages</Text>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MatchItem match={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
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
  matchCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF4458',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newMatchesSection: {
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  newMatchesList: {
    paddingHorizontal: 20,
  },
  newMatchItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 90,
  },
  newMatchImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF4458',
  },
  newMatchOverlay: {
    position: 'absolute',
    bottom: 32,
    right: -4,
    backgroundColor: '#FF4458',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  newMatchName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  newMatchAction: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FF4458',
    marginTop: 2,
    textAlign: 'center',
  },
  messagesSection: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 20,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  matchImageContainer: {
    position: 'relative',
  },
  matchImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: '#4ADE80',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  matchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  matchName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  matchMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
});