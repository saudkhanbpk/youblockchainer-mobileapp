import React from 'react';
import {useTheme, Card, Title, Modal, Button} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import VideoComponent from '../VideoPlayer/VideoComponent';
import {width} from '../../Constants';

const MetamaskIntroModal = ({show, setShow}) => {
  const {colors} = useTheme();
  return (
    <Modal visible={show} onDismiss={() => setShow(false)}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <Title
            style={{
              fontWeight: 'bold',
              marginTop: -5,
              marginBottom: 15,
              textAlign: 'center',
            }}>
            Introduction to Metamask
          </Title>

          <VideoComponent
            uri={'http://techslides.com/demos/sample-videos/small.mp4'}
            style={{width: '100%', height: '80%'}}
            noControls={true}
            autoPlay={true}
            onEndVideo={() => setShow(false)}
          />

          <Button
            uppercase={false}
            textColor={colors.primary}
            onPress={() => setShow(false)}
            style={{marginTop: '-5%'}}>
            Close
          </Button>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: width / 1.1,
    height: width / 1.22,
    alignSelf: 'center',
  },
  activedot: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  card: {padding: 20, borderRadius: 10, flex: 1, color: 'white'},
  linearGradient1: {
    padding: 5,
    width: 60,
    marginHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  reasonInput: {
    height: 40,
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    height: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    alignSelf: 'flex-end',
  },
});
export default MetamaskIntroModal;
