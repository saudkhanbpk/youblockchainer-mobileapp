import {useWalletConnect} from '@walletconnect/react-native-dapp';
import React, {useEffect, useState} from 'react';
import {useContext} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import {Avatar, IconButton, Text, useTheme} from 'react-native-paper';
import {GlobalContext} from '../auth/GlobalProvider';
import StorageManager from '../storage/StorageManager';
import {defaultAvatar} from '../Constants';

const Tophead = ({navigation}) => {
  const connector = useWalletConnect();
  const {colors} = useTheme();
  const {connect, disconnect, user} = useContext(GlobalContext);
  const [connection, setConnection] = useState(null);

  const getConnection = async () => {
    let val = await StorageManager.get('connection');
    setConnection(val);
  };

  useEffect(() => {
    getConnection();
  }, [connector]);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <IconButton
          icon={'menu'}
          size={26}
          iconColor={colors.primary}
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
        {/* <TouchableOpacity
          style={{
            backgroundColor: colors.secondary,
            padding: 10,
            marginRight: 10,
          }}
          onPress={
            connector.connected
              ? () =>
                  Alert.alert(
                    'Are you sure ?',
                    'You want to disconnect your wallet',
                    [
                      {
                        text: 'cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'ok',
                        onPress: disconnect,
                      },
                    ],
                  )
              : connect
          }>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 10}}>
            {connector.connected ? 'Disconnect' : 'Connect'} wallet
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          disabled={!user}
          onPress={() => navigation.navigate('Profile')}>
          <Avatar.Image
            source={{
              uri:
                user && user.profileImage ? user.profileImage : defaultAvatar,
            }}
            size={35}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
    borderRadius: 10,
  },
  // dropdown1BtnStyle: {
  //   flex: 1,
  //   height: 50,
  //   backgroundColor: '#FFF',
  //   borderRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#444',
  // },
});

export default Tophead;
