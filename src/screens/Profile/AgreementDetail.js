import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GlobalContext} from '../../auth/GlobalProvider';
import {dateFormating} from '../../utils/helper';
import {Avatar, Card, Chip, FAB, Text, useTheme} from 'react-native-paper';
import {defaultAvatar, width} from '../../Constants';
import Agreement from '../../abis/Agreement.json';
import MilestoneModal from '../../components/Agreements/MilestoneModal';
import {FlatList} from 'react-native-gesture-handler';
import MileStoneCard from '../../components/Agreements/MileStoneCard';
import ListEmpty from '../../components/ListEmpty';
import Loading from '../../components/Loading';

const AgreementDetail = ({route}) => {
  const {agreement} = route.params;
  const {user, web3, executeMetaTx, mainContract} = useContext(GlobalContext);
  const {
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
  } = agreement;
  const isEnded = !!endsAt;
  const isAssigner = user1._id === user._id;
  const {colors} = useTheme();
  const startDate = dateFormating(startsAt);
  const endDate = isEnded ? dateFormating(endsAt) : 'present';
  const [agreementContract, setAgreementContract] = useState(null);
  const [feeRate, setFeeRate] = useState(0);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setAgreementContract(new web3.eth.Contract(Agreement, contractAddress));
  }, []);

  const getAllMilestones = async () => {
    setLoading(true);
    try {
      let fee = await mainContract.methods.marketFee().call();
      setFeeRate(fee);
      let res = await agreementContract.methods.getAllMilestones().call();
      let reqs = await agreementContract.methods.getAllRefundRequests().call();

      // console.log(res);
      setMilestones(
        res
          .filter(i => i[0] !== '0')
          .map(i => [...i, reqs.filter(j => j[1] === i[0])]),
      );
    } catch (error) {
      console.log('Error in getting mileStones:- ', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (agreementContract) getAllMilestones();
  }, [agreementContract, show]);

  return (
    <View style={styles.container}>
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
          <Text style={{...styles.title, letterSpacing: 0.6}}>{name}</Text>
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

      <View style={{marginTop: 20}}>
        <Text style={styles.title}>MileStones</Text>
        {loading ? (
          <Loading />
        ) : (
          <Card style={styles.cardBase}>
            <FlatList
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
            />
          </Card>
        )}
      </View>
      {isAssigner && !isEnded && (
        <FAB
          icon="plus"
          color="white"
          //disabled={!hasChangedInfo()}
          style={{...styles.fab, backgroundColor: colors.primary}}
          onPress={() => setShow(true)}
        />
      )}
      <MilestoneModal
        show={show}
        setShow={setShow}
        addr={contractAddress}
        contract={agreementContract}
        feeRate={feeRate}
      />
    </View>
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
    bottom: 0,
  },
  cardBase: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 10,
  },
});
