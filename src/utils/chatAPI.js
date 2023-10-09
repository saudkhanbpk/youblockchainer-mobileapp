import shorthash from 'shorthash';
import API, {ENDPOINTS} from '../api/apiService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {updateUser, uploadPics} from './userAPI';
import RNFetchBlob from 'react-native-blob-util';
import {notifyEVMError} from './helper';

export const getAllRooms = async () => {
  try {
    let res = await API.get(ENDPOINTS.GET_ALL_ROOMS, true);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getStoragePermission = async () => {
  let permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  console.log('Permission:- ' + (await PermissionsAndroid.check(permission)));
  if (!(await PermissionsAndroid.check(permission))) {
    console.log('here');
    let granted = await PermissionsAndroid.request(permission);
    //if (!granted) throw Error('Permission Denied');
    return true;
  }
  return true;
};

export const saveInDevice = async url => {
  try {
    await getStoragePermission();
    const {dirs} = RNFetchBlob.fs;
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    const path = `${dirs.LegacyDownloadDir}/${fileName}.pdf`;

    let res = await RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path,
        description: 'Downloading Script...',
      },
    }).fetch('GET', url);
    ToastAndroid.show('Script downloaded to: ' + res.path(), ToastAndroid.LONG);
  } catch (error) {
    console.log('Error downloading file: ', error);
  }
};

export const saveAsPdf = async (html, inDevice, prevScripts, setUser) => {
  console.log('here');
  try {
    let options = {
      html,
      fileName: `Script_${shorthash.unique(html)}`,
      base64: true,
    };
    //if (inDevice) options['directory'] = 'Downloads';

    let file = await RNHTMLtoPDF.convert(options);
    console.log(`---Converted To PDF (${file.filePath})`);
    if (inDevice) {
      if (Platform.OS === 'android' ? await getStoragePermission() : true) {
        console.log(RNFetchBlob.fs.dirs.LegacyDownloadDir);
        await RNFetchBlob.fs.cp(
          file.filePath,
          `${RNFetchBlob.fs.dirs.LegacyDownloadDir}/${options.fileName}.pdf`,
        );
        return ToastAndroid.show(
          `${options.fileName} saved in Downloads Folder`,
          ToastAndroid.LONG,
        );
      }
      return ToastAndroid.show('Permission Denied :(', ToastAndroid.SHORT);
      // await RNFetchBlob.fs.writeFile(
      //   `${RNFetchBlob.fs.dirs.DownloadDir}/${options.fileName}.pdf`,
      //   file.base64,
      //   'base64',
      // );
    }

    let urls = await uploadPics([
      {
        uri: (Platform.OS === 'android' ? 'file://' : '') + file.filePath,
        type: 'application/pdf',
        name: options.fileName,
      },
    ]);
    if (!urls.length) throw Error('PDF upload Failed');
    console.log('---Uploaded PDF', urls);
    // console.log(file.filePath);
    await updateUser(
      null,
      {
        scripts: [...prevScripts, urls[0]],
      },
      setUser,
      true,
    );
    console.log('---Updated user with scripts');
    ToastAndroid.show(`Script saved in your profile 🎉`, ToastAndroid.SHORT);
  } catch (error) {
    console.log('Save as Pdf:- ', error.message);
    ToastAndroid.show(
      'Could not save script :( Try again Later',
      ToastAndroid.SHORT,
    );
  }
};

export const createRoom = async id => {
  try {
    let res = await API.post(ENDPOINTS.ROOM_ACTIONS, {receiver: id}, true);
    //console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllChats = async id => {
  try {
    let res = await API.get(ENDPOINTS.ROOM_ACTIONS + id, true);
    //console.log('Chats:- ', res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const askGPT = async (prompt, isLast) => {
  try {
    return await API.post(ENDPOINTS.ASK_GPT, {prompt, isLast});
  } catch (error) {
    console.log('Ask GPT Error:- ', error.message);
    return '';
  }
};

export const getScriptPrice = async mainContract => {
  try {
    let res = await mainContract.methods.pricePerScript().call();
    console.log('--Price:- ', res);
    return res;
  } catch (error) {
    console.log('Script Price Error:- ', error.message);
  }
};

export const getScriptRemaining = async (
  mainContract,
  address,
  setScriptCount,
) => {
  try {
    let res = await mainContract.methods.getPendingScripts(address).call();
    console.log('---Balance:- ' + res);
    setScriptCount(res);
  } catch (error) {
    console.log('Script Price Error:- ', error.message);
  }
};

export const buyScriptFromContract = async (
  amount,
  mainContract,
  walletAddress,
  value,
  authRef,
  address,
) => {
  try {
    let transaction = await mainContract.methods.buyScripts(amount).encodeABI();
    console.log('---Encoded ABI');
    let data = {from: walletAddress, to: address, value, data: transaction};
    let hash = await authRef.current.sendTransaction(data);
    console.log('---TX success');
    console.log(hash);
    return true;
  } catch (error) {
    notifyEVMError(error);
    console.log('Error in funding:- ', error);
    return false;
  }
};
