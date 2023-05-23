import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, Card, Chip, Text, useTheme} from 'react-native-paper';
import {defaultAvatar} from '../../Constants';

const AgreementCard = ({agreement, baseStyle}) => {
  const {user1, name, startsAt, endsAt} = agreement;
  const {profileImage, username} = user1;
  const {colors} = useTheme();
  const startDate = new Date(startsAt).toDateString();
  const endDate = !!endsAt
    ? new Date(endsAt).toLocaleDateString('en-US')
    : 'present';

  return (
    <Card style={{...baseStyle, ...styles.container}}>
      <View>
        <View>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{name}</Text>
          <Text
            style={{
              color: colors.textAfter,
              fontSize: 12,
            }}>{`${startDate} - ${endDate}`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            alignItems: 'center',
          }}>
          <Avatar.Image
            source={{uri: profileImage || defaultAvatar}}
            size={50}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{fontWeight: 'bold'}}>{username}</Text>
            <View
              style={{
                paddingVertical: 5,
                borderRadius: 30,
                backgroundColor: !!endsAt ? 'red' : colors.button,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 10, color: 'white'}}>
                {!!endsAt ? 'Ended' : 'Ongoing'}
              </Text>
            </View>
            {/* {!!endsAt ? (
              <Chip
                compact
                textStyle={{fontSize: 8, color: 'white'}}
                style={{
                  ...styles.chip,
                  backgroundColor: colors.star,
                  width: 20,
                }}>
                Ended
              </Chip>
            ) : (
              <Chip
                compact
                textStyle={{fontSize: 8, color: 'white'}}
                style={{...styles.chip, backgroundColor: colors.button}}>
                Ongoing
              </Chip>
            )} */}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default AgreementCard;

const styles = StyleSheet.create({
  chip: {borderRadius: 20},
});
