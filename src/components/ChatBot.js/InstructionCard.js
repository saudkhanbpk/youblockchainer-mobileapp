import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Text, useTheme} from 'react-native-paper';

const Instruction = ({text}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 6,
        opacity: 0.4,
      }}>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 15,
          zIndex: 1,
        }}>
        {text}
      </Text>
    </View>
  );
};

const InstructionCard = props => {
  const {colors} = useTheme();
  const texts = [
    'May occasionally generate incorrect information',
    'May occasionally produce harmful instructions or biased content',
    'Limited knowledge of world and events after 2021',
  ];
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Poppins-ExtraBold',
          color: colors.primary,
        }}>
        MyReelDream
      </Text>
      <View style={{width: '80%', marginTop: '5%'}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins-Bold',
            textAlign: 'center',
          }}>
          Instructions
        </Text>

        <View>
          {texts.map((t, i) => (
            <Instruction key={i} text={t} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default InstructionCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    zIndex: 1,
    marginTop: '10%',
    flexGrow: 0,
  },
});
