import React, {useRef, useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import {Paragraph, Text, useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Swiper from 'react-native-swiper';
import OnBoard from '../../components/OnBoarding/OnBoard';
import {height, width} from '../../Constants';
import Splash from '../../components/OnBoarding/Splash';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {GlobalContext} from '../../auth/GlobalProvider';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import MetamaskIntroModal from '../../components/OnBoarding/MetamaskIntroModal';

const GetStarted = ({navigation}) => {
  const {colors} = useTheme();
  const {connect} = useContext(GlobalContext);
  const swiper_ = useRef(null);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const asset_dir = '../../assets/img/';
  const bullet = '➢';
  const media = [
    {
      bg: require(`${asset_dir}bg1.png`),
      vector: require(`${asset_dir}v1.png`),
      style: {
        height: height / 2.5,
        width: height / 3,
        top: height / 6,
        alignSelf: 'center',
      },
      title: 'Ideation',
      description: `${bullet} From your idea to a one minute pitch\n${bullet} From your 1 Minute pitch to your Synopsis\n${bullet} Synopis to Full lengh script\n${bullet} Story board\n${bullet} Script Doctors`,
      up: true,
    },
    {
      bg: require(`${asset_dir}bg2.png`),
      vector: require(`${asset_dir}v2.png`),
      style: {
        height: height / 2.7,
        width: height / 2.4,
        top: height / 8.7,
        alignSelf: 'center',
      },
      title: 'Pre-Production',
      description: `${bullet} Casting\n${bullet} Location scouting\n${bullet} Production schedule\n${bullet} Designing sets & Costumes\n${bullet} Filming on location/Studio`,
      up: true,
    },
    {
      bg: require(`${asset_dir}bg3.png`),
      vector: require(`${asset_dir}v3.png`),
      style: {
        height: height / 2,
        width: height / 2.8,
        top: height / 8.7,
        alignSelf: 'center',
      },
      title: 'Post-Production & Distribution',
      description: `${bullet} Film Editing\n${bullet} Marketing\n${bullet} Distribution\n${bullet} Release\n${bullet} Post-release`,
      up: false,
    },
    {
      bg: require(`${asset_dir}bg4.png`),
      vector: require(`${asset_dir}v4.png`),
      style: {
        height: height / 2.5,
        width: height / 2.8,
        top: height / 10,
        alignSelf: 'center',
      },
      title: 'Create an Account or Sign in',
      description:
        'To login or register you need to sign in and create a new wallet using Arcana', //`Steps:\n\n1. Click "Connect Walllet" Button.\n2. Press connect button on Metamask popup.\n3. Sign the Message for wallet verification on our servers.\n4. Enjoy all functionalities offered by "MyReelDreams" App.`,
      up: true,
    },
  ];

  return (
    <View style={styles.container}>
      {index !== 0 && index !== 4 && (
        <TouchableOpacity
          style={styles.skip}
          onPress={() => {
            swiper_.current.scrollBy(4);
            setIndex(4);
          }}>
          <Paragraph style={{marginRight: 2, fontSize: 12}}>Skip</Paragraph>
          <AntDesign name="right" color={colors.border} size={12} />
        </TouchableOpacity>
      )}
      <Swiper
        ref={swiper_}
        loop={false}
        showsPagination={false}
        scrollEnabled={false}
        style={{height}}>
        <Splash
          moveForward={() => {
            swiper_.current.scrollBy(1);
            setIndex(1);
          }}
        />
        <OnBoard page={media[0]} />
        <OnBoard page={media[1]} isComing={true} />
        <OnBoard page={media[2]} isComing={true} />
        <OnBoard page={media[3]}>
          <View
            style={{
              position: 'absolute',
              bottom: Platform.OS === 'ios' ? '10%' : '5%',
              alignSelf: 'center',
            }}>
            <TouchableOpacity style={{flex: 1}} onPress={connect}>
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={styles.big_button}>
                <Text style={styles.label}>Sign In / Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  marginRight: 5,
                  marginTop: 5,
                }}
                onPress={() =>
                  Linking.openURL(
                    Platform.OS === 'android'
                      ? 'https://play.google.com/store/apps/details?id=io.metamask'
                      : 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202',
                  )
                }>
                <Paragraph
                  style={{
                    marginRight: 2,
                    fontSize: 12,
                    textDecorationLine: 'underline',
                  }}>
                  Don't have a wallet ?
                </Paragraph>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  marginTop: 10,
                }}
                onPress={() => setShow(true)}>
                <Paragraph
                  style={{
                    marginRight: 2,
                    fontSize: 12,
                    textDecorationLine: 'underline',
                  }}>
                  New to Metamask?
                </Paragraph>
              </TouchableOpacity>
            </View> */}

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => navigation.replace('MainDrawer')}>
              <Paragraph style={{marginRight: 2, fontSize: 14}}>Skip</Paragraph>
              <AntDesign name="right" color={colors.border} size={14} />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                alignSelf: 'center',
                marginTop: 10,
              }}
              onPress={() => setShow(true)}>
              <Paragraph
                style={{
                  marginRight: 2,
                  fontSize: 12,
                  textDecorationLine: 'underline',
                }}>
                New to Metamask?
              </Paragraph>
            </TouchableOpacity> */}
          </View>
        </OnBoard>
      </Swiper>

      {index !== 0 && index !== 4 && (
        <View style={styles.button}>
          <AnimatedCircularProgress
            size={60}
            width={3}
            style={{position: 'absolute', transform: [{rotate: '-90deg'}]}}
            fill={((index + 1) / 5) * 100}
            tintColor={colors.secondary}
          />
          <Pressable
            onPress={() => {
              swiper_.current.scrollBy(1);
              setIndex(i => i + 1);
            }}
            style={{marginTop: 5, marginLeft: 5}}>
            <LinearGradient
              colors={[colors.secondary, colors.primary]}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={styles.lineargradient}>
              <AntDesign name="right" color={'white'} size={18} />
            </LinearGradient>
          </Pressable>
        </View>
        // : (
        //   <View
        //     style={{
        //       position: 'absolute',
        //       bottom: width / 12,
        //       alignSelf: 'center',
        //     }}>
        //     <TouchableOpacity style={{flex: 1}} onPress={connect}>
        //       <LinearGradient
        //         colors={[colors.secondary, colors.primary]}
        //         start={{x: 0, y: 1}}
        //         end={{x: 1, y: 0}}
        //         style={styles.big_button}>
        //         <Text style={styles.label}>Connect Wallet</Text>
        //       </LinearGradient>
        //     </TouchableOpacity>
        //     <TouchableOpacity
        //       style={{
        //         marginRight: 5,
        //         marginTop: 5,
        //       }}
        //       onPress={() =>
        //         Linking.openURL(
        //           Platform.OS === 'android'
        //             ? 'https://play.google.com/store/apps/details?id=io.metamask'
        //             : 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202',
        //         )
        //       }>
        //       <Paragraph
        //         style={{
        //           marginRight: 2,
        //           fontSize: 12,
        //           textDecorationLine: 'underline',
        //         }}>
        //         Don't have a wallet ?
        //       </Paragraph>
        //     </TouchableOpacity>
        //     <TouchableOpacity
        //       style={styles.skipButton}
        //       onPress={() => navigation.replace('MainDrawer')}>
        //       <Paragraph style={{marginRight: 2, fontSize: 14}}>Skip</Paragraph>
        //       <AntDesign name="right" color={colors.border} size={14} />
        //     </TouchableOpacity>
        //   </View> )
      )}
      <MetamaskIntroModal show={show} setShow={setShow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lineargradient: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    zIndex: 5,
    bottom: width / 12,
    right: width / 12,
  },
  big_button: {
    width: width / 1.1,
    height: 50,
    justifyContent: 'center',
    borderRadius: 25,
  },
  label: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 2,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 5,
    marginTop: 5,
  },
});
export default GetStarted;
