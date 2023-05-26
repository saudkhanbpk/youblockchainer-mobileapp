import React, {useContext, useEffect, useState} from 'react';
import {useTheme, Card, Title, Modal, Text} from 'react-native-paper';
import {Image, ScrollView, StyleSheet, ToastAndroid, View} from 'react-native';
import {GlobalContext} from '../auth/GlobalProvider';
import InputField from './Profile/InputField';
import SubmitButton from './SubmitButton';
import PickRemoveImg from './Profile/PickRemoveImg';
import {height, width} from '../Constants';
import {createBrand, updateBrand} from '../utils/brandAPI';
import {uploadPics} from '../utils/userAPI';
import TagInput from 'react-native-tag-input';

const BrandModal = ({show, setShow, isEditing, profile, setProfile}) => {
  const {colors} = useTheme();
  const [name, setName] = useState(isEditing ? profile.name : '');
  const [nickname, setNickname] = useState(isEditing ? profile.nickname : '');
  const [skills, setSkills] = useState(isEditing ? profile.skills || [] : []);
  const [img, setImg] = useState({uri: isEditing ? profile.img : ''});
  const [secondaryImg, setSecondaryImg] = useState({
    uri: isEditing ? profile.secondaryImg : '',
  });
  const [description, setDescription] = useState(
    isEditing ? profile.description : '',
  );
  const [text, setText] = useState('');
  const [setting, setSetting] = useState(false);
  const {user} = useContext(GlobalContext);

  useEffect(() => {
    if (isEditing) {
      setName(profile.name);
      setNickname(profile.nickname);
      setImg({uri: profile.img});
      setSecondaryImg({uri: profile.secondaryImg});
      setDescription(profile.description);
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const clicker = async () => {
    if (img.uri.length === 0 || name.length === 0) {
      return alert('Name and Image field cannot be empty');
    }
    setSetting(true);
    try {
      if (isEditing) {
        await updateBrand(
          profile._id,
          {
            name,
            description,
            nickname,
            skills,
            isVerified: false,
            //manager: user._id,
            img:
              profile.img === img.uri ? img.uri : (await uploadPics([img]))[0],
            secondaryImg:
              profile.secondaryImg === secondaryImg.uri
                ? secondaryImg.uri
                : (
                    await uploadPics([secondaryImg])
                  )[0],
          },
          setProfile,
        );
        ToastAndroid.show('Brand updated successfully 🎉', ToastAndroid.SHORT);
        setSetting(false);
        return setShow(false);
      }
      await createBrand(
        {
          name,
          description,
          nickname,
          skills,
          manager: user._id,
          img: (await uploadPics([img]))[0],
          secondaryImg: secondaryImg
            ? (
                await uploadPics([secondaryImg])
              )[0]
            : '',
        },
        setProfile,
      );
      ToastAndroid.show('Brand created successfully 🎉', ToastAndroid.SHORT);
      setShow(false);
    } catch (error) {
      console.log(error);
    }
    setSetting(false);
  };

  const onSubmit = inp => {
    setSkills(s => [...s, inp]);
    setText('');
  };

  return (
    <Modal visible={show} onDismiss={() => (isEditing ? setShow(false) : {})}>
      <View style={styles.modal}>
        <Card style={styles.card}>
          <Title style={{fontWeight: 'bold', marginTop: -5, marginBottom: 15}}>
            Enter Brand Details
          </Title>
          <ScrollView>
            <Text>Profile Image*</Text>
            <View
              style={{
                width: width / 1.2,
                height: width / 1.2,
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri:
                    img.uri ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY905Whql2OlCP7n_BHy15sgioGA-U3EOsrw&usqp=CAU',
                }}
                resizeMode="center"
                style={{
                  width: width / 1.2,
                  height: width / 1.2,
                  //borderRadius: width,
                }}
              />
              <PickRemoveImg img={img} setImg={setImg} size={20} />
            </View>
            <Text>Backdrop Img</Text>
            <View
              style={{width: '100%', height: height * 0.1, marginBottom: 20}}>
              <Image
                source={{
                  uri:
                    secondaryImg.uri ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY905Whql2OlCP7n_BHy15sgioGA-U3EOsrw&usqp=CAU',
                }}
                style={{flex: 1}}
              />
              <PickRemoveImg
                img={secondaryImg}
                setImg={setSecondaryImg}
                size={20}
              />
            </View>
            <InputField text={name} setText={setName} label={'Brand Name*'} />
            <InputField
              text={nickname}
              setText={setNickname}
              label={'Brand Abbrevation'}
            />
            <InputField
              label={'Description'}
              text={description}
              setText={setDescription}
              style={{textAlignVertical: 'top', height: 100}}
              props={{multiline: true}}
              placeholder={
                'describe offer details or give redeem instructions...'
              }
            />
            <View
              style={{
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 5,
                marginHorizontal: 10,
                marginBottom: 15,
                marginLeft: 15,
                paddingLeft: 20,
              }}>
              <TagInput
                value={skills}
                onChange={setSkills}
                labelExtractor={skill => skill}
                tagTextStyle={{fontSize: 12}}
                tagColor={colors.primary}
                tagTextColor={'white'}
                inputColor={colors.text}
                tagContainerStyle={{height: 32}}
                inputProps={{
                  placeholderTextColor: colors.textAfter,
                  placeholder: '+ Add Work Topic Areas',
                  onSubmitEditing: e => onSubmit(text),
                  style: {
                    height: 32,
                    minWidth: 150,
                    marginTop: 6,
                    fontSize: 12,
                    color: colors.text,
                    padding: 0,
                    margin: 0,
                    borderWidth: 0,
                  },
                }}
                onChangeText={setText}
                text={text}
              />
            </View>
            <SubmitButton label={'Done'} loading={setting} onClick={clicker} />
            <Text style={{marginTop: 5, fontSize: 10, color: colors.disabled}}>
              *Note:{' '}
              {isEditing
                ? 'You will loose your verification mark when you update brand details'
                : 'Wallet address will be same as the wallet address with which you are connected'}
            </Text>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '80%',
    height: '92%',
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
  card: {padding: 20, borderRadius: 10, flex: 1},
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
export default BrandModal;
