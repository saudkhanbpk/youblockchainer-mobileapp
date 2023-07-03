import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  useTheme,
  Text,
  Tooltip,
} from 'react-native-paper';
import {defaultAvatar, width} from '../../Constants';
import {useContext} from 'react';
import {GlobalContext} from '../../auth/GlobalProvider';
import {useMemo} from 'react';

const NameCard = ({profile, onConnect, onHire, baseStyle}) => {
  const {user} = useContext(GlobalContext);
  const {profileImage, username, isVerified, _id} = profile;
  const {colors} = useTheme();
  const isMe = useMemo(() => !user || user._id === _id, [user]);

  return (
    <Card style={{...baseStyle}}>
      <View style={{flexDirection: 'row'}}>
        <Avatar.Image
          source={{uri: profileImage || defaultAvatar}}
          size={width / 4}
        />
        <View style={{marginLeft: 10, justifyContent: 'space-around'}}>
          <Text style={styles.name}>{username}</Text>
          {!isMe && (
            <View style={{flexDirection: 'row'}}>
              <Button
                mode="outlined"
                onPress={onConnect}
                compact={true}
                style={{
                  borderWidth: 2,
                  borderColor: colors.primary,
                  marginRight: 10,
                  paddingHorizontal: 5,
                }}
                textColor={colors.primary}>
                Connect
              </Button>
              {/* <Tooltip title="Coming Soon !!" enterTouchDelay={0}> */}
              <Button
                mode="contained"
                onPress={onHire}
                buttonColor={colors.button}
                textColor={'white'}>
                Hire
              </Button>
              {/* </Tooltip> */}
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {},
  name: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 20,
  },
});

export default NameCard;
