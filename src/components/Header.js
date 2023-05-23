import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Header = ({title, func, noArr}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {noArr ? null : (
        <TouchableOpacity onPress={func || navigation.goBack} hitSlop={30}>
          <AntDesign name="left" color={colors.text} size={18} />
        </TouchableOpacity>
      )}
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {letterSpacing: 2, fontSize: 18, marginLeft: 10},
});

export default Header;
