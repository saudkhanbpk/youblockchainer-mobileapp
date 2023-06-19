import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import NameCard from '../../components/Experts/NameCard';
import BioCard from '../../components/Experts/BioCard';
import SkillCard from '../../components/Experts/SkillCard';
import PastAgreementCard from '../../components/Experts/PastAgreementCard';
import {createRoom} from '../../utils/chatAPI';
import {useContext} from 'react';
import {GlobalContext} from '../../auth/GlobalProvider';
import {useState} from 'react';
import {getMyAgreements} from '../../utils/userAPI';
import {useEffect} from 'react';
import Loading from '../../components/Loading';
import ListEmpty from '../../components/ListEmpty';
import AgreementCard from '../../components/Profile/AgreementCard';
import IntroVideoCard from '../../components/Experts/IntroVideoCard';
import Header from '../../components/Header';

const ExpertDetail = ({route, navigation}) => {
  const {profile} = route.params;
  const {colors} = useTheme();
  const {user, setShowAgreement, showAgreement} = useContext(GlobalContext);
  const [myAgreements, setMyAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const myAgreements = [
  //     {
  //       name: 'Need a thriller movie writer',
  //       user1: {
  //         username: 'John Cena',
  //         profileImage:
  //           'https://www.shutterstock.com/image-photo/casually-handsome-confident-young-man-260nw-439433326.jpg',
  //       },
  //       reviewForU2: 'did a great job. 10/10 would highly recommend',
  //       ratingForU2: 4.7,
  //     },
  //     {
  //       name: 'Need a thriller movie writer',
  //       user1: {
  //         username: 'John Cena',
  //         profileImage:
  //           'https://www.shutterstock.com/image-photo/casually-handsome-confident-young-man-260nw-439433326.jpg',
  //       },
  //       reviewForU2: 'did a great job. 10/10 would highly recommend',
  //       ratingForU2: 4.7,
  //     },
  //   ];

  const getAgreements = async () => {
    setLoading(true);
    let res = await getMyAgreements(profile._id);
    setMyAgreements(
      res.sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt)),
      // res.filter(i => i.user2._id === user._id && !!i.endsAt)
    );
    setLoading(false);
  };

  useEffect(() => {
    getAgreements();
  }, [showAgreement]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAgreements();
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header title={'Expert'} />
      <NameCard
        profile={profile}
        onHire={() => setShowAgreement(profile)}
        onConnect={async () =>
          navigation.navigate('Chat', {room: await createRoom(profile._id)})
        }
        baseStyle={styles.cardBase}
      />
      <BioCard profile={profile} baseStyle={styles.cardBase} />
      {!!profile.skills.length && (
        <SkillCard profile={profile} baseStyle={styles.cardBase} />
      )}
      {profile.videoVisibility && (
        <IntroVideoCard profile={profile} baseStyle={styles.cardBase} />
      )}
      <View style={{marginTop: 10}}>
        <Text style={{...styles.title, color: colors.accent}}>
          All Agreements
        </Text>
      </View>
      {loading ? (
        <Loading />
      ) : !!myAgreements.length ? (
        myAgreements.map((agreement, index) =>
          !!agreement.endsAt ? (
            <PastAgreementCard
              key={index}
              agreement={agreement}
              baseStyle={styles.cardBase}
            />
          ) : (
            <AgreementCard
              key={index}
              agreement={agreement}
              baseStyle={styles.cardBase}
            />
          ),
        )
      ) : (
        <ListEmpty />
      )}
      <View style={{height: 50}} />
    </ScrollView>
  );
};

export default ExpertDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardBase: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
});
