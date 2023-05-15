import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text} from 'react-native-paper';
import SearchBar from '../../components/Experts/SearchBar';
import ExpertCard from '../../components/Experts/ExpertCard';
import Loading from '../../components/Loading';
import {getUsers} from '../../utils/userAPI';

const SearchExpert = props => {
  const [experts, setExperts] = useState([
    // {
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
    // },
    // {
    //   _id: 1,
    //   walletAddress: '',
    //   username: 'Raiyaan Sonde',
    //   bio: 'I am very experienced and hardworking',
    //   descriptorTitle: 'Thriller | Rom-Com | Movies | Drama | StandUps',
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
    // },
    // {
    //   _id: 1,
    //   walletAddress: '',
    //   username: 'Mark Whalberg',
    //   bio: 'I am very experienced and hardworking',
    //   descriptorTitle: 'Thriller | Rom-Com | Movies | Drama | StandUps',
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
    // },
  ]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState();
  const [loading, setLoading] = useState(false);

  const search = text => {
    // await getProducts();

    setLoading(true);
    let filteredName = experts.filter(item => {
      return item.username.toLowerCase().match(text.toLowerCase());
    });
    if (!text || text === '') {
      setFiltered(experts);
    } else if (Array.isArray(filteredName)) {
      setFiltered(filteredName);
    }
    setLoading(false);
  };

  const getExperts = async () => {
    setLoading(true);
    await getUsers(true, setExperts);
    setLoading(false);
  };

  useEffect(() => {
    search(query);
  }, [query]);

  useEffect(() => {
    getExperts();
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        placeholder={'Search for experts....'}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={filtered}
          style={{marginTop: 10}}
          numColumns={2}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item}) => <ExpertCard expert={item} />}
        />
      )}
    </View>
  );
};

export default SearchExpert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
});
