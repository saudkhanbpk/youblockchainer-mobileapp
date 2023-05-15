import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Chip, Text} from 'react-native-paper';

const SkillCard = ({profile, baseStyle}) => {
  const {skills} = profile;
  return (
    <Card style={{...baseStyle, ...styles.container}}>
      <View>
        <Text style={styles.title}>Skills</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {skills.map(skill => (
            <Chip
              compact
              disabled
              textStyle={{fontSize: 12}}
              style={styles.chip}>
              {skill}
            </Chip>
          ))}
        </View>
      </View>
    </Card>
  );
};

export default SkillCard;

const styles = StyleSheet.create({
  container: {},
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  chip: {borderRadius: 20, marginVertical: 5, marginRight: 10},
});
