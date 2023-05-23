import React, {useContext, useState, useMemo, useEffect} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {useTheme} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import ChatComposer from '../../components/ChatComposer';
import OptionMap from './OptionMap.json';
import {arraytoQuickReply} from '../../utils/helper';
import {askGPT} from '../../utils/chatAPI';
import {appLogo, defaultAvatar} from '../../Constants';
import BotHeader from '../../components/ChatBot.js/BotHeader';

const ChatBot = props => {
  const {colors} = useTheme();
  const {user} = useContext(GlobalContext);
  const [text, setText] = useState('');
  const [inputOptions, setInputOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stopped, setStopped] = useState(false);
  const topics = [
    'Opening Image',
    'Theme Stated',
    'Setup',
    'Catalyst',
    'Debate',
    'Break Into Two',
    'B Story',
    'Fun and Games',
    'Midpoint',
    'Bad Guys Close In',
    'All is Lost',
    'Dark Night of the Soul',
    'Break Into Three',
    'Finale',
    'Final Image',
  ];

  const currentUser = useMemo(() => {
    return !user
      ? {
          _id: 1,
          name: 'Guest',
        }
      : {
          _id: user._id,
          name: user.name,
          avatar: user.profileImage || defaultAvatar,
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
    setStopped(false);

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
    console.log('---Chat Cleared');
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
        disabled={!(inputOptions.length === 4 && inputOptions[3] !== 'NO')}
        props={props}
      />
    );
  };

  const initialFire = async idea => {
    console.log('Idea:- ', idea);
    let template = `Write title, character profiles for a ${inputOptions[0]} ${
      inputOptions[1]
    } with temporality as ${inputOptions[2]}. ${
      !!idea[0] ? `The idea is ${idea[0]}.` : ''
    } Also give the outline for this story using the Save the cat story structure.`;
    setLoading(true);
    console.log('---Asking:- ' + template);
    let reply = await askGPT(template);
    console.log(reply);
    if (stopped) return;
    setMessages(m => [
      {
        _id: m.length,
        text: reply,
        createdAt: new Date(),
        user: backend,
      },
      ...m,
    ]);
    await askGPTRecursive(0, template + '\n' + reply);
    // await askGPTinLoop(template + '\n' + reply);
    setLoading(false);
  };

  const askGPTRecursive = async (index, currentTemplate) => {
    if (index >= topics.length || stopped) {
      return;
    }
    let temp = currentTemplate;
    temp += `\nWrite ${topics[index]} in a screenplay format.`;
    let r = await askGPT(temp);
    if (!!r) {
      temp += '\n' + r;
      setMessages(m => [
        {
          _id: m.length,
          text: `**${topics[index]}**\n${r}`,
          createdAt: new Date(),
          user: backend,
        },
        ...m,
      ]);
    }

    return await askGPTRecursive(index + 1, temp);
  };

  // const askGPTinLoop = async initPrompt => {
  //   let temp = initPrompt;
  //   await Promise.all(
  //     topics.map(async topic => {
  //       temp += `\nWrite ${topic} in a screenplay format. The length should be at least one page.`;
  //       let r = await askGPT(temp);
  //       if (stopped) {
  //         clearChat();
  //       }
  //       console.log('Prompt:- ', temp);
  //       console.log('Reply:- ', r);
  //       temp += '\n' + r;
  //       setMessages(m => [
  //         {
  //           _id: m.length,
  //           text: `**${topic}**\n${r}`,
  //           createdAt: new Date(),
  //           user: backend,
  //         },
  //         ...m,
  //       ]);
  //     }),
  //   );
  //   // let requests = topics.map(topic => {
  //   //   return new Promise((resolve, reject) => {
  //   //     temp += `\nWrite ${topic} in a screenplay format. The length should be at least one page.`;
  //   //     askGPT(temp)
  //   //       .then(r => {
  //   //         if (stopped) {
  //   //           clearChat();
  //   //           reject('Generation Stopped');
  //   //         }
  //   //         console.log('Prompt:- ', temp);
  //   //         console.log('Reply:- ', r);
  //   //         temp += '\n' + r;
  //   //         setMessages(m => [
  //   //           {
  //   //             _id: m.length,
  //   //             text: `**${topic}**\n${r}`,
  //   //             createdAt: new Date(),
  //   //             user: backend,
  //   //           },
  //   //           ...m,
  //   //         ]);
  //   //         resolve(r);
  //   //       })
  //   //       .catch(e => reject(e));
  //   //   });
  //   // });

  //   // await Promise.all(requests);
  // };

  useEffect(() => {
    if (inputOptions.length === 4) {
      if (inputOptions[3] === 'NO')
        initialFire(); //nesting is done so that it does'nt fallback for a Yes
      else if (inputOptions[3] !== 'YES')
        Linking.openURL('http://www.google.com');
    } else if (inputOptions.length === 5) initialFire(inputOptions.slice(-1));
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
        onClear={() => {
          setStopped(true);
          setLoading(false);
          clearChat();
        }}
        generating={loading}
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
