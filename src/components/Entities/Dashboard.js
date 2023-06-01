import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Chip, IconButton, Text, useTheme} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import EditProfile from '../../screens/Profile/EditProfile';

const Dashboard = ({profile, setShow, onHire, onConnect}) => {
  const {name, nickname, description, manager, skills} = profile;
  const {colors} = useTheme();
  const {user} = useContext(GlobalContext);
  // const navigation = useNavigation();

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={{color: colors.textAfter, fontWeight: 'bold'}}>
            {nickname}
          </Text>
        </View>

        {user && !(user._id === manager._id) && (
          // ? (
          //   <Button onPress={() => setShow(true)}>Edit Profile</Button>
          // ) :
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
            {/* <Button
              mode="contained"
              onPress={onHire}
              buttonColor={colors.button}
              textColor={'white'}>
              Hire
            </Button> */}
          </View>
        )}
        {/* <IconButton
          icon={'pencil'}
          iconColor={colors.textAfter}
          onPress={() => navigation.navigate('EditProfile')}
        /> */}
      </View>
      <Text style={{color: colors.textAfter, marginTop: 15}}>
        {description}
      </Text>
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
