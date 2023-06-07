import React from 'react';
import {View, StyleSheet} from 'react-native';

const AgreementDetail = ({route}) => {
  const {agreement} = route.params;
  return <View style={styles.container}></View>;
};

export default AgreementDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
