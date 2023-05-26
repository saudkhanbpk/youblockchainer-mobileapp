import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Avatar, Text} from 'react-native-paper';
import Loading from '../../components/Loading';
import ListEmpty from '../../components/ListEmpty';
import {getMyAgreements} from '../../utils/userAPI';
import Dashboard from '../../components/Entities/Dashboard';
import PastAgreementCard from '../../components/Experts/PastAgreementCard';
import {defaultAvatar, width} from '../../Constants';
import BrandModal from '../../components/BrandModal';
import {createRoom} from '../../utils/chatAPI';
import {GlobalContext} from '../../auth/GlobalProvider';
import AgreementCard from '../../components/Profile/AgreementCard';

const EntityDetail = ({route, navigation}) => {
  const {profile} = route.params;
  //const {colors} = useTheme();
  const {setShowAgreement} = useContext(GlobalContext);
  //const [showBrand, setShowBrand] = useState(false);
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
    let res = await getMyAgreements(profile.manager._id);
    setMyAgreements(
      res,
      // res.filter(i => i.user1._id === profile.manager._id && !!i.endsAt),
    );
    setLoading(false);
  };

  useEffect(() => {
    getAgreements();
  }, [profile]);

  return (
    <ScrollView style={styles.container}>
      <View style={{width: '100%', height: width / 2.4}}>
        <Image
          source={{
            uri:
              profile.secondaryImg ||
              'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png',
          }}
          style={{width: '100%', height: '80%'}}
        />
        <View style={styles.border}>
          <Avatar.Image
            source={{uri: profile.img || defaultAvatar}}
            size={width / 8}
          />
        </View>
      </View>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <Dashboard
          profile={profile}
          onHire={() => setShowAgreement(profile)}
          onConnect={async () =>
            navigation.navigate('Chats', {
              screen: 'Chat',
              params: {room: await createRoom(profile.manager._id)},
            })
          }
        />
        <View style={{marginTop: 15}}>
          <Text style={styles.title}>Past Agreements</Text>

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
        </View>
      </View>
      <View style={{height: 150}} />
      {/* <BrandModal 
      isEditing={true}
      profile={profile}

      /> */}
    </ScrollView>
  );
};

export default EntityDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  border: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'black',
    left: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    borderRadius: 100,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  cardBase: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 10,
  },
});
