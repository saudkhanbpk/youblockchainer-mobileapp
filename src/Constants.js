import {Dimensions, Platform} from 'react-native';
import {io} from 'socket.io-client';

export const {height, width} = Dimensions.get('window');
export const base =
  'http://ec2-13-51-105-31.eu-north-1.compute.amazonaws.com:3000'; //'https://app.myreeldream.ai';
export const baseUrl = `${base}/api/v1`;
// export const contractAddress = '0xc83589897479A672d9496307E24D16ab1658c4aF';
// export const forwarderAddress = '0x2604441A291eF0EEba319a4Fd959Fa8e96899e8E';
export const socket = io.connect(base);

export const defaultAvatar =
  'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg';
// export const rpcConfig = {
//   rpc: {
//     80001: 'https://rpc-mumbai.maticvigil.com',
//   },
//   chainId: 80001,
//   qrcode: false,
// };

export const rpcConfig = {
  rpc: {
    84531: 'https://goerli.base.org',
  },
  chainId: 84531,
  qrcode: false,
};

export const http_provider = 'https://goerli.base.org';
// export const MetaMaskNetworkObject = {
//   chainId: require('web3').utils.toHex(rpcConfig.chainId),
//   chainName: 'Mumbai(Polygon) Testnet',
//   nativeCurrency: {name: 'MATIC', symbol: 'MATIC', decimals: 18},
//   rpcUrls: [rpcConfig.rpc[rpcConfig.chainId]],
//   blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
// };

export const MetaMaskNetworkObject = {
  chainId: require('web3').utils.toHex(rpcConfig.chainId),
  chainName: 'Base Goerli Testnet',
  nativeCurrency: {name: 'ETH', symbol: 'ETH', decimals: 18},
  rpcUrls: [rpcConfig.rpc[rpcConfig.chainId]],
  blockExplorerUrls: ['https://goerli.basescan.org/'],
};

export const WALLET_STATES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'not_connected',
  CONNECTING: 'connecting',
};

export const ARCANA_KEY = 'xar_test_e8594125dd04911a91d2f3e58e645e3d0ef33f05';
// export const etherScanApiToken = 'R782X6XWEFS1N52RK3V47CC3BYP6H43W2P';
// export const alchemyApiToken = '1t7-El0FDwdi9miOxMFUKKd69Fuk0eXT';
// export const etherScanURL = 'https://goerli.etherscan.io';
export const appLogo = require('./assets/img/logo_renew.png');
