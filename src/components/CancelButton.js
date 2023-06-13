import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Paragraph} from 'react-native-paper';

const CancelButton = ({setLoading}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setLoading(false)}>
      <Paragraph
        style={{
          marginRight: 2,
          fontSize: 12,
          textDecorationLine: 'underline',
        }}>
        Cancel
      </Paragraph>
    </TouchableOpacity>
  );
};

export default CancelButton;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
});
