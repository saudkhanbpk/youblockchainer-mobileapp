import React, {useContext} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {height, width} from '../../Constants';

const OnBoard = ({page}) => {
  const {colors} = useTheme();
  const {bg, vector, style, title, description, up} = page;

  return (
    <View style={styles.container}>
      <View style={{marginBottom: up ? 60 : 100}}>
        <Image source={bg} style={{height: height / 2, width}} />
        <Image source={vector} style={{...style, position: 'absolute'}} />
      </View>
      <View style={{marginHorizontal: 15}}>
        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 24}}>{title}</Text>
        <Text style={{color: colors.border, marginTop: 15}}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height,
    width,
  },
});

export default OnBoard;
