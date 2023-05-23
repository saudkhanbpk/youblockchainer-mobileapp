import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Chip, IconButton, Text, useTheme} from 'react-native-paper';

const Dashboard = ({profile}) => {
  const {username, bio, descriptorTitle, skills = []} = profile;
  const {colors} = useTheme();
  const navigation = useNavigation();

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.title}>{username}</Text>
          <Text style={{color: colors.textAfter, fontWeight: 'bold'}}>
            {descriptorTitle}
          </Text>
        </View>
        <IconButton
          icon={'pencil'}
          iconColor={colors.textAfter}
          onPress={() => navigation.navigate('EditProfile')}
        />
      </View>
      <Text style={{color: colors.textAfter, marginTop: 15}}>{bio}</Text>
      {!!skills.length && (
        <View style={{marginTop: 15}}>
          <Text style={styles.title}>Skills</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {skills.map((skill, index) => (
              <Chip
                key={index}
                compact
                disabled
                textStyle={{fontSize: 12}}
                style={styles.chip}>
                {skill}
              </Chip>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  chip: {borderRadius: 20, marginVertical: 5, marginRight: 10},
});
