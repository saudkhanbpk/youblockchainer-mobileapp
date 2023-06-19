import React, {useEffect, useState} from 'react';
import {View, Image, ImageBackground, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';

const ImageLoader = ({
  uri = 'https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg',
  style,
  borderRadius,
}) => {
  const [loading, setLoading] = useState(false);
  const [resize, setResize] = useState(
    FastImage.resizeMode[Platform.OS === 'ios' ? 'cover' : 'center'],
  );
  const [wait, setWait] = useState(true);

  useEffect(() => {
    if (!!uri)
      Image.getSize(
        uri,
        (width, height) => {
          if (width > height)
            setResize(
              FastImage.resizeMode[Platform.OS === 'ios' ? 'center' : 'cover'],
            );
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

  console.log(resize, uri);

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
        //blurRadius={40}
        resizeMode="cover">
        <FastImage
          style={{
            width: '100%',
            height: '100%',
            //backgroundColor: ,
            borderRadius,
          }}
          source={{
            uri,
          }}
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
