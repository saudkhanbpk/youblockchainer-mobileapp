import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, Card, Text, useTheme} from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import {defaultAvatar} from '../../Constants';

const PastAgreementCard = ({agreement, baseStyle}) => {
  const {user1, name, reviewForU2, ratingForU2} = agreement;
  const {profileImage} = user1;
  const {colors} = useTheme();

  return (
    <Card style={{...baseStyle, ...styles.container}}>
      <View>
        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <Avatar.Image
            source={{uri: profileImage || defaultAvatar}}
            size={45}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{name}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <StarRating
                disabled={true}
                maxStars={5}
                halfStarEnabled
                rating={ratingForU2}
                containerStyle={{width: 80}}
                emptyStarColor={colors.border}
                starSize={15}
                fullStarColor={colors.star}
                halfStarColor={colors.star}
              />
              <Text
                style={{color: colors.textAfter, fontSize: 12, marginLeft: 5}}>
                {ratingForU2}
              </Text>
            </View>
          </View>
        </View>
        <Text style={{color: colors.textAfter}}>{reviewForU2}</Text>
      </View>
    </Card>
  );
};

export default PastAgreementCard;

const styles = StyleSheet.create({
  container: {},
});
