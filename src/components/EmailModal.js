import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTheme, Card, Title, Modal, Text, Button} from 'react-native-paper';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import {GlobalContext} from '../auth/GlobalProvider';
import SubmitButton from './SubmitButton';

const EmailModal = ({show, onClick, setShow, onRecord, uploading}) => {
  const {colors} = useTheme();
  const {user} = useContext(GlobalContext);
  const [email, setEmail] = useState();
  const [setting, setSetting] = useState(false);

  const swiper_ref = useRef(null);

  const clicker = async () => {
    setSetting(true);
    await onClick(email, () => swiper_ref.current.scrollBy(1));
    setSetting(false);
  };
  useEffect(() => {
    if (user && user.email && !!swiper_ref.current)
      swiper_ref.current.scrollBy(1);
    if (user && user.videoIntro) setShow(false);
  }, [user, swiper_ref.current]);

  return (
    <Modal visible={show}>
      <View style={styles.modal}>
        <Swiper
          ref={swiper_ref}
          loop={false}
          showsPagination={true}
          activeDot={
            <View
              style={{
                ...styles.activedot,
                backgroundColor: colors.primary,
              }}>
              <Text style={{color: 'white'}}>
                {swiper_ref.current ? swiper_ref.current.state.index + 1 : 1}
              </Text>
            </View>
          }
          scrollEnabled={false}>
          <Card style={styles.card}>
            <Title
              style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
              Enter E-mail*
            </Title>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={{
                ...styles.reasonInput,
                borderColor: colors.textAfter,
                color: colors.text,
              }}
              placeholder={'doe@example.com'}
              placeholderTextColor={colors.disabled}
            />
            <TouchableOpacity
              disabled={setting}
              onPress={clicker}
              style={{alignSelf: 'flex-end'}}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.linearGradient1}
                colors={
                  setting
                    ? [colors.text, colors.textAfter]
                    : [colors.primary, colors.secondary]
                }>
                {setting ? (
                  <ActivityIndicator color={colors.textBefore} size={'small'} />
                ) : (
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    Done
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <Text style={{marginTop: 5, fontSize: 12, color: colors.secondary}}>
              *Note: To access MyReelDreems app and complete registration {'\n'}{' '}
              1. Enter your mail id. {'\n'} 2. Upload Self Introduction video.
            </Text>
          </Card>
          <Card style={styles.card}>
            <Title
              style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
              Record a Video (Introduce Yourself)
            </Title>
            <SubmitButton
              label={'Record'}
              onClick={onRecord}
              loading={uploading}
            />
            {/* <TouchableOpacity
              style={styles.skip}
              onPress={() => setShow(false)}>
              <Text style={{marginRight: 2, fontSize: 12}}>Skip</Text>
              <AntDesign name="right" color={colors.border} size={12} />
            </TouchableOpacity> */}
          </Card>
        </Swiper>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '70%',
    height: 280,
    alignSelf: 'center',
  },
  activedot: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  card: {padding: 20, borderRadius: 10, flex: 1},
  linearGradient1: {
    padding: 5,
    width: 60,
    marginHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  reasonInput: {
    height: 40,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  button: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    alignSelf: 'flex-end',
  },
});
export default EmailModal;
