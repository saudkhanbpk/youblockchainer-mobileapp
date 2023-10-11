import React, {useContext, useEffect, useState} from 'react';
import {
  useTheme,
  Card,
  Title,
  Modal,
  ActivityIndicator,
} from 'react-native-paper';
import {StyleSheet, View, FlatList} from 'react-native';
import {GlobalContext} from '../../auth/GlobalProvider';
import {getScriptPackages} from '../../utils/chatAPI';
import PlanCard from './PlanCard';

const BuyScriptModal = ({show, setShow, getBalance}) => {
  const {colors} = useTheme();
  const {mainContract, web3} = useContext(GlobalContext);
  const [pkgs, setPkgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPackages = async () => {
    setLoading(true);
    try {
      setPkgs(await getScriptPackages(mainContract));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPackages();
  }, [web3, mainContract]);

  return (
    <Modal visible={show} onDismiss={() => setShow(false)}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <Title style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
            Subscription packages
          </Title>
          {loading ? (
            <ActivityIndicator size={'small'} />
          ) : (
            <FlatList
              data={pkgs}
              keyExtractor={(x, i) => i.toString()}
              horizontal
              renderItem={({item, index}) => (
                <PlanCard data={item} index={index} getBalance={getBalance} />
              )}
            />
          )}
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '80%',
    height: 300,
    alignSelf: 'center',
  },

  card: {
    padding: 20,
    borderRadius: 10,
    flex: 1,
  },
  reasonInput: {
    height: 40,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    fontSize: 12,
    marginBottom: 10,
  },
});
export default BuyScriptModal;
