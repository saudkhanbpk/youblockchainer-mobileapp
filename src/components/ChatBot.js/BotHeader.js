import React, {useState, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Divider, IconButton, Menu} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';

const BotHeader = ({
  showClear,
  onClear,
  downloadDisabled,
  onDownload,
  onSave,
  generating,
}) => {
  const [show, setShow] = useState(false);
  const {signedIn} = useContext(GlobalContext);
  return (
    <View style={styles.container}>
      {!generating && (
        <Button mode="contained" disabled={!showClear} onPress={onClear}>
          {generating ? 'Stop Generation' : 'Clear Chat'}
        </Button>
      )}
      {signedIn && (
        <Menu
          visible={show}
          style={{marginTop: 10}}
          contentStyle={{backgroundColor: 'white'}}
          onDismiss={() => setShow(false)}
          anchor={
            <IconButton
              disabled={downloadDisabled}
              onPress={() => setShow(true)}
              icon={'download'}
              size={32}
            />
          }>
          <Menu.Item
            style={{height: 40, backgroundColor: 'transparent'}}
            titleStyle={{fontSize: 15, fontWeight: 'bold'}}
            onPress={() => {
              onDownload();
              setShow(false);
            }}
            title="Download (Device)"
          />
          <Divider />
          <Menu.Item
            style={{height: 40, backgroundColor: 'transparent'}}
            titleStyle={{fontSize: 15, fontWeight: 'bold'}}
            onPress={() => {
              onSave();
              setShow(false);
            }}
            title="Save (Server)"
          />
        </Menu>
      )}
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
