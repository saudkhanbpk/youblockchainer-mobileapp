import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';
import RootStackScreen from './RootStackScreen';
import MainDrawerScreen from './MainDrawerScreen';
import {GlobalContext} from '../auth/GlobalProvider';
import API, {ENDPOINTS} from '../api/apiService';

const Navigator = props => {
  const Stack = createNativeStackNavigator();
  const {setVideos} = useContext(GlobalContext);

  const getVideos = async () => {
    try {
      let data = await API.get(ENDPOINTS.GET_VIDEOS);
      setVideos(data);
    } catch (error) {
      console.log('Error in getting videos:- ', error.message);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

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
