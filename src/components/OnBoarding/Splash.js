import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Paragraph, Text, Title, useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {height, width} from '../../Constants';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Splash = ({moveForward}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{flex: 6, justifyContent: 'center'}}>
        <Image
          source={require('../../assets/img/splash.png')}
          resizeMode={'center'}
        />
        <Text style={styles.name}>Youblockchainer</Text>
        <Title style={{textAlign: 'center', marginTop: 20}}>
          Content Production Marketplace
        </Title>
      </View>
      <TouchableOpacity style={{flex: 1}} onPress={moveForward}>
        <LinearGradient
          colors={[colors.secondary, colors.primary]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          style={styles.button}>
          <Text style={styles.label}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    width: width / 1.1,
    height: 50,
    justifyContent: 'center',
    borderRadius: 25,
  },
  name: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Poppins-ExtraBoldItalic',
    marginTop: -30,
  },
});

export default Splash;
