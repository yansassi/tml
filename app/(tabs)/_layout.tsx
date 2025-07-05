import { Tabs } from 'expo-router';
import { Flame, MessageCircle, User, Settings } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#FF4458',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter-Medium',
            marginTop: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Discover',
            tabBarIcon: ({ size, color }) => (
              <Flame size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matches',
            tabBarIcon: ({ size, color }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ size, color }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}