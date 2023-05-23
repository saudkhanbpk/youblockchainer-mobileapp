import {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {GlobalContext} from '../auth/GlobalProvider';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {updateUser} from './userAPI';
import {validateEmail} from './helper';

const useTabInitializer = props => {
  const connector = useWalletConnect();
  const [showMail, setShowMail] = useState(false);
  const {getCreateUser, user, setUser, loading, initializeWeb3, web3} =
    useContext(GlobalContext);

  const getUser = async () => {
    if (connector.connected) {
      if (connector.accounts[0] === undefined) return;
      await getCreateUser(connector.accounts[0]);
    }
  };

  useEffect(() => {
    if (connector.connected && web3 === null) {
      initializeWeb3();
    }
    if (user === null) getUser();
  }, [connector]);

  useEffect(() => {
    if (user) {
      if (!user.email) setShowMail(true);
    }
  }, [user]);

  const updateEmail = async (email, callback) => {
    if (validateEmail(email)) {
      await updateUser(user._id, {email}, setUser);
      callback();
    }
  };
  return {loading, updateEmail, showMail, setShowMail};
};

export default useTabInitializer;

const styles = StyleSheet.create({
  container: {},
});
