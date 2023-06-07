import {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {GlobalContext} from '../auth/GlobalProvider';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {updateUser, uploadPics} from './userAPI';
import {validateEmail} from './helper';
import ImageCropPicker from 'react-native-image-crop-picker';
import shorthash from 'shorthash';

const useTabInitializer = props => {
  const connector = useWalletConnect();
  const [showMail, setShowMail] = useState(false);
  const {getCreateUser, user, setUser, loading, initializeWeb3, web3} =
    useContext(GlobalContext);
  const [uploading, setUploading] = useState(false);

  const getUser = async () => {
    if (connector.connected) {
      if (connector.accounts[0] === undefined) return;
      await getCreateUser(connector.accounts[0]);
    }
  };

  useEffect(() => {
    if (connector.connected && web3 === null) {
      initializeWeb3();
    }
    if (user === null) getUser();
  }, [connector]);

  useEffect(() => {
    if (user) {
      if (!user.email || !user.videoIntro) setShowMail(true);
    }
  }, [user]);

  const updateEmail = async (email, callback) => {
    if (validateEmail(email)) {
      await updateUser(user._id, {email}, setUser);
      callback();
    }
  };

  const updateVideo = async () => {
    let source = {
      uri: '',
      type: '',
      name: '',
    };
    setUploading(true);
    try {
      let result = await ImageCropPicker.openCamera({
        mediaType: 'video',
      });
      let arr = result.path.split('.');
      source.uri = result.path;
      source.type = result.mime;
      source.name = `${shorthash.unique(result.path)}.${arr[arr.length - 1]}`;
      let uris = await uploadPics([source]);
      await updateUser(user._id, {videoIntro: uris[0]}, setUser);
      setShowMail(false);
    } catch (error) {
      console.log('Error in video upload:- ', error.message);
      alert('Video upload Falied. Try again');
    }
    setUploading(false);
  };
  return {loading, updateEmail, showMail, setShowMail, uploading, updateVideo};
};

export default useTabInitializer;

const styles = StyleSheet.create({
  container: {},
});
