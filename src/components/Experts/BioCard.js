import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Chip, Text, useTheme} from 'react-native-paper';

const BioCard = ({profile, baseStyle}) => {
  const {descriptorTitle, bio, rate} = profile;
  const {colors} = useTheme();

  return (
    <Card style={{...baseStyle, ...styles.container}}>
      <View>
        <Text style={styles.descriptor}>{descriptorTitle}</Text>
        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <Chip compact disabled style={{borderRadius: 20}}>
            {`$${rate}/hr`}
          </Chip>
        </View>
        <Text style={{color: colors.textAfter}}>{bio}</Text>
      </View>
    </Card>
  );
};

export default BioCard;

const styles = StyleSheet.create({
  container: {},
  descriptor: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
});
