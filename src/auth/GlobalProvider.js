import React, {createContext, useRef, useState, useEffect} from 'react';
import {ToastAndroid} from 'react-native';
import API, {ENDPOINTS} from '../api/apiService';
import Web3 from 'web3';
import StorageManager from '../storage/StorageManager';
import {ARCANA_KEY, WALLET_STATES, http_provider} from '../Constants';
import {API_TOKEN, ONBOARDED, USER} from '../storage/StorageKeys';
import {getMe} from '../utils/userAPI';
import Forwarder from '../abis/Forwarder.json';
import AskGPT from '../abis/AskGPT.json';
import Auth from '@arcana/auth-react-native';
import AuthOptionModal from '../components/AuthOptionModal';

export const GlobalContext = createContext();

const GlobalProvider = ({children}) => {
  // const [chainId, setChainId] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const [arcanaUser, setArcanaUser] = useState(null);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  //const [isOpened, setIsOpened] = useState(false); //const [web3Provider, setWeb3Provider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [forwarderAddress, setForwarderAddress] = useState('');
  //const [showAuth, setShowAuth] = useState(false);
  //const [containsNetwork, setContainsNetwork] = useState(true);
  const [forwarderC, setForwarderC] = useState(null);
  const [mainContract, setMainContract] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAgreement, setShowAgreement] = useState(null);
  const [videos, setVideos] = useState(null);
  const authRef = useRef(null);

  // const addChain = async res => {
  //   try {
  //     await res.request({
  //       method: 'wallet_addEthereumChain',
  //       params: [MetaMaskNetworkObject],
  //     });
  //     // setContainsNetwork(true);
  //   } catch (addError) {
  //     console.error('Adding Error:- ', addError);
  //   }
  // };

  // const onChainChanged = async chainId => {
  //   console.log(chainId);
  //   if (!!chainId && chainId !== rpcConfig.chainId) {
  //     let res = web3Provider;
  //     // let w3 = web3;
  //     if (!res) {
  //       res = new WalletConnectProvider({
  //         ...rpcConfig,
  //         connector,
  //       });
  //       await res.enable();
  //     }

  //     // if (!w3) {
  //     //   w3 = new Web3(res);
  //     // }
  //     try {
  //       //if (!containsNetwork) return await addChain(res);
  //       await res.request({
  //         method: 'wallet_switchEthereumChain',
  //         params: [{chainId: Web3.utils.toHex(rpcConfig.chainId)}],
  //       });
  //     } catch (error) {
  //       console.log('Switching Error:- ', error);

  //       if (error.message.includes('Unrecognized chain ID')) {
  //         return await addChain(res);
  //       }
  //     }
  //   }
  // };

  const getCreateUser = async () => {
    // if (signedIn) {
    //   // let res = await StorageManager.get(USER);
    //   // if (res) return setUser(res);
    //   //console.log('---Call User API:- ', address);
    //   // if (address === null || address === undefined) {
    //   //   //await connector.killSession("Wallet did'nt connect properly");
    //   //   throw new Error("Wallet did'nt connect properly");
    //   // }
    //   await getMe(setUser);
    //   return;
    // }
    //await loginAccount();
    await arcanaLoginAccount();
  };

  // const toggleWallet = () => {
  //   if (isOpened) authRef.current.hideWallet();
  //   else authRef.current.showWallet();
  //   setIsOpened(o => !o);
  // };

  const executeMetaTx = async (data, targetAddress) => {
    try {
      let from = user.walletAddress;
      console.log('---Caller Wallet:- ', from);
      const nonce = await forwarderC.methods.getNonce(from).call();
      console.log('---Got Nonce from Forwarder');
      const tx = {
        from,
        to: targetAddress, // Target contract address (AskGPT or Agreement subcontract)
        value: 0,
        nonce,
        data,
      };
      const digest = await forwarderC.methods
        .getDigest(tx.from, tx.to, tx.value, tx.nonce, tx.data)
        .call();
      console.log('---Got digest from Forwarder:- ', digest);
      // const signature = await web3.eth.personal.sign(digest, from);
      const signature = await authRef.current.request({
        method: 'personal_sign',
        params: [digest, user.walletAddress],
      });
      console.log('---Transaction Signed');
      const res = await API.post(ENDPOINTS.META_TX, {
        tx,
        signature,
      });
      console.log('---Meta Tx Status :- ', res.status);
      if (res.success) return res.data;
      return res.success;
    } catch (error) {
      console.log('Meta Tx creation error:- ', error.message);
      //notifyEVMError(error)
    }
  };

  const initializeWeb3 = async w3 => {
    try {
      let res = w3;
      if (res === undefined || res === null) {
        let res = new Web3(new Web3.providers.HttpProvider(http_provider));
        setWeb3(res);
        // const provider = new WalletConnectProvider({
        //   ...rpcConfig,
        //   connector,
        // });
        // await provider.enable();
        // provider.chainId = rpcConfig.chainId;

        // res = new Web3(provider);
        // setWeb3(res);
        // setWeb3Provider(provider);
        console.log('---Created Web3');
      }
      let cd = await API.get(ENDPOINTS.GET_LATEST_CONTRACTADDRESS);
      setContractAddress(cd.contractAddress);
      setForwarderAddress(cd.contractAddressF);

      let contract1 = new res.eth.Contract(Forwarder, cd.contractAddressF);
      setForwarderC(contract1);
      console.log('---Forwarder Instance Created');

      let contract2 = new res.eth.Contract(AskGPT, cd.contractAddress);
      //console.log(await contract2.methods.marketFee().call());
      setMainContract(contract2);
      console.log('---MainContract Instance Created');

      // let cd = await API.get(ENDPOINTS.GET_LATEST_CONTRACTADDRESS);
      // setContractAddress(cd.contractAddress);
      // console.log(cd);
    } catch (error) {
      console.log(error);
    }
  };

  // const loginAccount = async () => {
  //   try {
  //     const provider = new WalletConnectProvider({
  //       ...rpcConfig,
  //       connector,
  //     });
  //     await provider.enable();
  //     provider.chainId = rpcConfig.chainId;

  //     // provider.on('chainChanged', onChainChanged);
  //     const res = new Web3(provider);
  //     setWeb3(res);
  //     setWeb3Provider(provider);
  //     initializeWeb3(res);
  //     //console.log(res);
  //     let userAddress = connector.accounts[0].toLowerCase();
  //     let signature = await res.eth.personal.sign(
  //       `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${userAddress}\n\nHash:\n${Web3.utils.keccak256(
  //         userAddress,
  //       )}`,
  //       userAddress,
  //     );
  //     // console.log(
  //     //   ENDPOINTS.LOGIN_SIGNUP +
  //     //     `?signature=${signature}&address=${userAddress}`,
  //     // );
  //     let resp = await API.get(
  //       ENDPOINTS.LOGIN_SIGNUP +
  //         `?signature=${signature}&address=${userAddress}`,
  //       false,
  //     );
  //     console.log(resp);
  //     await StorageManager.put(USER, resp.user);
  //     await StorageManager.put(API_TOKEN, resp.token);
  //     setUser(resp.user);
  //     setSignedIn(true);
  //     ToastAndroid.show('Wallet connected successfully 🎉', ToastAndroid.SHORT);
  //   } catch (error) {
  //     console.log(error);
  //     await connector.killSession();
  //   }
  // };

  const arcanaLoginAccount = async () => {
    try {
      let res = new Web3(new Web3.providers.HttpProvider(http_provider));
      setWeb3(res);
      let accounts = await authRef?.current.getAccount();
      console.log('---User Accounts:- ', accounts);
      let userAddress = accounts[0];
      const signature = await authRef.current.request({
        method: 'personal_sign',
        params: [
          `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${userAddress}\n\nHash:\n${Web3.utils.keccak256(
            userAddress,
          )}`,

          userAddress,
        ],
      });
      let resp = await API.get(
        ENDPOINTS.LOGIN_SIGNUP +
          `?signature=${signature}&address=${accounts[0]}`,
        false,
      );

      console.log(resp);
      await StorageManager.put(USER, resp.user);
      await StorageManager.put(API_TOKEN, resp.token);
      await initializeWeb3(res);
      setUser(resp.user);
      let acuser = authRef.current.getUserInfo();
      console.log('---Arcana User:- ', acuser);
      setArcanaUser(acuser);
      setSignedIn(true);
      ToastAndroid.show('Wallet connected successfully 🎉', ToastAndroid.SHORT);
    } catch (error) {
      console.log('Arcana Login Error:- ', error.message);
    }
  };

  useEffect(() => {
    // const checkSignInStatus = async () => {
    //   if (await StorageManager.get(USER)) setSignedIn(true);
    // };
    // checkSignInStatus();

    if (
      !!authRef.current &&
      authRef.current.getLoginState() === WALLET_STATES.CONNECTED
    ) {
      setSignedIn(true);
      setArcanaUser(authRef.current.getUserInfo());
    } else setSignedIn(false);
  }, [authRef]);

  // useEffect(() => {
  //   if (connector.connected)
  //     if (chainId === connector.chainId) onChainChanged(chainId);
  //     else setChainId(connector.chainId);
  // }, [signedIn]);

  // useEffect(() => {
  //   if (web3Provider) web3Provider.on('chainChanged', setChainId);
  // }, [web3Provider]);

  // useEffect(() => {
  //   onChainChanged(chainId);
  // }, [chainId]);

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
        initializeWeb3,
        mainContract,
        executeMetaTx,
        showAgreement,
        setShowAgreement,
        signedIn,
        contractAddress,
        videos,
        setVideos,
        authRef,
        arcanaUser,
        setShowAuthOptions,
        // toggleWallet,
        // isOpened,

        connect: async (method, email) => {
          setLoading(true);
          try {
            console.log('Connecting');
            setTimeout(() => {
              setLoading(false);
            }, 10000);
            console.log(method, email);
            if (email) {
              //console.log('Here');
              await authRef.current.loginWithOtp(email);
            } else await authRef.current.loginWithSocial(method);
            if (authRef.current.getLoginState() === WALLET_STATES.CONNECTED) {
              setSignedIn(true);
              setArcanaUser(authRef.current.getUserInfo());
            }

            //const res = await connector.connect();
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
            //await connector.killSession();
            await authRef.current.logout();
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
      <Auth clientId={ARCANA_KEY} theme="light" ref={authRef} />
      <AuthOptionModal show={showAuthOptions} setShow={setShowAuthOptions} />
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
