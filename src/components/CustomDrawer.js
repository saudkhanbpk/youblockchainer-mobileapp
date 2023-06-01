import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import {useContext, useMemo} from 'react';
import {View} from 'react-native';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {GlobalContext} from '../auth/GlobalProvider';
import {Alert} from 'react-native';
import {appLogo} from '../Constants';
import {Image} from 'react-native';

const DrawerRow = ({
  navigation,
  focused,
  label,
  icon,
  route,
  active,
  inactive,
  onClick,
  disabled,
}) => {
  const size = 26;
  return (
    <DrawerItem
      style={{opacity: disabled ? 0.7 : 1}}
      label={() => (
        <Text
          style={{
            color: focused ? active : inactive,
            fontSize: 16,
            letterSpacing: 1,
            width: 120,
          }}>
          {label}
        </Text>
      )}
      icon={() => (
        <MaterialCommunityIcons
          name={icon}
          size={size}
          color={focused ? active : inactive}
        />
      )}
      onPress={
        disabled
          ? () => {}
          : onClick
          ? onClick
          : () => navigation.navigate(route)
      }
    />
  );
};
const CustomDrawerContent = props => {
  const {navigation} = props;
  const {colors} = useTheme();
  const {routes, index} = props.state;
  const connector = useWalletConnect();
  const {connect, disconnect, signedIn} = useContext(GlobalContext);
  const availableRoutes = useMemo(() => {
    return {
      ChatBot: {
        label: 'Home',
        icon: 'home-variant',
      },
      Expert: {
        label: 'Experts',
        icon: 'account-search',
      },
      Entity: {
        label: 'Organizations',
        icon: 'feature-search',
      },
      Chats: {
        label: 'Chats',
        icon: 'chat',
        disabled: !signedIn,
      },
      Profile: {
        label: 'Profile',
        icon: 'account',
        disabled: !signedIn,
      },
    };
  }, [signedIn]);

  return (
    <DrawerContentScrollView {...props}>
      <Image style={{height: 110, width: 100, margin: 20}} source={appLogo} />
      {Object.entries(availableRoutes).map(i => (
        <DrawerRow
          key={i[0]}
          navigation={navigation}
          focused={routes[index].name === i[0]}
          label={i[1].label}
          icon={i[1].icon}
          disabled={i[1].disabled}
          route={i[0]}
          active={colors.primary}
          inactive={colors.textAfter}
        />
      ))}

      <View style={{marginTop: '100%'}}>
        <DrawerRow
          label={connector.connected ? 'Disconnect\nWallet' : 'Connect\nWallet'}
          icon={connector.connected ? 'logout' : 'login'}
          inactive={colors.textAfter}
          onClick={
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
          }
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
