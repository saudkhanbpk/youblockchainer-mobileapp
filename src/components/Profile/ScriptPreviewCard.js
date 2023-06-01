import React, {useContext, useState} from 'react';
import {View, StyleSheet, ToastAndroid, TouchableOpacity} from 'react-native';
import PDFView from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import {getStoragePermission} from '../../utils/chatAPI';
import {width} from '../../Constants';
import {ActivityIndicator, IconButton, Text} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {updateUser} from '../../utils/userAPI';

const ScriptPreviewCard = ({url, isDeleting, id}) => {
  const {user, setUser} = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    try {
      await getStoragePermission();
      console.log('here');
      const {dirs} = RNFetchBlob.fs;
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      const path = `${dirs.DownloadDir}/${fileName}`;
      console.log('then here');
      let res = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path,
          description: 'Downloading Script...',
        },
      }).fetch('GET', url);
      ToastAndroid.show(
        'Script downloaded to: ',
        res.path(),
        ToastAndroid.SHORT,
      );
    } catch (error) {
      console.log('Error downloading file: ', error);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await updateUser(
        id,
        {scripts: user.scripts.filter(i => i !== url)},
        setUser,
      );
    } catch (error) {
      console.log('Error in deleting:- ', error.message);
    }

    setLoading(false);
  };

  return (
    <View
      style={{
        width: width / 2,
        height: width / 1.8,
        marginHorizontal: 10,
        opacity: loading ? 0.7 : 1,
      }}>
      <PDFView
        style={{flex: 1}}
        trustAllCerts={false}
        source={{uri: url, cache: true}}
        onError={error => console.log('Error rendering PDF: ', error)}
      />
      {loading ? (
        <ActivityIndicator
          size={'small'}
          style={{position: 'absolute', alignSelf: 'center', top: '40%'}}
        />
      ) : (
        <IconButton
          style={styles.buttonPos}
          onPress={isDeleting ? () => onDelete(url) : handleDownload}
          icon={isDeleting ? 'delete' : 'download'}
          size={32}
        />
      )}
      {/* <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          padding: 10,
          alignItems: 'center',
          position: 'absolute',
        }}
        onPress={handleDownload}>
        <Text style={{color: 'white'}}>Download</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ScriptPreviewCard;

const styles = StyleSheet.create({
  container: {},
  buttonPos: {position: 'absolute', right: 5, top: -10},
});
