import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Chip, Text, useTheme} from 'react-native-paper';
import Video from 'react-native-video';
import {width} from '../../Constants';
import VideoComponent from '../VideoPlayer/VideoComponent';

const IntroVideoCard = ({profile, baseStyle}) => {
  const {videoIntro} = profile;
  const {colors} = useTheme();
  //   const [] = use

  return (
    <Card style={{...baseStyle, ...styles.container}}>
      <View>
        <Text style={styles.title}>Intoduction Video</Text>

        <VideoComponent
          uri={videoIntro}
          style={{
            width: '90%',
            height: width * 0.5,
            //borderRadius: 20,
            alignSelf: 'center',
            backgroundColor: colors.text,
          }}
        />
        {/* <Video
          source={{uri: videoIntro}}
          controls
          paused
          poster="https://media1.giphy.com/media/xFmuT64Jto3mRO4w3G/giphy.gif?cid=ecf05e470lf8auazyojivsd0h8744xnvrqdiss98bgedx0mh&ep=v1_gifs_search&rid=giphy.gif&ct=g"
          posterResizeMode="cover"
          style={{
            width: '90%',
            height: width * 0.5,
            borderRadius: 20,
            alignSelf: 'center',
            backgroundColor: colors.text,
          }}
        /> */}
      </View>
    </Card>
  );
};

export default IntroVideoCard;

const styles = StyleSheet.create({
  container: {},
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
});
