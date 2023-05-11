import {useWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, {createContext, useMemo, useState} from 'react';
import {ToastAndroid} from 'react-native';
import API, {ENDPOINTS} from '../api/apiService';
import Web3 from 'web3';
import StorageManager from '../storage/StorageManager';
import {PLATFORM, rpcConfig} from '../Constants';
import {API_TOKEN, ONBOARDED, USER} from '../storage/StorageKeys';
import {useEffect} from 'react';
import {getMe, getUserNFTs} from '../utils/userAPI';

export const GlobalContext = createContext();

const GlobalProvider = ({children}) => {
  const connector = useWalletConnect();
  const [chainId, setChainId] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChainChanged = async chainId => {
    // console.log(chainId);
    if (!!chainId && chainId !== rpcConfig.chainId) {
      let res = web3Provider;
      if (!res) {
        res = new WalletConnectProvider({
          ...rpcConfig,
          connector,
        });
        await res.enable();
      }
      try {
        res.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: `0x${rpcConfig.chainId}`}],
        });
      } catch (error) {
        console.log('Switching Error:- ' + error.message);
      }
    }
  };

  const getCreateUser = async address => {
    if (signedIn) {
      // let res = await StorageManager.get(USER);
      // if (res) return setUser(res);
      console.log('Call User API:- ', address);
      if (address === null || address === undefined) {
        await connector.killSession("Wallet did'nt connect properly");
        throw new Error("Wallet did'nt connect properly");
      }
      await getMe(setUser);
      return;
    }
    await loginAccount();
  };

  const initializeWeb3 = async w3 => {
    try {
      let res = w3;
      if (res === undefined || res === null) {
        const provider = new WalletConnectProvider({
          ...rpcConfig,
          connector,
        });
        await provider.enable();
        provider.chainId = rpcConfig.chainId;
        setWeb3Provider(provider);
        res = new Web3(provider);
        setWeb3(res);
        console.log('created web3');
      }

      // const accounts = await res.eth.getAccounts();
      // console.log('EthAccounts:-', accounts);
      // let cd = await API.get(ENDPOINTS.GET_LATEST_CONTRACTADDRESS);
      // setContractAddress(cd.contractAddress);
      // console.log(cd);
      // const contract = new res.eth.Contract(OfferFactory, cd.contractAddress);
      // // console.log(contract);
      // setOfferFactory(contract);
      // console.log('offerfactory setup done');
    } catch (error) {
      console.log(error);
    }
  };

  const loginAccount = async () => {
    try {
      const provider = new WalletConnectProvider({
        ...rpcConfig,
        connector,
      });
      await provider.enable();
      provider.chainId = rpcConfig.chainId;
      setWeb3Provider(provider);
      // provider.on('chainChanged', onChainChanged);
      const res = new Web3(provider);
      setWeb3(res);

      console.log('Web3 signature');
      //console.log(res);
      let userAddress = connector.accounts[0].toLowerCase();
      let signature = await res.eth.personal.sign(
        `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${userAddress}\n\nHash:\n${Web3.utils.keccak256(
          userAddress,
        )}`,
        userAddress,
      );
      // console.log(
      //   ENDPOINTS.LOGIN_SIGNUP +
      //     `?signature=${signature}&address=${userAddress}`,
      // );
      let resp = await API.get(
        ENDPOINTS.LOGIN_SIGNUP +
          `?signature=${signature}&address=${userAddress}`,
        false,
      );
      console.log(resp);
      await StorageManager.put(USER, resp.user);
      await StorageManager.put(API_TOKEN, resp.token);
      setUser(resp.user);
      setSignedIn(true);
      ToastAndroid.show('Wallet connected successfully 🎉', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      await connector.killSession();
    }
  };

  const fetchMyNFTs = async () => {
    await getUserNFTs(user.walletAddress, setUserNFts);
  };
  useEffect(() => {
    const checkSignInStatus = async () => {
      if (await StorageManager.get(USER)) setSignedIn(true);
    };
    checkSignInStatus();
  }, []);

  useEffect(() => {
    if (connector.connected)
      if (chainId === connector.chainId) onChainChanged(chainId);
      else setChainId(connector.chainId);
  }, [user]);

  useEffect(() => {
    if (web3Provider) web3Provider.on('chainChanged', setChainId);
  }, [web3Provider]);

  useEffect(() => {
    onChainChanged(chainId);
  }, [chainId]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        getCreateUser,
        editProfile,
        setEditProfile,
        loading,
        web3,
        contractAddress,
        fetchMyNFTs,
        initializeWeb3,

        connect: async () => {
          setLoading(true);
          try {
            console.log('Connecting');
            setTimeout(() => {
              setLoading(false);
            }, 10000);
            const res = await connector.connect();
            //await new Promise(resolve => setTimeout(resolve, 1000));
            //await getCreateUser(res.accounts[0]);
            //await initializeWeb3();
            // console.log(res);

            //await StorageManager.put('connection', res);
            //console.log(res);
          } catch (e) {
            alert(e.message);
            ToastAndroid.show(
              'Wallet connection failed :(',
              ToastAndroid.SHORT,
            );
          }
          setLoading(false);
        },
        disconnect: async () => {
          setLoading(true);
          try {
            await connector.killSession();
            await StorageManager.clearStore();
            await StorageManager.put(ONBOARDED, 'true');
            setSignedIn(false);
            setUser(null);
            ToastAndroid.show(
              'Wallet disconnected successfully ✔️',
              ToastAndroid.SHORT,
            );
          } catch (error) {
            console.log(error + ' In Disconnecting');
          }
          setLoading(false);
        },
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
