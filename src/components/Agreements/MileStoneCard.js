import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  ToastAndroid,
  TextInput,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  deleteMilestone,
  fundMilestone,
  payMilestone,
  raiseRefundRequest,
  requestPayment,
} from '../../utils/agreementAPI';
import {GlobalContext} from '../../auth/GlobalProvider';
import RefundRequestEntry from './RefundRequestEntry';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SubmitButton from '../SubmitButton';
import CancelButton from '../CancelButton';

const MileStoneCard = ({
  index,
  milestone,
  isAssigner,
  contract,
  getMilestone,
  setShow,
  contractAddr,
  feeRate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [
    id,
    name,
    amount,
    description,
    funded,
    paymentRequested,
    paid,
    refundRequests,
  ] = milestone;
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [refundAmt, setRefundAmt] = useState('');
  const [totalRequested, setTotalRequested] = useState(0);
  const {executeMetaTx, web3, user} = useContext(GlobalContext);
  const feeAmount = (amount * feeRate) / 1000;

  const togglePlans = () => {
    LayoutAnimation.configureNext({
      duration: 700,
      create: {type: 'linear', property: 'opacity'},
      update: {type: 'spring', springDamping: 1},
      delete: {type: 'linear', property: 'opacity'},
    });
    setExpanded(e => !e);
  };
  // const getHeight = () => {
  //   if (expanded) return 'auto';
  //   else return 60;
  // };

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    let total = 0;
    refundRequests.forEach(element => {
      total += Number(element[2]);
    });
    setTotalRequested(total);
  }, []);

  const deleteMileStoneClick = async () => {
    Alert.alert('Are you Sure ?', 'Do you want to remove this milestone', [
      {
        text: 'cancel',
        style: 'cancel',
      },
      {
        text: 'ok',
        onPress: async () => {
          setDeleting(true);
          await deleteMilestone(id, contract, executeMetaTx, contractAddr);
          setDeleting(false);
          getMilestone();
        },
      },
    ]);
  };

  const assignerClick = async () => {
    if (paid) return;
    setLoading(true);
    if (
      !funded
        ? await fundMilestone(
            id,
            contract,
            user.walletAddress,
            Number(amount) + feeAmount,
          )
        : await payMilestone(id, contract, executeMetaTx, contractAddr)
    ) {
      await getMilestone();
      return ToastAndroid.show(
        `${funded ? 'Paid to creator ' : 'Funded milestone '} successfully 🎉`,
        ToastAndroid.SHORT,
      );
    }
    ToastAndroid.show(
      'Operation failed :( Try again later..',
      ToastAndroid.SHORT,
    );
    setLoading(false);
  };

  const creatorClick = async () => {
    setLoading(true);
    if (await requestPayment(id, contract, executeMetaTx, contractAddr)) {
      await getMilestone();
      return ToastAndroid.show(
        `Request For payment raised ✅`,
        ToastAndroid.SHORT,
      );
    }
    ToastAndroid.show(
      'Operation failed :( Try again later..',
      ToastAndroid.SHORT,
    );
    setLoading(false);
  };

  const generateRequest = async () => {
    if (isNaN(refundAmt)) return alert('Refund amount should be a number');

    if (amount - totalRequested < Number(refundAmt))
      return alert('Refund Amount cannot exceed undisputed amount');
    setGenerating(true);

    if (
      await raiseRefundRequest(
        id,
        web3.utils.toWei(refundAmt),
        contract,
        executeMetaTx,
        contractAddr,
      )
    ) {
      await getMilestone();
      return ToastAndroid.show(
        'Refund request generated successfully successfully 🎉',
        ToastAndroid.SHORT,
      );
    }
    alert('Refund Request failed');
    setGenerating(false);
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        //height: getHeight(),
        marginVertical: 5,
        marginHorizontal: 15,
      }}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              ...styles.index,
              borderColor: paid ? colors.primary : colors.text,
            }}>
            <Text
              style={{
                color: paid ? colors.primary : colors.text,
              }}>
              {index + 1}
            </Text>
          </View>
          <View>
            <Text style={styles.category}>{name}</Text>
            <Text
              style={{
                color: paid ? colors.primary : colors.text,
                fontFamily: 'Poppins-SemiBold',
              }}>
              {web3.utils.fromWei(amount)} ETH
              {isAssigner
                ? '+ \n' +
                  web3.utils.fromWei(feeAmount.toString()) +
                  ` ETH (${feeRate / 10}% fee )`
                : ''}
            </Text>
          </View>
        </View>
        <IconButton
          onPress={togglePlans}
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          style={{...styles.icon, color: colors.primary}}
        />
      </View>
      {/* <Text
        style={{
          color: paid ? colors.primary : colors.text,
          fontFamily: 'Poppins-SemiBold',
        }}>
        {web3.utils.fromWei(amount)} ETH
        {isAssigner
          ? '+' +
            web3.utils.fromWei(feeAmount.toString()) +
            ` ETH (${feeRate / 10}% fee )`
          : ''}
      </Text> */}
      {expanded ? (
        <View style={{marginLeft: 35}}>
          <Text style={styles.subheading}>Description</Text>
          <Text>{description}</Text>
          {isAssigner ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Button
                  uppercase={false}
                  loading={loading}
                  onPress={assignerClick}
                  textColor={paid ? colors.primary : colors.button}>
                  {funded
                    ? paid
                      ? 'Payment Forwarded'
                      : loading
                      ? 'Paying'
                      : 'Pay'
                    : loading
                    ? 'Funding Milestone'
                    : 'Fund'}
                </Button>
                {!funded && (
                  <View style={{flexDirection: 'row'}}>
                    <IconButton
                      onPress={() => setShow(milestone)}
                      icon={'pencil'}
                      style={{...styles.icon, color: colors.primary}}
                    />
                    {deleting ? (
                      <ActivityIndicator
                        size={'small'}
                        style={{marginHorizontal: 5}}
                      />
                    ) : (
                      <IconButton
                        onPress={deleteMileStoneClick}
                        icon={'delete-outline'}
                        style={{...styles.icon, color: colors.primary}}
                      />
                    )}
                  </View>
                )}
              </View>
              {!paid && paymentRequested && (
                <Text style={{color: colors.star}}>
                  Creator has requested payment
                </Text>
              )}
            </View>
          ) : funded ? (
            <Button
              uppercase={false}
              loading={loading}
              onPress={creatorClick}
              disabled={!paid && paymentRequested}
              textColor={paid ? colors.primary : colors.button}>
              {paid
                ? 'Payment Received'
                : paymentRequested
                ? 'Payment Requested'
                : loading
                ? 'Requesting'
                : 'Request Payment'}
            </Button>
          ) : (
            <Text style={{color: colors.star}}>Milestone not funded</Text>
          )}
          {isAssigner && funded && !paid && (
            <View>
              <Text style={styles.subheading}>Generate Refund Request</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <TextInput
                  value={refundAmt}
                  onChangeText={setRefundAmt}
                  style={{
                    ...styles.reasonInput,
                    borderColor: colors.textAfter,
                    color: colors.text,
                  }}
                  placeholder={'Amount (in ETH)'}
                  placeholderTextColor={colors.disabled}
                />
                {/* <SubmitButton
                  label={'Generate'}
                  loading={generating}
                  onClick={generateRequest}
                  style={{marginBottom: 10 , marginLeft:10}}
                /> */}
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginLeft: 5,
                    borderRadius: 5,
                    marginBottom: '15%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={generateRequest}>
                  {generating && (
                    <ActivityIndicator
                      color="white"
                      size={'small'}
                      style={{marginHorizontal: 5}}
                    />
                  )}
                  <Text
                    style={{fontSize: 12, fontWeight: 'bold', color: 'white'}}>
                    Generat{generating ? 'ing' : 'e'}
                  </Text>
                </TouchableOpacity>
                {generating && <CancelButton setLoading={setGenerating} />}
                {/* <Button
                  mode="contained"
                  uppercase={false}
                  loading={generating}
                  onPress={generateRequest}
                  textColor="white"
                  labelStyle={{fontSize: 10}}
                  style={{
                    backgroundColor: colors.primary,
                    height: 42,
                    width: 100,
                    alignItems: 'center',
                  }}>
                  Generate
                </Button> */}
              </View>
            </View>
          )}
          {!!refundRequests.length && !paid && (
            <View>
              <Text style={styles.subheading}>Refund Requests</Text>
              {refundRequests.map((item, i) => (
                <RefundRequestEntry
                  key={i}
                  index={i + 1}
                  data={item}
                  isAssigner={isAssigner}
                  getMilestones={getMilestone}
                  contract={contract}
                  contractAddr={contractAddr}
                  totalRequested={totalRequested}
                  total={amount}
                />
              ))}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default MileStoneCard;

const styles = StyleSheet.create({
  container: {},
  icon: {
    right: 10,
    fontSize: 30,
  },
  category: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  header: {
    flexDirection: 'row',
    //height: 60,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  index: {
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 10,
  },
  subheading: {fontWeight: 'bold', textDecorationLine: 'underline'},
  reasonInput: {
    height: 40,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
    fontSize: 12,
  },
});
