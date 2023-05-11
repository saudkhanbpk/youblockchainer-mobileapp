import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, IconButton} from 'react-native-paper';

const BotHeader = ({showClear, onClear, downloadDisabled, onDownload}) => {
  return (
    <View style={styles.container}>
      <Button mode="contained" disabled={!showClear} onPress={onClear}>
        Clear Chat
      </Button>

      <IconButton
        disabled={downloadDisabled}
        onPress={onDownload}
        icon={'download'}
        size={32}
      />
    </View>
  );
};

export default BotHeader;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});
