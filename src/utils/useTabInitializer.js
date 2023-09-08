import {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {GlobalContext} from '../auth/GlobalProvider';
import {updateUser, uploadPics} from './userAPI';
import ImageCropPicker from 'react-native-image-crop-picker';
import shorthash from 'shorthash';

const useTabInitializer = props => {
  const [showMail, setShowMail] = useState(false);
  const {
    getCreateUser,
    user,
    setUser,
    loading,
    initializeWeb3,
    web3,
    signedIn,
  } = useContext(GlobalContext);
  const [uploading, setUploading] = useState(false);

  const getUser = async () => {
    if (signedIn) {
      await getCreateUser();
    }
  };

  useEffect(() => {
    if (signedIn && web3 === null) {
      initializeWeb3();
    }
    if (user === null) getUser();
  }, [signedIn]);

  useEffect(() => {
    if (user) {
      if (!user.email || !user.country) setShowMail(true); //|| !user.videoIntro
    }
  }, [user]);

  const updateEmail = async (email, country, callback) => {
    await updateUser(user._id, {email, country}, setUser);
    callback();
  };

  const updateVideo = async (videoVisibility, callback) => {
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
      await updateUser(
        user._id,
        {videoIntro: uris[0], videoVisibility},
        setUser,
      );
      callback();
      //setShowMail(false);
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
