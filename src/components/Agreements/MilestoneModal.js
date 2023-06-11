import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTheme, Card, Title, Modal} from 'react-native-paper';
import {
  ScrollView,
  StyleSheet,
  View,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {GlobalContext} from '../../auth/GlobalProvider';
import InputField from '../Profile/InputField';
import SubmitButton from '../SubmitButton';
import Entypo from 'react-native-vector-icons/Entypo';
import {addMilestone, updateMilestone} from '../../utils/agreementAPI';

const MilestoneModal = ({contract, addr, show, setShow}) => {
  const {colors} = useTheme();
  const isEditing = useMemo(() => typeof show === 'object', [show]);
  const {executeMetaTx, web3} = useContext(GlobalContext);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [setting, setSetting] = useState(false);

  const clicker = async () => {
    if (!description.length || !name.length) {
      return alert('"Name" or "Description" field cannot be empty');
    }
    if (isNaN(amount)) {
      return alert('Amount field should be numerical');
    }
    setSetting(true);
    if (
      isEditing
        ? await updateMilestone(
            show[0],
            name,
            web3.utils.toWei(amount),
            description,
            executeMetaTx,
            contract,
            addr,
          )
        : await addMilestone(
            name,
            web3.utils.toWei(amount),
            description,
            executeMetaTx,
            contract,
            addr,
          )
    ) {
      setShow(null);
      return ToastAndroid.show(
        `Milestone ${isEditing ? 'edited' : 'added'} successfully 🎉`,
        ToastAndroid.SHORT,
      );
    }
    setSetting(false);
  };

  useEffect(() => {
    setSetting(false);
    if (!isEditing) {
      setName('');
      setDescription('');
      setAmount('');
    }
    if (show) {
      setName(show[1]);
      setAmount(web3.utils.fromWei(show[2]));
      setDescription(show[3]);
    }
  }, [show]);

  return (
    <Modal visible={show} onDismiss={() => setShow(false)}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <ScrollView>
            <Title
              style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
              {isEditing ? 'Edit' : 'Enter'} Milestone Details
            </Title>
            <InputField
              text={name}
              setText={setName}
              label={'Milestone Name*'}
            />
            <InputField
              label={'Description*'}
              text={description}
              props={{multiline: true}}
              setText={setDescription}
            />
            <InputField
              label={'Amount* (in ETH)'}
              text={amount}
              setText={setAmount}
              // style={{width: width / 2.5, fontSize: 12}}
              children={
                <Entypo
                  name="ethereum"
                  size={20}
                  style={{
                    fontSize: 20,
                    color: colors.textAfter,
                    marginLeft: 10,
                  }}
                />
              }
            />
            <SubmitButton
              label={isEditing ? 'Edit' : 'Add'}
              loading={setting}
              onClick={clicker}
            />
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '80%',
    height: '75%',
    alignSelf: 'center',
  },
  activedot: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  card: {padding: 20, borderRadius: 10, flex: 1, color: 'white'},
  linearGradient1: {
    padding: 5,
    width: 60,
    marginHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
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
  label: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    alignSelf: 'flex-end',
  },
});
export default MilestoneModal;
