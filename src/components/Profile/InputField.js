import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme, TextInput} from 'react-native-paper';

const InputField = ({
  style,
  text,
  setText,
  label,
  placeholder = '',
  props = {},
  children,
}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      {/* <View style={{flexDirection: 'row'}}>
        <Text
          style={{color: colors.primary, fontWeight: 'bold', marginBottom: 8}}>
          {label}
        </Text>
        {children}
      </View> */}
      <TextInput
        mode="outlined"
        label={label}
        value={text}
        {...props}
        onChangeText={setText}
        activeOutlineColor={colors.primary}
        outlineColor={'white'}
        style={{
          ...styles.input,
          ...style,
          backgroundColor: 'white',
          // borderColor: colors.disabled,
          color: colors.text,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    //height: 50,
    // borderWidth: 2,
    marginLeft: 5,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
  },
});

export default InputField;
