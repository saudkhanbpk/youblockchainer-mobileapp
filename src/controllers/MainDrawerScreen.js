import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Tophead from '../components/Tophead';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatBot from '../screens/ChatBot';
import SearchEntity from '../screens/Entities';
import SearchExpert from '../screens/Experts';
import Profile from '../screens/Profile';
import CustomDrawerContent from '../components/CustomDrawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useTabInitializer from '../utils/useTabInitializer';
import Loading from '../components/Loading';
import RoomsScreen from '../screens/Chats';
import ChatScreen from '../screens/Chats/ChatScreen';
import ExpertDetail from '../screens/Experts/ExpertDetail';
import EditProfile from '../screens/Profile/EditProfile';
import AgreementModal from '../components/Agreements/AgreementModal';

const Drawer = createDrawerNavigator();
const ChatBotStack = createNativeStackNavigator();
const EntityStack = createNativeStackNavigator();
const ExpertStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

const MainDrawerScreen = props => {
  const {colors} = useTheme();
  const {loading} = useTabInitializer();
  // const size = 26;

  return loading ? (
    <Loading />
  ) : (
    <View style={{flex: 1}}>
      <Drawer.Navigator
        drawerContent={CustomDrawerContent}
        screenOptions={{
          header: ({navigation}) => <Tophead navigation={navigation} />,
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textAfter,
          drawerActiveBackgroundColor: 'transparent',
          drawerStyle: {
            minWidth: 250,
            width: '60%',
          },
        }}>
        <Drawer.Screen
          name="ChatBot"
          component={ChatBotStackScreen}
          // options={{
          //   drawerLabel: ({focused, color}) => (
          //     <Text style={{color: color, fontSize: 16, letterSpacing: 1}}>
          //       Home
          //     </Text>
          //   ),
          //   drawerIcon: ({focused, color}) => (
          //     <MaterialCommunityIcons
          //       name="home-variant"
          //       size={size}
          //       color={color}
          //     />
          //   ),
          // }}
        />
        <Drawer.Screen
          name="Expert"
          component={ExpertStackScreen}
          // options={{
          //   drawerLabel: ({focused, color}) => (
          //     <Text style={{color: color, fontSize: 16, letterSpacing: 1}}>
          //       Experts
          //     </Text>
          //   ),
          //   drawerIcon: ({focused, color}) => (
          //     <MaterialCommunityIcons
          //       name="account-search"
          //       size={size}
          //       color={color}
          //     />
          //   ),
          // }}
        />
        <Drawer.Screen
          name="Entity"
          component={EntityStackScreen}
          // options={{
          //   drawerLabel: ({focused, color}) => (
          //     <Text style={{color: color, fontSize: 16, letterSpacing: 1}}>
          //       Entities
          //     </Text>
          //   ),
          //   drawerIcon: ({focused, color}) => (
          //     <MaterialCommunityIcons
          //       name="feature-search"
          //       size={size}
          //       color={color}
          //     />
          //   ),
          // }}
        />
        <Drawer.Screen name="Chats" component={ChatStackScreen} />
        <Drawer.Screen
          name="Profile"
          component={ProfileStackScreen}
          // options={{
          //   drawerLabel: ({focused, color}) => (
          //     <Text style={{color: color, fontSize: 16, letterSpacing: 1}}>
          //       Profile
          //     </Text>
          //   ),
          //   drawerIcon: ({focused, color}) => (
          //     <MaterialCommunityIcons name="account" size={size} color={color} />
          //   ),
          // }}
        />
      </Drawer.Navigator>
      <AgreementModal />
    </View>
  );
};

const ChatBotStackScreen = () => {
  return (
    <ChatBotStack.Navigator screenOptions={{headerShown: false}}>
      <ChatBotStack.Screen name="ChatBotMain" component={ChatBot} />
    </ChatBotStack.Navigator>
  );
};

const EntityStackScreen = () => {
  return (
    <EntityStack.Navigator screenOptions={{headerShown: false}}>
      <EntityStack.Screen name="SearchEntity" component={SearchEntity} />
    </EntityStack.Navigator>
  );
};

const ExpertStackScreen = () => {
  return (
    <ExpertStack.Navigator screenOptions={{headerShown: false}}>
      <ExpertStack.Screen name="SearchExpert" component={SearchExpert} />
      <ExpertStack.Screen name="ExpertDetail" component={ExpertDetail} />
    </ExpertStack.Navigator>
  );
};

const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator screenOptions={{headerShown: false}}>
      <ChatStack.Screen name="Rooms" component={RoomsScreen} />
      <ChatStack.Screen name="Chat" component={ChatScreen} />
    </ChatStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="ProfileMain" component={Profile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
    </ProfileStack.Navigator>
  );
};

export default MainDrawerScreen;
