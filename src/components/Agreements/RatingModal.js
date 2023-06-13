import React, {useEffect, useState} from 'react';
import {useTheme, Card, Title, Modal} from 'react-native-paper';
import {ScrollView, StyleSheet, View, ToastAndroid} from 'react-native';
import InputField from '../Profile/InputField';
import SubmitButton from '../SubmitButton';
import StarRating from 'react-native-star-rating';
import {updateAgreement} from '../../utils/agreementAPI';
import CancelButton from '../CancelButton';

const RatingModal = ({
  agreement,
  show,
  setShow,
  isAssigner,
  oppositeParty,
  setAgreement,
}) => {
  const {colors} = useTheme();
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState('');
  const [setting, setSetting] = useState(false);

  const clicker = async () => {
    setSetting(true);
    if (
      await updateAgreement(
        agreement._id,
        isAssigner
          ? {reviewForU2: review, ratingForU2: rating}
          : {reviewForU1: review, ratingForU1: rating},
        setAgreement,
        agreement.contractAddress,
      )
    ) {
      setShow(null);
      return ToastAndroid.show(`Thank you for rating :)`, ToastAndroid.SHORT);
    }
    setSetting(false);
  };

  useEffect(() => {
    setSetting(false);
    setReview('');
    setRating(1);
  }, [show]);

  return (
    <Modal visible={show} onDismiss={() => setShow(false)}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <ScrollView>
            <Title
              style={{
                fontWeight: 'bold',
                marginTop: -5,
                marginBottom: 15,
                textAlign: 'center',
              }}>
              Rate your experience with {oppositeParty.username} for{' '}
              {agreement.name}
            </Title>
            <StarRating
              maxStars={5}
              halfStarEnabled
              rating={rating}
              selectedStar={setRating}
              containerStyle={{width: 80, margin: 10}}
              emptyStarColor={colors.border}
              starSize={25}
              fullStarColor={colors.star}
              halfStarColor={colors.star}
            />
            <InputField
              label={'Comments'}
              text={review}
              props={{multiline: true}}
              setText={setReview}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: '10%',
              }}>
              <SubmitButton
                style={{backgroundColor: colors.text}}
                label={'Close'}
                disabled={setting}
                //loading={setting}
                onClick={() => setShow(false)}
              />
              <SubmitButton
                label={'Done'}
                loading={setting}
                onClick={clicker}
              />
            </View>
            {setting && <CancelButton setLoading={setSetting} />}
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
export default RatingModal;
