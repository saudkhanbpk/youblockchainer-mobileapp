import React, {useContext, useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import Dashboard from '../../components/Profile/Dashboard';
import {Image} from 'react-native';
import {defaultAvatar, height, width} from '../../Constants';
import AgreementCard from '../../components/Profile/AgreementCard';
import {getMyAgreements} from '../../utils/userAPI';
import ListEmpty from '../../components/ListEmpty';
import Loading from '../../components/Loading';
import {getUserAgreementsFromContract} from '../../utils/agreementAPI';
import {mapAgreementAddress} from '../../utils/helper';

const Profile = ({navigation}) => {
  const {user, mainContract} = useContext(GlobalContext);
  const {colors} = useTheme();
  const [myAgreements, setMyAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  // const user = {
  //   _id: 0,
  //   walletAddress: '',
  //   username: 'Vinod Kamra',
  //   descriptorTitle: 'Thriller | Rom-Com | Movies | Drama | StandUps',
  //   bio: 'I am very experienced and hardworking',
  //   email: 'test@mail.com',
  //   profileImage:
  //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTByZEJx5D_e221gD74ONaPTWeAEEssB3y_yIWhD_NHZg&usqp=CAU&ec=48665701', // IPFS string
  //   profileBanner:
  //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfADMpLuDF3tH-D76PvDe5hubp8vUY7lq44wB5IcGVlg&usqp=CAU&ec=48665701', // IPFS string
  //   socialHandles: [
  //     [
  //       {
  //         name: 'instagram',
  //         link: 'https://www.instagram.com/',
  //       },
  //       {
  //         name: 'twitter',
  //         link: 'https://twitter.com/',
  //       },
  //       {
  //         name: 'facebook',
  //         link: 'https://www.facebook.com/',
  //       },
  //     ],
  //   ],
  //   scripts: [
  //     '', // IPFS link to docs
  //   ],
  //   rate: 50,
  //   skills: [
  //     'Movies',
  //     'Stand-Ups',
  //     'Movies',
  //     'Stand-Ups',
  //     'Movies',
  //     'Stand-Ups',
  //   ],
  //   agreements: [0],
  //   isExpert: true,
  //   isVerified: true,
  // };

  // const myAgreements = [
  //   {
  //     name: 'Need a thriller movie writer',
  //     startsAt: new Date(),
  //     endsAt: '31 Dec 1995 00:12:00 GMT',
  //     user1: {
  //       username: 'John Cena',
  //       profileImage:
  //         'https://www.shutterstock.com/image-photo/casually-handsome-confident-young-man-260nw-439433326.jpg',
  //     },
  //     reviewForU2: 'did a great job. 10/10 would highly recommend',
  //     ratingForU2: 4.7,
  //   },
  //   {
  //     name: 'Need a thriller movie writer',
  //     name: 'Need a thriller movie writer',
  //     startsAt: '04 Dec 1995 00:12:00 GMT',
  //     user1: {
  //       username: 'John Cena',
  //       profileImage:
  //         'https://www.shutterstock.com/image-photo/casually-handsome-confident-young-man-260nw-439433326.jpg',
  //     },
  //     reviewForU2: 'did a great job. 10/10 would highly recommend',
  //     ratingForU2: 4.7,
  //   },
  // ];

  const getAgreements = async () => {
    setLoading(true);
    let res = await getMyAgreements(user._id);
    let contractRes = await getUserAgreementsFromContract(
      mainContract,
      user.walletAddress,
    );
    let mapped = mapAgreementAddress(res, contractRes);

    setMyAgreements(mapped);
    setLoading(false);
  };

  useEffect(() => {
    getAgreements();
  }, [mainContract]);

  useEffect(() => {
    const unsubcribe = navigation.addListener('focus', () => {
      getAgreements();
    });
    return unsubcribe;
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={{width: '100%', height: width / 2.4}}>
        <Image
          source={{
            uri:
              user.profileBanner ||
              'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png',
          }}
          style={{width: '100%', height: '80%'}}
        />
        <View style={styles.border}>
          <Avatar.Image
            source={{uri: user.profileImage || defaultAvatar}}
            size={width / 8}
          />
        </View>
      </View>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <Dashboard profile={user} />

        <View style={{marginTop: 15}}>
          <Text style={styles.title}>All Agreements</Text>

          {loading ? (
            <Loading />
          ) : !!myAgreements.length ? (
            myAgreements.map((agreement, index) => (
              <AgreementCard
                key={index}
                agreement={agreement}
                baseStyle={styles.cardBase}
              />
            ))
          ) : (
            <ListEmpty />
          )}
        </View>
      </View>
      <View style={{height: 150}} />
    </ScrollView>
  );
};

export default Profile;

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
