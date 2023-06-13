import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ToastAndroid,
  Alert,
} from 'react-native';
import {GlobalContext} from '../../auth/GlobalProvider';
import {dateFormating} from '../../utils/helper';
import {
  Avatar,
  Button,
  Card,
  Chip,
  FAB,
  Paragraph,
  Text,
  useTheme,
} from 'react-native-paper';
import {defaultAvatar, height, width} from '../../Constants';
import Agreement from '../../abis/Agreement.json';
import MilestoneModal from '../../components/Agreements/MilestoneModal';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import MileStoneCard from '../../components/Agreements/MileStoneCard';
import ListEmpty from '../../components/ListEmpty';
import Loading from '../../components/Loading';
import {endContract} from '../../utils/agreementAPI';
import RatingModal from '../../components/Agreements/RatingModal';
import StarRating from 'react-native-star-rating';
import SubmitButton from '../../components/SubmitButton';

const AgreementDetail = ({route}) => {
  const {agreement} = route.params;
  const {user, web3, executeMetaTx} = useContext(GlobalContext);
  const [
    {
      name,
      contractAddress,
      user1,
      user2,
      reviewForU1,
      ratingForU1,
      reviewForU2,
      ratingForU2,
      startsAt,
      endsAt,
      createdAt,
    },
    setAgreement,
  ] = useState(agreement);
  const isEnded = useMemo(() => !!endsAt, [endsAt]);
  const isAssigner = user1._id === user._id;
  const [escrowed, setEscrowed] = useState(0);
  const {colors} = useTheme();
  const startDate = dateFormating(startsAt);
  const endDate = useMemo(
    () => (isEnded ? dateFormating(endsAt) : 'present'),
    [isEnded],
  );
  const [agreementContract, setAgreementContract] = useState(null);
  const [feeRate, setFeeRate] = useState(0);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isAllPaymentResolved, setIsAllPaymentResolved] = useState(false);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    setAgreementContract(new web3.eth.Contract(Agreement, contractAddress));
  }, []);

  const getAllMilestones = async () => {
    setLoading(true);
    try {
      let summ = await agreementContract.methods.getAgreementSummary().call();
      //console.log(fee);
      setFeeRate(summ['10']);
      setEscrowed(summ['6']);
      let res = await agreementContract.methods.getAllMilestones().call();
      let reqs = await agreementContract.methods.getAllRefundRequests().call();

      // console.log(res);
      setIsAllPaymentResolved(!res.find(i => !i[6])); //find paid false and if found set resolved false
      setMilestones(
        res
          .filter(i => i[0] !== '0')
          .map(i => {
            return [...i, reqs.filter(j => j[1] === i[0])];
          }),
      );
    } catch (error) {
      console.log('Error in getting mileStones:- ', error.message);
    }
    setLoading(false);
  };

  const end = () => {
    if (!isAllPaymentResolved)
      return alert(
        'Cannot end the contract unless all milestone payments are resolved',
      );

    Alert.alert('Are you sure ?', 'You want to end this contract', [
      {
        text: 'cancel',
        style: 'cancel',
      },
      {
        text: 'ok',
        onPress: async () => {
          setEnding(true);
          if (
            await endContract(
              agreementContract,
              executeMetaTx,
              contractAddress,
              agreement._id,
              setAgreement,
            )
          ) {
            ToastAndroid.show('Agreement has ended ✅', ToastAndroid.SHORT);
            return setShowRatingModal(true);
          }
          alert('Ending contract failed. Try again later');
          setEnding(false);
        },
      },
    ]);
  };

  useEffect(() => {
    if (agreementContract) getAllMilestones();
  }, [agreementContract, show]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <View>
          <View
            style={{
              marginVertical: 15,
              alignSelf: 'center',
              flexDirection: 'row',
            }}>
            <View>
              <Chip
                compact
                textStyle={{fontSize: 10, color: 'white'}}
                style={{
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  position: 'absolute',
                  width: 60,
                  top: '20%',
                  left: -40,
                  zIndex: 1,
                }}>
                Owner
              </Chip>
              <View style={{borderWidth: 2, borderRadius: 100}}>
                <Avatar.Image
                  source={{uri: user1.profileImage || defaultAvatar}}
                  size={width / 3}
                />
              </View>
            </View>
            <View style={{marginLeft: '-10%'}}>
              <View style={{borderWidth: 2, borderRadius: 100}}>
                <Avatar.Image
                  source={{uri: user2.profileImage || defaultAvatar}}
                  size={width / 3}
                />
              </View>
              <Chip
                compact
                textStyle={{fontSize: 10, color: 'white'}}
                style={{
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  position: 'absolute',
                  width: 65,
                  bottom: '20%',
                  zIndex: 1,
                  right: -45,
                }}>
                Creator
              </Chip>
            </View>
          </View>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{...styles.title, letterSpacing: 0.6}}>{name}</Text>

              {!endsAt && isAllPaymentResolved && isAssigner && (
                <Button
                  uppercase={false}
                  loading={ending}
                  onPress={end}
                  textColor="red">
                  End Contract
                </Button>
              )}
            </View>
            <Text
              style={{
                color: colors.textAfter,
                fontSize: 12,
                marginBottom: 5,
              }}>{`${startDate} - ${endDate}`}</Text>
          </View>

          <View
            style={{
              paddingVertical: 5,
              borderRadius: 30,
              backgroundColor: isEnded ? 'red' : colors.button,
              alignItems: 'center',
              width: 100,
            }}>
            <Text style={{fontSize: 10, color: 'white'}}>
              {isEnded ? 'Ended' : 'Ongoing'}
            </Text>
          </View>
        </View>
        {endsAt && (isAssigner ? reviewForU1 : reviewForU2) && (
          <View style={{marginTop: 20}}>
            <Text style={styles.title}>Rating Received</Text>

            <StarRating
              disabled
              maxStars={5}
              halfStarEnabled
              rating={isAssigner ? ratingForU1 : ratingForU2}
              containerStyle={{width: 80}}
              emptyStarColor={colors.border}
              starSize={25}
              fullStarColor={colors.star}
              halfStarColor={colors.star}
            />
            <Paragraph>{isAssigner ? reviewForU1 : reviewForU2}</Paragraph>
          </View>
        )}

        {endsAt &&
          ((isAssigner ? reviewForU2 : reviewForU1) ? (
            <View style={{marginTop: 20}}>
              <Text style={styles.title}>Rating Given</Text>

              <StarRating
                disabled
                maxStars={5}
                halfStarEnabled
                rating={isAssigner ? ratingForU2 : ratingForU1}
                containerStyle={{width: 80}}
                emptyStarColor={colors.border}
                starSize={25}
                fullStarColor={colors.star}
                halfStarColor={colors.star}
              />
              <Paragraph>{isAssigner ? reviewForU2 : reviewForU1}</Paragraph>
            </View>
          ) : (
            <SubmitButton
              label={`Rate ${isAssigner ? user2.username : user1.username}`}
              onClick={() => setShowRatingModal(true)}
            />
          ))}

        <View style={{marginTop: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>MileStones</Text>
            {!endsAt && isAssigner && (
              <Button
                textColor={colors.primary}
                uppercase={false}
                onPress={() => setShow(true)}>
                + Add Milestone
              </Button>
            )}
          </View>

          {loading ? (
            <Loading />
          ) : (
            <Card style={styles.cardBase}>
              {milestones.map((item, index) => (
                <MileStoneCard
                  key={index}
                  index={index}
                  isAssigner={isAssigner}
                  milestone={item}
                  contract={agreementContract}
                  getMilestone={getAllMilestones}
                  setShow={setShow}
                  contractAddr={contractAddress}
                  feeRate={feeRate}
                />
              ))}
              {/* <FlatList
                data={milestones}
                keyExtractor={(x, i) => x[0]}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: 2,
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
                ListEmptyComponent={() => <ListEmpty />}
                renderItem={({item, index}) => (
                  <MileStoneCard
                  //key={index}
                    index={index + 1}
                    isAssigner={isAssigner}
                    milestone={item}
                    contract={agreementContract}
                    getMilestone={getAllMilestones}
                    setShow={setShow}
                    contractAddr={contractAddress}
                    feeRate={feeRate}
                  />
                )}
              /> */}
            </Card>
          )}
        </View>
        {/* {isAssigner && !isEnded && (
          <FAB
            icon="plus"
            color="white"
            //disabled={!hasChangedInfo()}
            style={{
              height: 50,
              width: 50,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary,
            }}
            onPress={() => setShow(true)}
          />
        )} */}
      </ScrollView>
      <MilestoneModal
        show={show}
        setShow={setShow}
        addr={contractAddress}
        contract={agreementContract}
        feeRate={feeRate}
      />
      <RatingModal
        agreement={agreement}
        show={showRatingModal}
        setShow={setShowRatingModal}
        isAssigner={isAssigner}
        oppositeParty={isAssigner ? user2 : user1}
        setAgreement={setAgreement}
      />
    </KeyboardAvoidingView>
  );
};

export default AgreementDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
  cardBase: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 10,
  },
});
