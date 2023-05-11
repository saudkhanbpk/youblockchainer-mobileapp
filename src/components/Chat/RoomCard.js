import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Subheading, useTheme, Avatar, Paragraph} from 'react-native-paper';
import {width} from '../../Constants';

const RoomCard = ({image, name, description}) => {
  const {colors} = useTheme();

  return (
    <View style={{...styles.container, borderTopColor: colors.textAfter}}>
      <View style={{flexDirection: 'row'}}>
        <Avatar.Image source={{uri: image}} size={45} />
        <View style={{marginLeft: 10}}>
          <Subheading>{name}</Subheading>
          {description && (
            <Paragraph style={{width: '100%', fontSize: 12}} numberOfLines={1}>
              {description}
            </Paragraph>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderTopWidth: 1,
    paddingTop: 15,
  },
  label: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  linearGradient: {
    height: 30,
    width: width / 3.7,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default RoomCard;
