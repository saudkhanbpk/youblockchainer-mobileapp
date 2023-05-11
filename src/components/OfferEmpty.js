import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

const OfferEmpty = ({marginTop, text}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/empty.gif')}
        resizeMode={'contain'}
        style={{
          height: 200,
          width: 300,
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Bold',
          alignSelf: 'center',
          color: colors.textAfter,
          marginTop: -40,
        }}>
        Nothing to show {/* {text || ' No offer is available right now :('} */}
      </Text>
    </View>
  );
};

export default OfferEmpty;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
