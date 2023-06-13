import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, ToastAndroid} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {
  grantRefundRequest,
  updateRefundRequest,
} from '../../utils/agreementAPI';

const RefundRequestEntry = ({
  isAssigner,
  data,
  getMilestones,
  index,
  contract,
  contractAddr,
  totalRequested,
  total,
}) => {
  const {colors} = useTheme();
  const [id, milestoneId, amount, resolved] = data;
  const {executeMetaTx, web3, user} = useContext(GlobalContext);
  const [editAmt, setEditAmt] = useState(web3.utils.fromWei(amount));
  const [executing, setExecuting] = useState(false);
  const [editing, setEditing] = useState(false);
  // console.log(data);

  const updateRequest = async () => {
    if (isNaN(editAmt)) return alert('Refund amount should be a number');

    if (total + amount - totalRequested < Number(editAmt))
      return alert('Refund Amount cannot exceed undisputed amount');
    setExecuting(true);

    if (
      await updateRefundRequest(
        id,
        web3.utils.toWei(editAmt),
        contract,
        executeMetaTx,
        contractAddr,
      )
    ) {
      await getMilestones();

      return ToastAndroid.show('Refund request updated ✅', ToastAndroid.SHORT);
    }
    alert('Refund Request updation failed');
    setExecuting(false);
    setEditing(false);
  };

  const approveRequest = async () => {
    setExecuting(true);
    if (await grantRefundRequest(id, contract, executeMetaTx, contractAddr)) {
      await getMilestones();

      return ToastAndroid.show(
        'Refund request approved ✅',
        ToastAndroid.SHORT,
      );
    }
    alert('Refund Request approval failed');
    setExecuting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold'}}>{index}.</Text>
      {editing ? (
        <TextInput
          value={editAmt}
          onChangeText={setEditAmt}
          style={{
            ...styles.reasonInput,
            borderColor: colors.textAfter,
            color: colors.text,
          }}
          placeholder={'Amount (in ETH)'}
          placeholderTextColor={colors.disabled}
        />
      ) : (
        <Text>{web3.utils.fromWei(amount)} ETH</Text>
      )}
      {isAssigner ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {!resolved && (
            <View>
              {editing ? (
                executing ? (
                  <ActivityIndicator size={'small'} />
                ) : (
                  <View style={{flexDirection: 'row'}}>
                    <IconButton
                      onPress={updateRequest}
                      icon={'check'}
                      size={20}
                      style={{...styles.icon, color: colors.primary}}
                    />
                    <IconButton
                      onPress={() => setEditing(false)}
                      icon={'cancel'}
                      size={20}
                      style={{...styles.icon, color: colors.primary}}
                    />
                  </View>
                )
              ) : (
                <IconButton
                  onPress={() => setEditing(true)}
                  icon={'pencil'}
                  size={20}
                  style={{...styles.icon, color: colors.primary}}
                />
              )}
            </View>
          )}
          <Text
            style={{
              fontWeight: 'bold',
              color: resolved ? colors.button : colors.text,
            }}>
            {resolved ? 'Processed' : 'Requested'}
          </Text>
        </View>
      ) : (
        <View>
          <Button
            disabled={resolved}
            uppercase={false}
            textColor={colors.primary}
            onPress={approveRequest}
            loading={executing}>
            {resolved ? 'Approved' : 'Approve'}
          </Button>
        </View>
      )}
    </View>
  );
};

export default RefundRequestEntry;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  icon: {
    right: 10,
    fontSize: 10,
  },
  reasonInput: {
    height: 40,
    lineHeight: 5,
    borderWidth: 1,
    borderRadius: 2,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 5,
    fontSize: 10,
  },
});
