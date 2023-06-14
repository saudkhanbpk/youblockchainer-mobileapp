import React, {useContext} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {height, width} from '../../Constants';
import {ScrollView} from 'react-native-gesture-handler';

const OnBoard = ({page, children}) => {
  const {colors} = useTheme();
  const {bg, vector, style, title, description, up} = page;

  return (
    <View style={styles.container}>
      <View style={{marginBottom: up ? '5%' : '15%'}}>
        <Image source={bg} style={{height: height / 2, width}} />
        <Image source={vector} style={{...style, position: 'absolute'}} />
      </View>
      <View style={{marginHorizontal: '5%', alignItems: 'flex-start'}}>
        <Text style={{fontFamily: 'Poppins-Bold', fontSize: 24}}>{title}</Text>
        <Text
          style={{
            color: colors.border,
            marginTop: '1%',
            fontWeight: 'bold',
            fontSize: 15,
            //marginLeft: -20,
          }}>
          {description}
        </Text>
      </View>
      {children}
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
