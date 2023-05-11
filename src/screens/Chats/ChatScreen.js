import React, {useContext, useState} from 'react';
import {View, StyleSheet, Pressable, Modal} from 'react-native';
import Header from '../../components/Header';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import {useTheme} from 'react-native-paper';
import {AuthContext} from '../../authentication/AuthProvider';
import {useWebSockets} from '../../utils/useWebSocket';
import ChatComposer from '../../components/ChatComposer';
import {uploadImage} from '../../utils/aws';
import {isImage} from '../../utils/helpers';
import ImageLoader from '../../components/ImageLoader';
import {width} from '../../Consts';
import ZoomImage from '../../components/ZoomImage';

const ChatScreen = ({route}) => {
  const {colors} = useTheme();
  const {room, isGroup = false} = route.params;
  const {currentUser} = useContext(AuthContext);
  const [text, setText] = useState('');
  const [selected, setSelected] = useState('');
  const [show, setShow] = useState(false);
  const {messages, send} = useWebSockets({
    roomId: room._id,
    enabled: room ? true : false,
    sender: currentUser._id,
  });

  const usingP2 = isGroup
    ? null
    : room.p1._id === currentUser._id
    ? true
    : false;

  // const onSend = useCallback((messages = []) => {
  //   send('Text', messages);
  // }, []);

  // const renderBubble = props => {
  //   return (
  //     <Bubble
  //       {...props}
  //       wrapperStyle={{
  //         right: {
  //           // Here is the color change
  //           backgroundColor: colors.primary,
  //           marginVertical: 5,
  //         },
  //         left: {
  //           backgroundColor: '#fff',
  //         },
  //       }}
  //       textStyle={{
  //         right: {
  //           color: '#fff',
  //         },
  //         left: {
  //           color: colors.text,
  //         },
  //       }}
  //     />
  //   );
  // };

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
          send(isImage(uri) ? 'Image' : 'Video', uri);
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
          _id: currentUser._id,
          name: currentUser.name,
          avatar: currentUser.profileImages[0],
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
