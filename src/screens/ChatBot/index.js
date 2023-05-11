import React, {useContext, useState, useMemo, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import ChatComposer from '../../components/ChatComposer';
import OptionMap from './OptionMap.json';
import {arraytoQuickReply} from '../../utils/helper';
import {askGPT} from '../../utils/chatAPI';
import {appLogo} from '../../Constants';
import BotHeader from '../../components/ChatBot.js/BotHeader';

const ChatBot = props => {
  const {colors} = useTheme();
  const {user} = useContext(GlobalContext);
  const [text, setText] = useState('');
  const [inputOptions, setInputOptions] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

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
    avatar: appLogo,
  };
  const questions = Object.keys(OptionMap);
  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: 'Start with any of the options below',
      createdAt: new Date(),
      quickReplies: {
        type: 'radio', // or 'checkbox',
        keepIt: false,
        values: arraytoQuickReply(OptionMap[questions[0]].options),
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
    setLoading(true);

    setMessages(m => [
      {
        _id: m.length,
        text: reply[0].title,
        createdAt: new Date(),
        user: currentUser,
      },
      ...m,
    ]);
    setInputOptions(i => [...i, reply[0].title]);
  };

  const clearChat = () => {
    setMessages([
      {
        _id: 0,
        text: 'Start with any of the options below',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'checkbox',
          keepIt: false,
          values: arraytoQuickReply(OptionMap[questions[0]].options),
        },
        user: backend,
      },
    ]);
    setInputOptions([]);
  };

  useEffect(() => {
    clearChat();
  }, [user]);

  const renderInputToolbar = props => {
    return (
      <ChatComposer
        value={text}
        onChangeText={setText}
        onSend={() => {
          onSelectOption([{title: text}]);
          setText('');
        }}
        disabled={!(inputOptions.length === 4 && inputOptions[3] === 'YES')}
        props={props}
      />
    );
  };

  const initialFire = async () => {
    let template = `Write title, character profiles for a ${inputOptions[0]} ${
      inputOptions[1]
    } with temporality as ${inputOptions[2]}. ${
      text && `The idea is ${text}.`
    } Also give the outline for this story using the Save the cat story structure.`;
    setLoading(true);
    let reply = await askGPT(template);
    console.log(reply);
    setMessages(m => [
      {
        _id: m.length,
        text: reply,
        createdAt: new Date(),
        user: backend,
      },
      ...m,
    ]);
    setPrompt(template + reply);
    setLoading(false);
  };

  useEffect(() => {
    if (inputOptions.length === 4) {
      if (inputOptions[3] === 'NO') initialFire(); //nesting is done so that it does'nt fallback for a Yes
    } else if (inputOptions.length === 5) initialFire();
    else if (inputOptions.length > 0) {
      let current = questions[inputOptions.length];
      let options = OptionMap[current].options;
      setLoading(false);
      setMessages(m => [
        {
          _id: m.length,
          text: current,
          createdAt: new Date(),
          user: backend,
          quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: false,
            values: arraytoQuickReply(options),
          },
        },
        ...m,
      ]);
    }
  }, [inputOptions]);

  const renderQuickReply = props => {
    return;
  };

  return (
    <View style={styles.container}>
      <BotHeader
        showClear={messages.length > 1}
        onClear={clearChat}
        downloadDisabled={true}
      />
      <GiftedChat
        messages={messages}
        renderAvatarOnTop={true}
        isTyping={loading}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        onQuickReply={onSelectOption}
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
