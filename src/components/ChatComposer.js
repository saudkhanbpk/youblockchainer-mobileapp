import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput as Input,
} from 'react-native';
import {useTheme, IconButton} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {width} from '../Constants';

const ChatComposer = ({
  value,
  onChangeText,
  onSend,
  props,
  onImagePress,
  disabled,
}) => {
  const {colors} = useTheme();
  return (
    <View {...props} style={{...styles.container, opacity: disabled ? 0.3 : 1}}>
      <View>
        <Input
          editable={!disabled}
          placeholder={
            disabled ? 'Something on your mind..' : 'Type your message here...'
          }
          // icon="image"
          // family="Feather"
          placeholderTextColor={colors.textAfter}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          multiline
          //iconColor={colors.border}
          //iconSize={30}
        />
        {!!onImagePress && (
          <TouchableOpacity
            style={{position: 'absolute', right: 10, top: '30%'}}
            onPress={onImagePress}>
            <Feather name="image" color={colors.text} size={26} />
          </TouchableOpacity>
        )}
      </View>
      <IconButton
        icon={'send'}
        size={32}
        iconColor={colors.primary}
        onPress={onSend}
        // disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: 0,
    alignItems: 'center',
    width: '95%',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: -5,
  },
  input: {
    height: 45,
    width: width / 1.3,
    paddingRight: 50,
  },
});

export default ChatComposer;
