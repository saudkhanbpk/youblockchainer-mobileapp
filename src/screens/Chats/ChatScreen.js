import React, {useContext, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Header from '../../components/Header';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {useTheme} from 'react-native-paper';
import {useWebSockets} from '../../utils/useWebSocket';
import ChatComposer from '../../components/ChatComposer';
import ImageLoader from '../../components/ImageLoader';
import {width} from '../../Constants';
import ZoomImage from '../../components/ZoomImage';
import {GlobalContext} from '../../auth/GlobalProvider';
import {uploadImage} from '../../utils/userAPI';

const ChatScreen = ({route}) => {
  const {colors} = useTheme();
  const {room, isGroup = false} = route.params;
  const {user} = useContext(GlobalContext);
  const [text, setText] = useState('');
  const [selected, setSelected] = useState('');
  const [show, setShow] = useState(false);
  const {messages, send} = useWebSockets({
    roomId: room._id,
    enabled: room ? true : false,
    sender: user._id,
  });

  const usingP2 = isGroup ? null : room.p1._id === user._id ? true : false;

  // const onSend = useCallback((messages = []) => {
  //   send('Text', messages);
  // }, []);

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: colors.backgroundLight,
            marginVertical: 5,
            borderRadius: 5,
          },
          left: {
            backgroundColor: colors.backgroundLight,
            borderRadius: 5,
          },
        }}
        textStyle={{
          right: {
            color: colors.text,
            fontFamily: 'Poppins-Regular',

            fontSize: 12,
          },
          left: {
            color: colors.textAfter,
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
          },
        }}
      />
    );
  };

  const renderInputToolbar = props => {
    return (
      <ChatComposer
        value={text}
        onChangeText={setText}
        onSend={() => {
          send('Text', text);
          setText('');
        }}
        onImagePress={async () => {
          let uri = await uploadImage();
          if (!uri) return;
          send('Image', uri);
        }}
        props={props}
      />
    );
  };

  const renderImage = props => {
    return (
      <Pressable
        onPress={() => {
          setSelected(props.currentMessage.image);
          setShow(true);
        }}>
        <ImageLoader
          uri={props.currentMessage.image}
          style={{width: width / 2.2, height: 150}}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={isGroup ? room.name : usingP2 ? room.p2.name : room.p1.name}
      />
      <GiftedChat
        messages={messages}
        renderMessageImage={renderImage}
        //onSend={messages => onSend(messages)}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        //placeholder="Type your message here..."
        //renderInputToolbar={renderInputToolbar}
        renderComposer={renderInputToolbar}
        user={{
          _id: user._id,
          name: user.name,
          avatar: user.profileImages[0],
        }}
        renderBubble={renderBubble}
        multiline={true}
      />
      <ZoomImage images={[selected]} show={show} setShow={setShow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    height: 200,
    width: 300,
  },
});

export default ChatScreen;
