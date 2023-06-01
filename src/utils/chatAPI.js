import shorthash from 'shorthash';
import API, {ENDPOINTS} from '../api/apiService';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {PermissionsAndroid, ToastAndroid} from 'react-native';
import {updateUser, uploadPics} from './userAPI';

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
  console.log(await PermissionsAndroid.check(permission));
  if (!(await PermissionsAndroid.check(permission))) {
    let granted = await PermissionsAndroid.request(permission);
    if (!granted) throw Error('Permission Denied');
    return true;
  }
};

export const saveAsPdf = async (html, inDevice, prevScripts, setUser) => {
  try {
    if (inDevice) {
      getStoragePermission();
    }
    let options = {
      html,
      fileName: `Script_${shorthash.unique(html)}`,
    };

    if (inDevice) options['directory'] = 'Downloads';

    let file = await RNHTMLtoPDF.convert(options);
    console.log(`---Converted To PDF (${file.filePath})`);
    if (inDevice)
      return ToastAndroid.show(
        `${options.fileName} saved in ${options.directory} Folder`,
        ToastAndroid.LONG,
      );
    let urls = await uploadPics([
      {
        uri: 'file://' + file.filePath,
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
    ToastAndroid.show('Could not save script :(', ToastAndroid.SHORT);
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

export const askGPT = async prompt => {
  try {
    return await API.post(ENDPOINTS.ASK_GPT, {prompt});
  } catch (error) {
    console.log('Ask GPT Error:- ', error.message);
    return '';
  }
};
