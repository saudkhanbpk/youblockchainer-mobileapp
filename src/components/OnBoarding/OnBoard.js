import React, {useContext} from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import {Chip, Text, useTheme} from 'react-native-paper';
import {height, width} from '../../Constants';
import {ScrollView} from 'react-native-gesture-handler';

const OnBoard = ({page, children, isComing}) => {
  const {colors} = useTheme();
  const {bg, vector, style, title, description, up} = page;

  return (
    <View style={styles.container}>
      <View style={{marginBottom: up ? '8%' : '15%'}}>
        <Image
          source={bg}
          style={{height: height / (Platform.OS === 'ios' ? 2.1 : 2), width}}
        />
        <Image source={vector} style={{...style, position: 'absolute'}} />
      </View>
      <View style={{marginHorizontal: '5%', alignItems: 'flex-start'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontFamily: 'Poppins-Bold', fontSize: 24}}>
            {title}
          </Text>
          {isComing && (
            <Chip
              compact
              disabled
              style={{borderRadius: 20, marginLeft: '5%', height: 35}}
              textStyle={{fontSize: 12, color: colors.text}}>
              Coming Soon
            </Chip>
          )}
        </View>
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
