import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, Button, Text, useTheme} from 'react-native-paper';
import {defaultAvatar, width} from '../../Constants';

const ChatHeader = ({user, onHire}) => {
  const {username, profileImage, descriptorTitle} = user;
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Avatar.Image source={{uri: profileImage || defaultAvatar}} size={50} />
        <View style={{marginLeft: 10, justifyContent: 'center'}}>
          <Text style={styles.name}>{username}</Text>
          {!!descriptorTitle && (
            <Text
              style={{maxWidth: width / 2, color: colors.textAfter}}
              numberOfLines={1}>
              {descriptorTitle}
            </Text>
          )}
        </View>
      </View>
      {user.isExpert ? (
        <Button
          mode="contained"
          onPress={onHire}
          buttonColor={colors.button}
          textColor={'white'}>
          Hire
        </Button>
      ) : (
        <View />
      )}
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  name: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 16,
  },
});
