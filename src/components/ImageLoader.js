import React, {useEffect, useState} from 'react';
import {View, Image, ImageBackground} from 'react-native';
import FastImage from 'react-native-fast-image';

const ImageLoader = ({uri, style, borderRadius}) => {
  const [loading, setLoading] = useState(false);
  const [resize, setResize] = useState(FastImage.resizeMode.center);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        if (width > height) setResize(FastImage.resizeMode.cover);
        setWait(false);
      },
      console.log,
    );
  }, []);

  const Loader = () => {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          borderRadius,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/img/loader.gif')}
          borderRadius={0}
          style={{
            width: '50%',
            height: '50%',
            zIndex: 10,
            position: 'absolute',
          }}
        />
      </View>
    );
  };

  return wait ? (
    <View style={style}>
      <Loader />
    </View>
  ) : (
    <View style={{...style, overflow: 'hidden'}}>
      {loading && <Loader />}

      <ImageBackground
        style={{
          width: '100%',
          height: '100%',
        }}
        imageStyle={{borderRadius}}
        source={{uri}}
        blurRadius={40}
        resizeMode="cover">
        <FastImage
          style={{
            width: '100%',
            height: '100%',
            //backgroundColor: ,
            borderRadius,
          }}
          source={{uri}}
          resizeMode={resize}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </ImageBackground>
      {/* <View
        style={{
          borderRadius,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri}}
          resizeMethod="resize"
          resizeMode={resize}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={{width: '100%', height: '100%', borderRadius}}
        />
      </View> */}
    </View>
  );
};

export default ImageLoader;
