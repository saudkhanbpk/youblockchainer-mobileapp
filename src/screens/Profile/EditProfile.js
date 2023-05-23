import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Avatar,
  Text,
  useTheme,
  TextInput,
  FAB,
  Switch,
  Tooltip,
  IconButton,
} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import InputField from '../../components/Profile/InputField';
import {height, width} from '../../Constants';
import Entypo from 'react-native-vector-icons/Entypo';
import PickRemoveImg from '../../components/Profile/PickRemoveImg';
import {updateUser, uploadPics} from '../../utils/userAPI';
import SubmitButton from '../../components/SubmitButton';
import Header from '../../components/Header';
import TagInput from 'react-native-tag-input';

const EditProfile = ({navigation}) => {
  const {user, setUser} = useContext(GlobalContext);
  const {colors} = useTheme();
  const [updating, setUpdating] = useState(false);
  const [username, setUserName] = useState(user.username);
  const [email, setEmail] = useState(user.email || '');
  const [text, setText] = useState('');
  const [bio, setBio] = useState(user.bio || '');
  const [descriptorTitle, setDescriptorTitle] = useState(
    user.descriptorTitle || '',
  );
  const [isExpert, setIsExpert] = useState(user.isExpert);
  const [profileImage, setProfileImage] = useState({uri: user.profileImage});
  const [profileBanner, setProfileBanner] = useState({uri: user.profileBanner});
  const [skills, setSkills] = useState(user.skills || []);
  const [socialHandles, setSocialHandles] = useState([
    {
      name: 'instagram',
      link: '',
    },
    {
      name: 'twitter',
      link: '',
    },
    {
      name: 'facebook',
      link: '',
    },
  ]);

  const socialMedia = ['facebook', 'twitter', 'instagram'];

  const hasChangedInfo = () => {
    if (
      profileBanner.uri !== user.profileBanner ||
      profileImage.uri !== user.profileImage ||
      username !== user.username ||
      email !== user.email ||
      bio !== user.bio ||
      descriptorTitle !== user.descriptorTitle ||
      isExpert !== user.isExpert ||
      JSON.stringify(socialHandles) !== JSON.stringify(user.socialHandles)
    ) {
      return true;
    }

    return false;
  };
  const onSave = async () => {
    setUpdating(true);
    try {
      let changedBanner = false,
        changedImg = false;

      if (profileBanner.uri !== user.profileBanner) {
        changedBanner = true;
      }
      if (profileImage.uri !== user.profileImage) {
        changedImg = true;
      }
      let profimg = [user.profileImage],
        profban = [user.profileBanner];
      if (changedBanner) {
        if (profileBanner.uri) profban = await uploadPics([profileBanner]);
        else profban = [''];
      }
      if (changedImg) {
        if (profileImage.uri) profimg = await uploadPics([profileImage]);
        else profimg = [''];
      }

      await updateUser(
        user._id,
        {
          username,
          email,
          bio,
          socialHandles,
          isExpert,
          descriptorTitle,
          skills,
          profileBanner: profban[0],
          profileImage: profimg[0],
        },
        setUser,
      );
    } catch (error) {
      console.log(error);
    }
    setUpdating(false);
  };

  useEffect(() => {
    for (let i in socialMedia) {
      const item = user.socialHandles.find(j => j.name === socialMedia[i]);
      if (item)
        setSocialHandles(s => {
          s.find(it => it.name === socialMedia[i]).link = item.link;
          return [...s];
        });
    }
  }, []);

  const onSubmit = inp => {
    setSkills(s => [...s, inp]);
    setText('');
    // setText(inp);

    // const lastTyped = inp.charAt(inp.length - 1);
    // const parseWhen = [',', ' ', ';', '\n'];

    // if (parseWhen.indexOf(lastTyped) > -1) {
    //   setSkills(s => [...s, text]);
    //   setText('');
    // }
  };

  useEffect(() => {
    console.log(skills);
  }, [skills]);

  return (
    <View style={styles.container}>
      <Header title={'Edit Profile'} />
      <ScrollView>
        <View style={{width: '100%', height: height * 0.2}}>
          <View style={{width: '100%', height: '80%'}}>
            <Image
              source={{
                uri:
                  profileBanner.uri ||
                  'https://images.unsplash.com/photo-1600456899121-68eda5705257?ixlib=rb-1.2.1&w=1080&fit=max&q=80&fm=jpg&crop=entropy&cs=tinysrgb',
              }}
              style={{flex: 1}}
            />
            <PickRemoveImg
              img={profileBanner}
              setImg={setProfileBanner}
              size={30}
            />
          </View>
          <View style={styles.border}>
            <Avatar.Image source={{uri: profileImage.uri}} size={width / 7} />
            <PickRemoveImg
              img={profileImage}
              setImg={setProfileImage}
              borderRadius={100}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            //backgroundColor: 'white',
            alignItems: 'center',
            // padding: 10,
            marginHorizontal: 15,
            borderRadius: 5,
            justifyContent: 'space-around',
            marginVertical: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>
              Are you an Expert ?
            </Text>
          </View>
          <Switch value={isExpert} onChange={() => setIsExpert(e => !e)} />
        </View>
        <InputField label={'Name'} text={username} setText={setUserName} />
        <InputField label={'Email'} text={email} setText={setEmail} />
        <InputField
          label={'Descriptor Text'}
          text={descriptorTitle}
          setText={setDescriptorTitle}
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
              placeholder: '+ Add Skills',
              onSubmitEditing: e => onSubmit(text),
              style: {
                height: 32,
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
        <InputField
          label={'Bio'}
          text={bio}
          setText={setBio}
          style={{marginTop: 15, textAlignVertical: 'top', height: 100}}
          props={{multiline: true}}
          placeholder={'Tell us something about yourself...'}
        />

        <View style={{marginHorizontal: 10, marginBottom: 60}}>
          {socialHandles.map((item, index) => (
            <View key={index} style={styles.socialSection}>
              <Entypo name={item.name} size={26} color={colors.text} />
              <TextInput
                mode="outlined"
                activeOutlineColor={colors.primary}
                outlineColor={'white'}
                value={item.link}
                label={`${item.name} id`}
                placeholderTextColor={colors.disabled}
                onChangeText={t =>
                  setSocialHandles(s => {
                    s.find(i => i.name === item.name).link = t;
                    return [...s];
                  })
                }
                style={{
                  ...styles.input,

                  color: colors.text,
                }}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="floppy"
        color="white"
        disabled={!hasChangedInfo()}
        style={{...styles.fab, backgroundColor: colors.primary}}
        loading={updating}
        onPress={onSave}
      />
      {/* <SubmitButton
        label={'Save Changes'}
        style={{marginBottom: 10}}
        loading={updating}
        onClick={onSave}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  border: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'black',
    left: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    borderRadius: 100,
  },
  input: {
    height: 40,
    marginLeft: 10,
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 10,
    fontSize: 12,
    width: width / 1.18,
    backgroundColor: 'white',
  },
  socialSection: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default EditProfile;
