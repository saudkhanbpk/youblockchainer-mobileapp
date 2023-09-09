import React, {useContext, useState} from 'react';
import {
  useTheme,
  Card,
  Title,
  Modal,
  IconButton,
  TextInput,
  Button,
} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {GlobalContext} from '../auth/GlobalProvider';
import {validateEmail} from '../utils/helper';

const AuthOptionModal = ({show, setShow}) => {
  const {colors} = useTheme();
  const {connect} = useContext(GlobalContext);
  const [isPasswordLess, setIsPasswordLess] = useState(false);
  const [email, setEmail] = useState('');
  const buttons = [
    {
      icon: 'google',
      option: 'google',
    },
    {
      icon: 'discord',
      option: 'discord',
    },
    {
      icon: 'account-key',
      option: 'passwordless',
      disabled: true,
    },
  ];

  return (
    <Modal visible={show} onDismiss={() => setShow(false)}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <Title style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
            {isPasswordLess ? 'Enter your Email' : 'Choose a Login Option'}
          </Title>
          {isPasswordLess ? (
            <View>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={{
                  ...styles.reasonInput,
                  borderColor: colors.textAfter,
                  color: colors.text,
                }}
                placeholder={'doe@example.com'}
                placeholderTextColor={colors.disabled}
              />
              <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                <Button onPress={() => setIsPasswordLess(false)}>Back</Button>
                <Button
                  mode="contained"
                  style={{backgroundColor: colors.primary}}
                  disabled={true}
                  onPress={() => {
                    if (!validateEmail(email)) return;
                    connect('passwordless', email);
                    setShow(false);
                  }}>
                  Login
                </Button>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: '5%',
              }}>
              {buttons.map((item, index) => (
                <IconButton
                  icon={item.icon}
                  key={index}
                  disabled={item.disabled}
                  iconColor={colors.primary}
                  onPress={() => {
                    if (item.option === 'passwordless')
                      return setIsPasswordLess(true);
                    connect(item.option);
                    setShow(false);
                  }}
                />
              ))}
            </View>
          )}
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
  },

  card: {
    padding: 20,
    borderRadius: 10,
    flex: 1,
  },
  reasonInput: {
    height: 40,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    fontSize: 12,
  },
});
export default AuthOptionModal;
