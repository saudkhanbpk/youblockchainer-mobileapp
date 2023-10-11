import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {buyScriptsFromContract} from '../../utils/chatAPI';
import SubmitButton from '../SubmitButton';
import {GlobalContext} from '../../auth/GlobalProvider';
import axios from 'axios';

const PlanCard = ({data, index, getBalance}) => {
  const {colors} = useTheme();
  const [name, price, numScripts] = data;
  const [purchasing, setPurchasing] = useState(false);
  const [etherPrice, setEtherPrice] = useState(0);
  const {mainContract, contractAddress, authRef, user, web3} =
    useContext(GlobalContext);

  const buyScript = async () => {
    setPurchasing(true);
    if (
      await buyScriptsFromContract(
        index,
        mainContract,
        user.walletAddress,
        price,
        authRef,
        contractAddress,
      )
    ) {
      await getBalance();
      ToastAndroid.show(
        `${num} script purchased successfully 🎉`,
        ToastAndroid.SHORT,
      );
      setShow(false);
    } else
      ToastAndroid.show(`Script purchase unsuccessfull :(`, ToastAndroid.SHORT);
    setPurchasing(false);
  };

  const getDollarValues = () => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
      )
      .then(response => {
        setEtherPrice(response.data[1].current_price);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    getDollarValues();
  }, [price]);

  return (
    <View style={styles.container}>
      <View
        style={{width: '100%', backgroundColor: colors.secondary, padding: 10}}>
        <Text style={{color: 'white'}}>{name}</Text>
        <Text style={styles.priceText}>{web3.utils.fromWei(price)} ETH</Text>
        {!!etherPrice && (
          <Text style={{color: 'white', fontSize: 12}}>
            (${parseInt(web3.utils.fromWei(price)) * etherPrice})
          </Text>
        )}
      </View>
      <Text>✓ {numScripts}</Text>
      <SubmitButton
        label={'Subscribe'}
        onClick={buyScript}
        loading={purchasing}
        style={{width: '100%'}}
      />
    </View>
  );
};

export default PlanCard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
    height: '80%',
    width: 140,
  },
  priceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
