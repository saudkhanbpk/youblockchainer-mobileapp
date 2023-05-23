import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, useTheme} from 'react-native-paper';

const SubmitButton = ({label, loading, onClick, style, disabled}) => {
  const {colors} = useTheme();
  return (
    <Button
      mode="contained"
      onPress={onClick}
      disabled={disabled || loading}
      loading={loading}
      buttonColor={colors.primary}
      style={{
        ...styles.button,
        ...style,
      }}>
      {label}
    </Button>
    // <TouchableOpacity
    //   disabled={loading}
    //   onPress={onClick}
    //   style={{
    //     ...styles.button,
    //     ...style,
    //     backgroundColor: loading ? colors.primary : colors.secondary,
    //   }}>
    //   {loading ? (
    //     <ActivityIndicator size={'small'} color={'white'} />
    //   ) : (
    //     <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
    //       {label}
    //     </Text>
    //   )}
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    // width: '75%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
export default SubmitButton;
