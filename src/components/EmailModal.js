import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  useTheme,
  Card,
  Title,
  Modal,
  Text,
  Button,
  Checkbox,
  Subheading,
} from 'react-native-paper';
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
import {validateEmail} from '../utils/helper';
import VideoComponent from './VideoPlayer/VideoComponent';
import {useNavigation} from '@react-navigation/native';

const EmailModal = ({show, onClick, setShow, onRecord, uploading}) => {
  const {colors} = useTheme();
  const {user, videos, arcanaUser} = useContext(GlobalContext);
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [setting, setSetting] = useState(false);
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(1);
  const navigation = useNavigation();

  const swiper_ref = useRef(null);

  const clicker = async () => {
    if (!validateEmail(email)) return alert('Enter a valid email');
    if (!country.length) return alert('Country of residence is compulsary');
    setSetting(true);
    await onClick(email, country, () => swiper_ref.current.scrollBy(1));
    setIndex(2);
    setSetting(false);
  };

  useEffect(() => {
    setIndex(1);
  }, []);

  useEffect(() => {
    if (!!arcanaUser) setEmail(arcanaUser.email);
  }, [arcanaUser]);

  // useEffect(() => {
  //   // if (user && user.email && user.country && !!swiper_ref.current)
  //   //   return swiper_ref.current.scrollBy(1);
  //   // if (user && user.videoIntro) setShow(false);

  //   console.log(swiper_ref.current ? swiper_ref.current.state : '');
  // }, [user, swiper_ref.current]);

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
              <Text style={{color: 'white'}}>{index}</Text>
            </View>
          }
          scrollEnabled={false}>
          <Card style={styles.card}>
            <Title
              style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
              Enter Details
            </Title>
            <Subheading style={{fontWeight: 'bold'}}>Email*</Subheading>
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
            <Subheading style={{marginTop: 10, fontWeight: 'bold'}}>
              Country*
            </Subheading>
            <TextInput
              value={country}
              onChangeText={setCountry}
              style={{
                ...styles.reasonInput,
                borderColor: colors.textAfter,
                color: colors.text,
              }}
              placeholder={'eg. USA'}
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
              Record a 30 sec video selfie to participate in auditions
            </Title>
            <Checkbox.Item
              label={'Show Intro Clip on your Public Profile'}
              status={visible ? 'checked' : 'unchecked'}
              onPress={() => setVisible(v => !v)}
            />
            <SubmitButton
              label={'Record'}
              onClick={() =>
                onRecord(visible, () => {
                  setIndex(3);
                  swiper_ref.current.scrollBy(1);
                })
              }
              loading={uploading}
              style={{marginTop: '40%'}}
            />
            <TouchableOpacity
              style={styles.skip}
              onPress={() => {
                setIndex(3);
                swiper_ref.current.scrollBy(1);
              }}>
              <Text style={{marginRight: 2, fontSize: 12}}>Skip</Text>
              <AntDesign name="right" color={colors.border} size={12} />
            </TouchableOpacity>
          </Card>
          {index === 3 && (
            <Card style={styles.card}>
              <Title
                style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
                What to Expect ...
              </Title>

              <VideoComponent
                uri={videos.video3}
                style={{width: '100%', height: '77%'}}
                noControls={true}
                autoPlay={true}
                onEndVideo={() => {
                  setShow(false);
                  setIndex(1);
                }}
              />
              <TouchableOpacity
                style={styles.skip}
                onPress={() => {
                  setIndex(4);
                  swiper_ref.current.scrollBy(1);
                }}>
                <Text style={{marginRight: 2, fontSize: 12}}>Skip</Text>
                <AntDesign name="right" color={colors.border} size={12} />
              </TouchableOpacity>
            </Card>
          )}

          {index === 4 && (
            <Card style={styles.card}>
              <Title
                style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
                Complete your profile ...
              </Title>
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                  navigation.navigate('Profile', {screen: 'EditProfile'});
                }}
                style={{marginTop: '10%'}}>
                <LinearGradient
                  colors={[colors.secondary, colors.primary]}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={styles.button}>
                  <Text style={styles.label}>Complete Profile</Text>
                  <AntDesign style={styles.label} name={'arrowright'} />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skip}
                onPress={() => {
                  setShow(false);
                }}>
                <Text style={{marginRight: 2, fontSize: 12}}>Skip</Text>
                <AntDesign name="right" color={colors.border} size={12} />
              </TouchableOpacity>
            </Card>
          )}
        </Swiper>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '78%',
    height: 400,
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
    width: '70%',
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
