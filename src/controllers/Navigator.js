import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import RootStackScreen from './RootStackScreen';
import MainDrawerScreen from './MainDrawerScreen';

const Navigator = props => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'RootStack'}>
      <Stack.Screen name="RootStack" component={RootStackScreen} />
      <Stack.Screen name={'MainDrawer'} component={MainDrawerScreen} />
    </Stack.Navigator>
  );
};

export default Navigator;
