import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import SearchBar from '../../components/Experts/SearchBar';
import Loading from '../../components/Loading';
import {RefreshControl} from 'react-native-gesture-handler';
import {getBrands} from '../../utils/brandAPI';
import EntityCard from '../../components/Entities/EntityCard';

const SearchEntity = ({navigation}) => {
  const [entities, setEntities] = useState([
    {
      name: 'Fox Star Studios',
      skills: ['Action', 'Sci/Fi'],
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5-7yoWbLtoEV8eeBFV8F_RcXkyeFdnLp9FntBHGYP3Q&usqp=CAU&ec=48665701',
    },
  ]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState();
  const [loading, setLoading] = useState(false);

  const search = text => {
    setLoading(true);
    let filteredName = entities.filter(item => {
      return item.name.toLowerCase().match(text.toLowerCase());
    });
    if (!text || text === '') {
      setFiltered(entities);
    } else if (Array.isArray(filteredName)) {
      setFiltered(filteredName);
    }
    setLoading(false);
  };

  const getEntities = async () => {
    setLoading(true);
    await getBrands(setEntities);
    setLoading(false);
  };

  useEffect(() => {
    search(query);
  }, [query, entities]);

  useEffect(() => {
    const listner = navigation.addListener('focus', () => {
      getEntities();
      setQuery('');
    });

    return listner;
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        placeholder={'Search for Brands/Organizations....'}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={filtered}
          style={{marginTop: 10}}
          refreshControl={
            <RefreshControl onRefresh={getEntities} refreshing={loading} />
          }
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item}) => <EntityCard entity={item} />}
        />
      )}
    </View>
  );
};

export default SearchEntity;

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
