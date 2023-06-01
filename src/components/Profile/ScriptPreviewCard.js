import React, {useContext, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import PDFView from 'react-native-pdf';
import {saveInDevice} from '../../utils/chatAPI';
import {width} from '../../Constants';
import {ActivityIndicator, IconButton} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {updateUser} from '../../utils/userAPI';

const ScriptPreviewCard = ({url, isDeleting, id}) => {
  const {user, setUser} = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    await saveInDevice(url);
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
        singlePage
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
          onPress={
            isDeleting
              ? () =>
                  Alert.alert(
                    'Are you sure ?',
                    'You want to delete this script from your account',
                    [
                      {
                        text: 'no',
                        style: 'cancel',
                      },
                      {
                        text: 'yes',
                        onPress: onDelete,
                      },
                    ],
                  )
              : handleDownload
          }
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
