import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import RoomCard from '../../components/Chat/RoomCard';
import Header from '../../components/Header';
import {getAllRooms} from '../../utils/chatAPI';
import Loading from '../../components/Loading';
import {Subheading, useTheme} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import ListEmpty from '../../components/ListEmpty';

const RoomsScreen = ({navigation}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(GlobalContext);

  const getRooms = async () => {
    setLoading(true);
    setRooms(await getAllRooms());
    setLoading(false);
  };
  useEffect(() => {
    getRooms();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <View>
          <FlatList
            data={rooms}
            keyExtractor={(x, i) => i.toString()}
            style={{paddingHorizontal: 20}}
            ListEmptyComponent={() => <ListEmpty />}
            ListHeaderComponent={() => (
              <Subheading style={{letterSpacing: 2, fontSize: 18}}>
                Personal Chats
              </Subheading>
            )}
            renderItem={({item}) => {
              let usingP2 = item.p1._id === user._id ? true : false;
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Chat', {room: item})}>
                  <RoomCard
                    name={usingP2 ? item.p2.name : item.p1.name}
                    image={
                      usingP2
                        ? item.p2.profileImages[0]
                        : item.p1.profileImages[0]
                    }
                    description={
                      usingP2 ? item.p2.description : item.p1.description
                    }
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RoomsScreen;
