import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Header from '../../components/Header';
import {GiftedChat, Bubble, Time} from 'react-native-gifted-chat';
import {useTheme} from 'react-native-paper';
import {useWebSockets} from '../../utils/useWebSocket';
import ChatComposer from '../../components/ChatComposer';
import ImageLoader from '../../components/ImageLoader';
import {defaultAvatar, width} from '../../Constants';
import ZoomImage from '../../components/ZoomImage';
import {GlobalContext} from '../../auth/GlobalProvider';
import {uploadImage} from '../../utils/userAPI';
import ChatHeader from '../../components/Chat/ChatHeader';
import {useMemo} from 'react';

const ChatScreen = ({route}) => {
  const {colors} = useTheme();
  const {room, isGroup = false} = route.params;
  const {user, setShowAgreement} = useContext(GlobalContext);
  const [selected, setSelected] = useState('');
  const [show, setShow] = useState(false);
  const {messages, send, status} = useWebSockets({
    roomId: room._id,
    enabled: room ? true : false,
    sender: user._id,
  });

  const userIsP1 = useMemo(() => user._id === room.p1._id, [user, room]);

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
            marginVertical: 5,
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

  const renderTime = props => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: '#3c3c434d',
            fontSize: 10,
            fontFamily: 'Poppins-Regular',
            textAlign: 'right', // or position: 'right'
          },
          right: {
            color: '#3c3c434d',
            fontSize: 10,
            fontFamily: 'Poppins-Regular',
          },
        }}
      />
    );
  };

  const renderInputToolbar = props => {
    const [text, setText] = useState('');
    return (
      <ChatComposer
        value={text}
        onChangeText={setText}
        onSend={() => {
          send('Text', text);
          setText('');
        }}
        // onImagePress={async () => {
        //   let uri = await uploadImage();
        //   if (!uri) return;
        //   send('Image', uri);
        // }}
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
      <ChatHeader
        user={userIsP1 ? room.p2 : room.p1}
        onHire={() => setShowAgreement(userIsP1 ? room.p2 : room.p1)}
      />
      <GiftedChat
        messages={messages}
        renderMessageImage={renderImage}
        renderTime={renderTime}
        //onSend={messages => onSend(messages)}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        //placeholder="Type your message here..."
        //renderInputToolbar={renderInputToolbar}
        renderComposer={renderInputToolbar}
        user={{
          _id: user._id,
          name: user.name,
          avatar: user.profileImage || defaultAvatar,
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
