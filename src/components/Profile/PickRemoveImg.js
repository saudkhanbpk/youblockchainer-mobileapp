import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {pickPhoto} from '../../utils/helper';

const PickRemoveImg = ({img, setImg, size, borderRadius}) => {
  const {colors} = useTheme();
  const pickDeleteImg = async () => {
    if (img.uri) return setImg({uri: ''});
    setImg(await pickPhoto());
  };
  return (
    <TouchableOpacity
      style={{
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius,
      }}
      onPress={pickDeleteImg}>
      <View
        style={{
          ...StyleSheet.absoluteFill,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius,
        }}>
        <MaterialCommunityIcons
          name={img.uri ? 'delete' : 'folder-multiple-image'}
          style={{
            fontSize: size,
            fontWeight: 'bold',
            color: colors.textAfter,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default PickRemoveImg;
