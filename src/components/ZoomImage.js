import React from 'react';
import {StyleSheet, Modal, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import ImageViewer from 'react-native-image-zoom-viewer';

const ZoomImage = ({images, show, setShow}) => {
  return (
    <Modal
      visible={show}
      animationType={'slide'}
      transparent={true}
      onRequestClose={() => setShow(false)}
      style={{opacity: 0.6}}>
      <ImageViewer
        onCancel={() => setShow(false)}
        useNativeDriver
        enablePreload
        onSwipeDown={() => setShow(false)}
        backgroundColor="rgba(52, 52, 52, 0.8)"
        // renderArrowLeft={() => <Entypo name="chevron-thin-left" size={30} />}
        // renderArrowRight={() => <Entypo name="chevron-thin-right" size={30} />}
        renderHeader={() => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShow(false)}>
            <Entypo name="cross" color={'black'} size={20} />
          </TouchableOpacity>
        )}
        imageUrls={images.map(i => {
          return {url: i};
        })}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    height: 20,
    width: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    // position: 'absolute',
    zIndex: 10,
    top: 10,
    right: 10,
  },
});

export default ZoomImage;
