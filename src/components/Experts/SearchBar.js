import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput as Input,
} from 'react-native';
import {useTheme, IconButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {width} from '../../Constants';

const SearchBar = ({query, setQuery, placeholder}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <Input
        placeholder={placeholder}
        placeholderTextColor={colors.textAfter}
        style={{...styles.input, color: colors.text}}
        value={query}
        onChangeText={setQuery}
      />

      <Ionicons name={'search'} size={32} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ffff',
    borderRadius: 5,
  },
  input: {
    height: 45,
    width: width / 1.3,
    paddingRight: 50,
    fontFamily: 'Poppins-Regular',
  },
});

export default SearchBar;
