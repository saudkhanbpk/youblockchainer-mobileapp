import React, {useContext, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GetStarted from '../screens/OnBoarding/GetStarted';
import Loading from '../components/Loading';
// import StorageManager from '../storage/StorageManager';
// import {ONBOARDED} from '../storage/StorageKeys';
import {GlobalContext} from '../auth/GlobalProvider';

const RootStackScreen = ({navigation}) => {
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true);
  const {signedIn} = useContext(GlobalContext);

  const postConnection = async () => {
    setLoading(true);
    if (signedIn) {
      navigation.replace('MainDrawer');
    }
    setLoading(false);
  };

  useEffect(() => {
    postConnection();
  }, [signedIn]);

  return loading ? (
    <Loading />
  ) : (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
    </Stack.Navigator>
  );
};

export default RootStackScreen;
