import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  ToastAndroid,
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
  requestPayment,
} from '../../utils/agreementAPI';
import {GlobalContext} from '../../auth/GlobalProvider';

const MileStoneCard = ({
  index,
  milestone,
  isAssigner,
  contract,
  getMilestone,
  setShow,
  contractAddr,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [id, name, amount, description, funded, paymentRequested, paid] =
    milestone;
  const {colors} = useTheme();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const {executeMetaTx, web3, user} = useContext(GlobalContext);

  const togglePlans = () => {
    LayoutAnimation.configureNext({
      duration: 700,
      create: {type: 'linear', property: 'opacity'},
      update: {type: 'spring', springDamping: 1},
      delete: {type: 'linear', property: 'opacity'},
    });
    setExpanded(e => !e);
  };
  const getHeight = () => {
    if (expanded) return 'auto';
    else return 60;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
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
        ? await fundMilestone(id, contract, user.walletAddress, amount)
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
        `Request For payment raised successfully 🎉`,
        ToastAndroid.SHORT,
      );
    }
    ToastAndroid.show(
      'Operation failed :( Try again later..',
      ToastAndroid.SHORT,
    );
    setLoading(false);
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: getHeight(),
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
              {index}
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
            </Text>
          </View>
        </View>
        <IconButton
          onPress={togglePlans}
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          style={{...styles.icon, color: colors.primary}}
        />
      </View>
      {expanded ? (
        <View style={{marginLeft: 35}}>
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
                  {funded ? (paid ? 'Paid' : 'Pay') : 'Fund'}
                </Button>
                {funded ? (
                  !paid && (
                    <Button
                      uppercase={false}
                      loading={loading}
                      onPress={() => {}}
                      textColor={colors.text}>
                      Request Refund
                    </Button>
                  )
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <IconButton
                      onPress={() => setShow(milestone)}
                      icon={'pencil'}
                      style={{...styles.icon, color: colors.primary}}
                    />
                    {deleting ? (
                      <ActivityIndicator size={'small'} />
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
              {paymentRequested && (
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
                ? 'Paid'
                : paymentRequested
                ? 'Payment Requested'
                : 'Request Payment'}
            </Button>
          ) : (
            <Text style={{color: colors.star}}>Milestone not funded</Text>
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
});
