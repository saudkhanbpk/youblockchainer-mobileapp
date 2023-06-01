import React, {useRef, useState, useContext} from 'react';
import {View, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
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

const GetStarted = ({navigation}) => {
  const {colors} = useTheme();
  const {connect} = useContext(GlobalContext);
  const swiper_ = useRef(null);
  const [index, setIndex] = useState(0);
  const asset_dir = '../../assets/img/';
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
      title: 'Generate content in seconds',
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s`,
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
      title: 'Get experts help',
      description:
        'when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries',
      up: false,
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
      title: 'Get connected to entities to sell your content',
      description:
        'ut also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset',
      up: true,
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
      title: 'Connect your wallet and get started',
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is ',
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
        <OnBoard page={media[1]} />
        <OnBoard page={media[2]} />
        <OnBoard page={media[3]} />
      </Swiper>

      {index !== 0 &&
        (index !== 4 ? (
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
        ) : (
          <View
            style={{
              position: 'absolute',
              bottom: width / 12,
              alignSelf: 'center',
            }}>
            <TouchableOpacity style={{flex: 1}} onPress={connect}>
              <LinearGradient
                colors={[colors.secondary, colors.primary]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}
                style={styles.big_button}>
                <Text style={styles.label}>Connect Wallet</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
                marginRight: 5,
                marginTop: 5,
              }}
              onPress={() => navigation.replace('MainDrawer')}>
              <Paragraph style={{marginRight: 2, fontSize: 12}}>Skip</Paragraph>
              <AntDesign name="right" color={colors.border} size={12} />
            </TouchableOpacity>
          </View>
        ))}
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
});
export default GetStarted;
