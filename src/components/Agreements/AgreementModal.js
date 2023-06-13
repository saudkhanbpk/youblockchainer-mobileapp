import React, {useContext, useState} from 'react';
import {useTheme, Card, Title, Modal} from 'react-native-paper';
import {ScrollView, StyleSheet, View} from 'react-native';
import {GlobalContext} from '../../auth/GlobalProvider';
import InputField from '../Profile/InputField';
import moment from 'moment/moment';
import SubmitButton from '../SubmitButton';
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from 'react-native-date-picker';
import {createAgreement} from '../../utils/agreementAPI';
import {ToastAndroid} from 'react-native';
import CancelButton from '../CancelButton';

const AgreementModal = () => {
  const {colors} = useTheme();
  const [name, setName] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [startsAt, setStartsAt] = useState(null);
  const [setting, setSetting] = useState(false);
  const {
    user,
    mainContract,
    executeMetaTx,
    showAgreement,
    setShowAgreement,
    web3,
  } = useContext(GlobalContext);

  const clicker = async () => {
    setSetting(true);
    if (!startsAt || name.length === 0) {
      return alert('"Name" and "Starts At" field cannot be empty');
    }
    if (
      await createAgreement(
        user,
        showAgreement,
        name,
        moment(startsAt).unix(),
        moment().unix(),
        mainContract,
        executeMetaTx,
        web3,
      )
    ) {
      setShowAgreement(null);
      return ToastAndroid.show(
        'Agreement created Successfully 🎉',
        ToastAndroid.SHORT,
      );
    }
    setSetting(false);
  };

  return (
    <Modal visible={showAgreement} onDismiss={() => setShowAgreement(null)}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <ScrollView>
            <Title
              style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
              Enter Agreement Details
            </Title>
            <InputField
              text={name}
              setText={setName}
              label={'Agreement Name*'}
            />
            <InputField
              label={'Starts At*'}
              text={startsAt ? new Date(startsAt).toLocaleString() : ''}
              // style={{width: width / 2.5, fontSize: 12}}
              props={{onPressIn: () => setShowPicker(true)}}
              children={
                <Entypo
                  name="calendar"
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
              label={'Create'}
              loading={setting}
              onClick={clicker}
            />
            {setting && <CancelButton setLoading={setSetting} />}
            <DatePicker
              modal
              mode="date"
              title={`Select Agreement Start date`}
              open={showPicker}
              minimumDate={new Date()}
              date={new Date()}
              onConfirm={date => {
                //console.log(date);
                date.setHours(0, 0, 0, 0);
                let changed = date.toUTCString(); //.split('T')[0] + 'T00:00:00';

                setStartsAt(changed);
                setShowPicker(false);
              }}
              onCancel={() => setShowPicker(false)}
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
    height: '60%',
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
export default AgreementModal;
