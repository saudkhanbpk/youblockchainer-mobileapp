import {Dimensions} from 'react-native';
import {io} from 'socket.io-client';

export const {height, width} = Dimensions.get('window');
export const base = 'http://13.51.252.66';
export const baseUrl = `${base}/api/v1`;
export const contractAddress = '0x8E38A526b11a42c5baEB5866d9dad0e6f1b2790C';
export const forwarderAddress = '0x740f39D16226c00bfb7932a8087778a7Ce6A92FB';
export const socket = io.connect(base);

export const defaultAvatar =
  'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg';
export const rpcConfig = {
  rpc: {
    80001: 'https://rpc-mumbai.maticvigil.com',
  },
  chainId: 80001,
  qrcode: false,
};
export const etherScanApiToken = 'R782X6XWEFS1N52RK3V47CC3BYP6H43W2P';
export const alchemyApiToken = '1t7-El0FDwdi9miOxMFUKKd69Fuk0eXT';
export const etherScanURL = 'https://goerli.etherscan.io';
export const appLogo = require('./assets/img/logo.png');
