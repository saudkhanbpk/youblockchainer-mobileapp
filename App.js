import './shim';
import React, {useEffect} from 'react';
import {LogBox, StatusBar} from 'react-native';
import GlobalProvider from './src/auth/GlobalProvider';
import {
  Provider as PaperProvider,
  //DarkTheme as DefaultTheme,
  DefaultTheme,
  configureFonts,
  Text,
  Title,
  Paragraph,
} from 'react-native-paper';
import Navigator from './src/controllers/Navigator';
import {NavigationContainer} from '@react-navigation/native';
import WalletConnectProvider from '@walletconnect/react-native-dapp';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {appLogo} from './src/Constants';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3770FF',
    secondary: '#7D93AF',
    accent: '#000D99',
    bubble: '#3ED1CF',
    button: '#009946',
    disabled: '#C9D0DB',
    star: '#FFD700',
    error: '#FFB3C0',
    error_light: 'rgba(255, 179, 192, 0.27)',
    accent_light: 'rgba(127, 218, 192, 0.27)',
    backgroundLight: '#ffffff',
    text: '#000000',
    textBefore: '#F4F4F4',
    textAfter: '#6A707F',
    border: '#636363',
  },
  fonts: configureFonts(fontConfig),
};

LogBox.ignoreAllLogs();

// const config = {
//   screens: {
//     MainTab: {
//       screens: {
//         Home: {
//           screens: {
//             OfferDetail: {
//               path: 'offerdetails/:id',
//               parse: {
//                 id: String,
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// };

const App = () => {
  useEffect(() => {
    Text.defaultProps = {
      allowFontScaling: false,
    };

    Title.defaultProps = {
      allowFontScaling: false,
    };

    Paragraph.defaultProps = {
      allowFontScaling: false,
    };
  }, []);
  return (
    <WalletConnectProvider
      //uri="wc:00e46b69-d0cc-4b3e-b6a2-cee442f97188@1?bridge=https%3A%2F%2Fbridge.walletconnect.orgkey=91303dedf64285cbbaf9120f6e9d160a5c8aa3deb67017a3874cd272323f48ae"
      // redirectUrl={
      //   'wc://wc?uri=wc:00e46b69-d0cc-4b3e-b6a2-cee442f97188@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=91303dedf64285cbbaf9120f6e9d160a5c8aa3deb67017a3874cd272323f48ae'
      // }
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}
      clientMeta={{
        description: 'Connect to Youblockchainer App',
        url: 'https://youblockchainer.xyz',
        icons: [appLogo],
        name: 'Youblockchainer',
      }}>
      <GlobalProvider>
        <StatusBar backgroundColor={theme.colors.primary} />
        <PaperProvider theme={theme}>
          <NavigationContainer
          // linking={{
          //   prefixes: [
          //     'nfthodlr://',
          //     'https://app.nfthodlr.xyz',
          //     'http://app.nfthodlr.xyz',
          //   ],
          //   config,
          // }}
          // fallback={<Loading />}
          >
            <Navigator />
          </NavigationContainer>
        </PaperProvider>
      </GlobalProvider>
    </WalletConnectProvider>
  );
};

export default App;
