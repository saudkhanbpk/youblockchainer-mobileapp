import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Chip, Text, useTheme} from 'react-native-paper';
import {width} from '../../Constants';
import ImageLoader from '../ImageLoader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FlatList} from 'react-native';

const CustomChip = ({label, bgColor, textStyle}) => {
  return (
    <View
      style={{
        padding: 5,
        borderRadius: 20,
        backgroundColor: bgColor,
        margin: 2,
      }}>
      <Text style={{fontSize: 9, ...textStyle}}>{label}</Text>
    </View>
  );
};
const ExpertCard = ({expert}) => {
  const {colors} = useTheme();
  const {profileImage, username, rate, skills, isVerified} = expert;
  return (
    <Card style={styles.container}>
      <ImageLoader
        uri={profileImage}
        style={styles.imageStyle}
        borderRadius={10}
      />
      <View style={{flexDirection: 'row'}}>
        <Text style={{letterSpacing: 1, marginTop: 5}}>{username}</Text>
        {isVerified && <MaterialIcons name="verified" style={styles.icon} />}
      </View>

      <View style={styles.section}>
        <FlatList
          data={skills}
          horizontal={true}
          style={{maxWidth: '60%'}}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item}) => (
            <CustomChip
              label={item}
              bgColor={colors.textBefore}
              textStyle={{color: colors.textAfter}}
            />
            // <Chip
            //   compact
            //   disabled
            //   style={{borderRadius: 20}}
            //   textStyle={{fontSize: 8}}>
            //   {item}
            // </Chip>
          )}
        />
        <CustomChip
          label={`$${rate}/hr`}
          bgColor={colors.accent}
          textStyle={{color: colors.backgroundLight, fontWeight: 'bold'}}
        />
        {/* <Chip
          compact
          style={{backgroundColor: colors.accent, borderRadius: 20}}
          textStyle={{color: '#fff', fontWeight: 'bold', fontSize: 8}}>
          ${rate}/hr
        </Chip> */}
      </View>
    </Card>
  );
};

export default ExpertCard;

const styles = StyleSheet.create({
  container: {
    width: width / 2.2,
    padding: 5,
    backgroundColor: '#fff',
    margin: 5,
  },
  imageStyle: {
    width: '100%',
    height: (width / 2.2 - 5) * 0.7,
  },
  section: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 14,
    color: '#1A83FF',
    marginLeft: 3,
    marginTop: 3,
  },
});
