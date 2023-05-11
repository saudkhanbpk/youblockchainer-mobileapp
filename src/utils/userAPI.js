import {ToastAndroid} from 'react-native';
import Web3 from 'web3';
import API, {ENDPOINTS} from '../api/apiService';
import {PLATFORM, alchemyApiToken, etherScanApiToken} from '../Constants';
import {USER} from '../storage/StorageKeys';
import StorageManager from '../storage/StorageManager';

export const base = `https://eth-goerli.alchemyapi.io/v2/${alchemyApiToken}`;

export const etherScanBase = 'https://api-goerli.etherscan.io/api';
//`https://eth-mainnet.alchemyapi.io/v2/${alchemyApiToken}`;

export const uploadPics = async imgs => {
  try {
    let data = new FormData();
    imgs.forEach(element => {
      data.append('files', element);
    });
    let urls = await API.uploadFile(ENDPOINTS.UPLOAD_IMG, data);
    // console.log(urls);
    return urls.urls;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateUser = async (id, body, setUser, dontToast) => {
  //console.log(body);
  try {
    let res = await API.put(ENDPOINTS.GET_UPDATE_ME, body);
    //console.log(res);
    await StorageManager.put(USER, res);
    setUser(res);
    if (dontToast) return;
    ToastAndroid.show(
      'User Details have been updated successfully 🎉',
      ToastAndroid.SHORT,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getMe = async setUser => {
  try {
    const resp = await API.get(ENDPOINTS.GET_UPDATE_ME);
    await StorageManager.put(USER, resp);
    //console.log(resp);
    setUser(resp);
  } catch (error) {
    console.log('Error in user Function' + error);
  }
};
export const getTransactionHistory = async (address, page, setEnd, num) => {
  try {
    let data = await fetch(
      `${etherScanBase}?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=${page}&offset=${num}&sort=desc&apikey=${etherScanApiToken}`,
    ).then(r => r.json());
    if (data.result.length === 0) setEnd(true);
    return data.result;
  } catch (error) {
    console.log(error);
  }
};
