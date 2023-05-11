import React, {useContext, useState, useMemo, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import ChatComposer from '../../components/ChatComposer';
import OptionMap from './OptionMap.json';

const ChatBot = props => {
  const {colors} = useTheme();
  const {user} = useContext(GlobalContext);

  const currentUser = useMemo(() => {
    return !user
      ? {
          _id: 1,
          name: 'Guest',
        }
      : {
          _id: user._id,
          name: user.name,
          avatar:
            user.profileImage ||
            'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg',
        };
  }, [user]);

  const backend = {
    _id: 0,
    name: 'YBC',
  };

  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: 'Start generating content ?',
      createdAt: new Date(),
      quickReplies: {
        type: 'radio', // or 'checkbox',
        keepIt: false,
        values: OptionMap['Content type ?'],
      },
      user: backend,
    },
  ]);

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

  const onSelectOption = reply => {
    setMessages(m => [
      {
        _id: m.length,
        text: reply[0].title,
        createdAt: new Date(),
        user: currentUser,
      },
      ...m,
    ]);
  };

  useEffect(() => {
    setMessages([
      {
        _id: 0,
        text: 'Start with any of the options below',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'checkbox',
          keepIt: false,
          values: Object.keys(OptionMap).map(i => {
            return {title: i, value: i};
          }),
        },
        user: backend,
      },
    ]);
  }, [user]);

  const renderInputToolbar = props => {
    return (
      <ChatComposer
        // value={text}
        // onChangeText={setText}
        // onSend={() => {
        //   send('Text', text);
        //   setText('');
        // }}
        disabled={true}
        // onImagePress={async () => {
        //   let uri = await uploadImage();
        //   send(isImage(uri) ? 'Image' : 'Video', uri);
        // }}
        props={props}
      />
    );
  };

  const renderQuickReply = props => {
    return;
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderAvatarOnTop={true}
        // renderMessageVideo={props => (
        //   <Video uri={props.currentMessage.video} style={styles.video} />
        // )}
        //renderMessageImage={renderImage}
        //onSend={messages => onSend(messages)}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        onQuickReply={onSelectOption}
        //placeholder="Type your message here..."
        //renderInputToolbar={renderInputToolbar}
        renderComposer={renderInputToolbar}
        user={currentUser}
        renderBubble={renderBubble}
        multiline={true}
      />
    </View>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
