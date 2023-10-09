import React, {useContext, useEffect, useState} from 'react';
import {
  useTheme,
  Card,
  Title,
  Modal,
  TextInput,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import {GlobalContext} from '../../auth/GlobalProvider';
import {buyScriptFromContract, getScriptPrice} from '../../utils/chatAPI';
import SubmitButton from '../SubmitButton';

const BuyScriptModal = ({show, setShow, getBalance}) => {
  const {colors} = useTheme();
  const {mainContract, contractAddress, authRef, user, web3} =
    useContext(GlobalContext);
  const [price, setPrice] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [num, setNum] = useState('');

  const getPrice = async () => {
    setLoading(true);
    try {
      setPrice(
        web3.utils.fromWei((await getScriptPrice(mainContract)).toString()),
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPrice();
  }, [web3, mainContract]);

  const buyScript = async () => {
    setPurchasing(true);

    try {
      if (
        await buyScriptFromContract(
          num,
          mainContract,
          user.walletAddress,
          web3.utils.toWei((price * num).toString()),
          authRef,
          contractAddress,
        )
      ) {
        getBalance();
        ToastAndroid.show(
          `${num} script purchased successfully 🎉`,
          ToastAndroid.SHORT,
        );
        setShow(false);
      } else
        ToastAndroid.show(
          `Script purchase unsuccessfull :(`,
          ToastAndroid.SHORT,
        );
    } catch (e) {
      console.log(e);
    }

    setPurchasing(false);
  };

  return (
    <Modal visible={show} onDismiss={() => setShow(false)}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <Title style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
            Buy Scripts
          </Title>
          {loading ? (
            <ActivityIndicator size={'small'} />
          ) : (
            <Text>Price per Script:- {price} Eth</Text>
          )}
          <Text style={{fontWeight: 'bold', marginTop: 10}}>
            Enter number of generations to buy
          </Text>
          <TextInput
            value={num}
            onChangeText={setNum}
            disabled={loading}
            keyboardType="numeric"
            style={{
              ...styles.reasonInput,
              borderColor: colors.textAfter,
              color: colors.text,
            }}
            placeholder={'Enter Number of scripts'}
            placeholderTextColor={colors.disabled}
          />
          {!!num && !isNaN(num) && <Text>Total Cost:- {price * num} Eth</Text>}
          <SubmitButton
            style={{marginTop: 30}}
            label={'Purchase'}
            loading={purchasing}
            onClick={buyScript}
            disabled={loading || isNaN(num) || !num}
          />
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '80%',
    height: 300,
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
    marginBottom: 10,
  },
});
export default BuyScriptModal;
