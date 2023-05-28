import React, {useContext, useState, useMemo, useEffect} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {useTheme} from 'react-native-paper';
import {GlobalContext} from '../../auth/GlobalProvider';
import {GiftedChat, Bubble, Time} from 'react-native-gifted-chat';
import ChatComposer from '../../components/ChatComposer';
import OptionMap from './OptionMap.json';
import {arraytoQuickReply} from '../../utils/helper';
import {askGPT, saveAsPdf} from '../../utils/chatAPI';
import {appLogo, defaultAvatar} from '../../Constants';
import BotHeader from '../../components/ChatBot.js/BotHeader';
import {FountainParser} from 'screenplay-js';

const ChatBot = props => {
  const {colors} = useTheme();
  const {user, setUser} = useContext(GlobalContext);
  const [text, setText] = useState('');
  const [inputOptions, setInputOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [finalScript, setFinalScript] = useState('');
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
      !!idea ? (!!idea[0] ? `The idea is ${idea[0]}.` : '') : ''
    } Also give the outline for this story using the Save the cat story structure.`;
    setLoading(true);
    console.log('---Asking:- ' + template);
    let reply = await askGPT(template);
    //console.log(reply);
    if (stopped) return setLoading(false);
    setMessages(m => [
      {
        _id: m.length,
        text: reply,
        createdAt: new Date(),
        user: backend,
      },
      ...m,
    ]);
    let script = await askGPTRecursive(
      0,
      // template + '\n' +
      reply,
      reply.split('\n')[0],
    );
    console.log('---Script Genration Done', script);
    setFinalScript(script);
    // await askGPTinLoop(template + '\n' + reply);
    setLoading(false);
  };

  const askGPTRecursive = async (index, currentTemplate, currScript) => {
    if (index >= topics.length || stopped) {
      return currScript;
    }
    //let temp = currentTemplate;
    let tempScript = currScript;
    //temp += `\nWrite ${topics[index]} in a screenplay format.`;
    let r = await askGPT(
      currentTemplate +
        `\nWrite ${topics[index]} in a screenplay format. The length should be atleast one page. Give the response in Fountain Markdown format.`,
    );
    if (!!r) {
      //temp += '\n' + r;
      tempScript += '\n\n' + r;
      if (!stopped)
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

    return await askGPTRecursive(index + 1, currentTemplate, tempScript);
  };

  const saveDownloadScript = async inDevice => {
    console.log('here', FountainParser);
    let options = {
      paginate: true,
      //lines_per_page: 'none' | 'loose' | 'normal' | 'tight' | 'very_tight',
      // script_html: boolean,
      // script_html_array: boolean,
      // notes: boolean,
      // draft_date: boolean,
      // boneyard: boolean,
      tokens: true,
    };
    const screenplay = FountainParser.parse(
      finalScript,
      // `Title: Uncovering the Unforeseen

      // Character Profiles:

      // protagonist: Dr. Paul Stein, an anthropologist and linguist specializing in ancient languages.

      // antagonist: A dark, malevolent supernatural entity responsible for a series of mysterious disappearances in the town

      // supporting characters:
      // 1. Mrs. Betty Stein – wife of Dr. Paul Stein, a nurse.
      // 2. Mr. Jack Smyth – caretaker and groundskeeper of the ancient ruins, also a local historian.
      // 3. Rhys Collins – a college student from the local university, assisting Dr. Stein in his research.

      // Outline:

      // 1. Opening Image: On a drizzly night in a quiet town, strange occurrences have been happening.

      // 2. Set-up: Dr. Paul Stein, a linguist and anthropologist, arrives in town to study the ancient ruins found at the outskirts.

      // 3. Theme Stated: As the plot unfolds and multiple disappearances occur, a mysterious evil force is at work.

      // 4. Catalyst: After finally uncovering a hidden passage inside the ruins, Dr. Stein and Rhys stumble upon a forgotten and long-forgotten chamber that had been sealed off from the public.

      // 5. B Story: Meanwhile, Mrs. Stein strives to keep her husband and Rhys safe all while getting to grips with the supernatural entity, as well as solving the disappearances.

      // 6. Debate: Is it possible to stop the evil entity before it causes any more harm?

      // 7. Break into Two: Dr. Stein and Rhys decide to return to the ruins and venture deeper into the chamber.

      // 8. Midpoint: Uncovering an ancient text, they decipher an ominous ancient prophecy that explains the dark forces that are intent on destroying the town and all its inhabitants.

      // 9. Bad Guys Close In: The evil entity quickly becomes more powerful and attempts to reclaim dark magic powers.

      // 10. All is Lost: Mrs. Stein is taken hostage by the mysterious entity and it seems like there is no hope in stopping it.

      // 11. Dark Night of the Soul: Dr. Stein and Rhys ponder on the text and decipher out how to break the spell and once again defeat the dark force.

      // 12. Break into Three: With the assistance of Mr. Smyth and the ancient text, they are able to manifest protective charms that eventually serves as the ultimate weapon against the dark forces.

      // 13. Finale: With the town saved, a sense of peace is finally restored, and the protagonists are eventually reunited with Mrs. Stein.

      // 14. Final Image: Dr. Stein and his family visiting the ruins and appreciating the mysterious chamber which once unleashed an evil force, now a place of solace and triumph.
      // EXT. TOWN - NIGHT

      // A drizzly night in a quiet town. Small cobblestone paths meander through the streets, a soft glow emitting from the streetlamps. On the horizons, the ancient ruins can be seen, looming in the distance. Unseen forces lurk in the darkness, their presence transmitting a shiver of unease.
      // EXT. PUBLIC SQUARE - DAY

      // A drizzly day in a serene public square. A mysterious evil force is at work, its identity still unknown. The townsfolk quietly mill about unaware of what's to come.

      // VOICE OVER
      // As the plot unfolds and multiple disappearances occur, a mysterious evil force is at work.
      // EXT. QUIET TOWN – NIGHT
      // A thin layer of fog hangs in the air, dampening the cobblestone streets as a light drizzle rains down on the empty town.

      // FADE IN

      // EXT. HOUSE – CONTINUOUS
      // The house is an old two-story home, with yellow shingles and a chipped paint job. Inside, a warm light streams from the windows.

      // INT. HOUSE – CONTINUOUS
      // Dr. Paul Stein, an anthropologist and linguist, is unpacking his suitcases as his wife Betty looks on.

      // BETTY
      // Do you think this one is going to be any different?

      // PAUL
      // (smiles)
      // I hope so.

      // EXT. ANCIENT RUINS - DAY
      // The ruins are located on the outskirts of town, surrounded by towering trees. Dr. Stein walks up the steps and takes in the view.

      // EXT. COLLEGE CAMPUS - DAY
      // Rhys Collins, a college student from the local university, meets with Dr. Stein to discuss an upcoming project.

      // RHYS
      // So, what exactly is the project?

      // Dr. Stein explains the project – to study the mysterious ruins and uncover the truth behind the ancient texts. Rhys is intrigued and decides to join Dr. Stein in the project.
      // EXT. GRAVEYARD - DAY
      // A graveyard set in a quiet town late in the Fall.

      // DR. PAUL STEIN, an anthropologist and linguist in his late thirties, walks along the cemetery. He seems to be searching for something.

      // RHYS COLLINS, a college student in his early twenties, follows closely and assists him in his research.

      // Along the way, they find a path leading to a rustic, ancient ruin surrounded by tall trees.

      // DR. STEIN
      // (to Rhys)
      // This is it. This is the ruin we were searching for.

      // They approach the ruin and wander around it.

      // RHYS
      // What are we looking for, exactly?

      // DR. STEIN
      // A hidden entrance – a passage that reveals something that has been sealed off from the public for centuries.

      // They slowly make their way inside the ruin and stumble upon a forgotten chamber.

      // DR. STEIN
      // This is it. We found it.

      // Rhys looks around in awe as Dr. Stein shines his flashlight around the dark chamber.

      // RHYS
      // What do you think is in here?

      // DR. STEIN
      // (smiles mysteriously)
      // Only one way to find out.

      // They take a few more steps forward and the camera takes a bird's eye view, looking down upon them from the darkness.

      // This is the Catalyst of the story - the moment when Dr. Stein and Rhys discover the chamber and set off their adventure to uncover the unseen.
      // Challenge:
      // Rhys: How are we supposed to be able to stop this evil entity before it causes any more harm?

      // Dr. Stein: It seems unlikely. We don't have much information and we are up against a powerful dark force.

      // Mrs. Stein: We must find a way to outsmart it. There must be a way to defeat it.

      // Jack: We need to be able to read the ancient texts and find out what exactly the prophecy is.

      // Rhys: But can we really face such dark magic and survive?

      // Mrs. Stein: We don't have any other choice. We can't let this force take over and destroy our town. We have to fight and protect our future.
      // EXT. THE RUINS - NIGHT

      // Dr. Stein and Rhys arrive at the ancient ruins. The night sky looms overhead as a cool wind sweeps through the area.

      // DR. STEIN
      // Let's go in.

      // INT. CHAMBER - NIGHT

      // Dr. Stein and Rhys step into the hidden chamber. The room is filled with ancient artifacts and the walls display runic writings.

      // DR. STEIN
      // Look at these markings - they must be centuries old.

      // Rhys stares at the writings, full of wonder and awe.

      // RHYS
      // It's incredible! I've never seen anything like it.
      // EXT. QUIET STREET - NIGHT

      // Mrs. Stein, a nurse, is walking home from work. As she passes by the ancient ruins of the town, a supernatural force passes by, sending a chill down her spine.

      // INT. MRS. STEIN'S HOUSE – DAY

      // Mrs. Stein is inside her house. She notices a knock on the door and opens it.

      // MR. SMYTH

      // Good evening, Mrs. Stein. Is your husband in?

      // Mrs. Stein nods.

      // MR. SMYTH (CONT'D)

      // He's been looking into the ancient ruins. I think he's onto something.

      // Mrs. Stein looks worried. She frowns, not sure if she should be worried.

      // MR. SMYTH (CONT'D)

      // He also has a student with him. Rhys Collins.

      // Mrs. Stein is taken aback.

      // MRS. STEIN

      // Do you think they’re safe?

      // MR. SMYTH

      // I can't be sure. We need to keep an eye on them.

      // Mrs. Stein swallows hard and nods.

      // MRS. STEIN

      // We'll do whatever it takes to keep them safe.
      // FADE IN:

      // EXT. PARK - DAY

      // A sunny day, perfect for a day of outdoor fun.

      // SUPER: "The following afternoon"

      // Jed Stone and Kayla Brown, two friends in their mid-teens, ride their bikes together through the park. They laugh and enjoy the day.

      // KAYLA
      // Ready for some fun and games?

      // JED
      // You bet!

      // Jed and Kayla make their way over to a basketball court.

      // JED
      // This looks perfect!

      // They both get off their bikes and start to play a game of two-on-two. As they play, they both laugh and enjoy themselves.

      // KAYLA
      // You better watch it! You're lucky I'm no Michael Jordan!

      // JED
      // Oh yeah? Who's gonna stop me!?

      // They continue to play for a little while longer, until they get tired and decide to take a break.

      // JED
      // (catching his breath)
      // Let's go grab a drink.

      // Kayla laughs, and they leave the court.

      // EXT. PARK - DAY

      // Jed and Kayla make their way over to a nearby concession stand.

      // KAYLA
      // What do you want?

      // JED
      // Surprise me.

      // Kayla orders two sodas and hands one to Jed. They sit down and enjoy the drinks.

      // KAYLA
      // Man, this was fun!

      // JED
      // It sure was!

      // They smile and get up to leave.

      // EXT. PARK - DAY

      // Jed and Kayla make their way back to their bikes and say their goodbyes.

      // JED
      // Take care!

      // KAYLA
      // You too!

      // They ride off into the distance, still laughing and smiling.

      // FADE OUT.
      // EXT. RUINS – DAY

      // Dr. Stein and Rhys enter a hidden chamber deep within the ruins.

      // They come across an ancient text, inscribed with unfamiliar symbols.

      // DR. STEIN
      // It must be a prophecy of some sort.

      // RHYS
      // Do you think its about the evil entity?

      // Dr. Stein reads the ancient text, trying to decipher its contents.

      // DR. STEIN
      // Yes... It says that dark forces are responsible for the disappearances in the town. An ancient artifact must be found and destroyed in order to weaken the entity’s power and save everyone.
      // FADE IN:

      // EXT. TOWN STREET – DAY

      // A quiet town. A drizzle of rain falls, the townspeople walking on the streets, looking around them nervously.

      // INT. ANCIENT RUINS – DAY

      // Dr. Stein and Rhys venture deeper into the chamber. They look around warily, feeling a strange presence around them. Then they hear a loud crash and the sound of metal clashing against metal.

      // EXT. ANCIENT RUINS – DAY

      // Mrs. Stein is surrounded by a group of shadowy figures, her eyes wide with fear.

      // DR. STEIN
      // (loudly)
      // No!

      // The figures advance towards Mrs. Stein, and Dr. Stein struggles to break free from the chamber to help her.

      // RHYS
      // It's too late! We have to go!

      // Dr. Stein and Rhys turn and run out of the ruins, even as Mrs. Stein is dragged away by the shadowy figures.

      // EXT. QUIET TOWN STREET – DAY

      // Confused and anguished, Dr. Stein and Rhys return to the town and desperately search for Mrs. Stein. But it's all in vain.

      // DR. STEIN
      // (shaking his head)
      // We're too late.

      // Rhys and Dr. Stein exchange a sorrowful look.

      // EXT. TOWN STREET – MORNING

      // The rain ceases and the town remains silent. Dr. Stein and Rhys look to each other, grief and sadness palpable on their faces.

      // DR. STEIN
      // (softly)
      // All is lost.

      // FADE OUT.
      // EXT. ALLEYWAY - NIGHT

      // A tall figure emerges from the shadows. CLOSE UP reveals it is DR. PAUL STEIN, a linguist and anthropologist. He looks around cautiously before speaking.

      // DR. PAUL STEIN
      // (voice-over)
      // What is going on? What is this dark force that looms over us?

      // He begins to walk aimlessly, his surrounding growing more and more eerie. He stops.

      // DR. PAUL STEIN
      // (voice-over)
      // What is our next move? How can we stop this before it’s too late?

      // Suddenly a scream is heard echoing through the alleyways. Dr. Stein’s eyes widen as he looks around for the source. He takes a few steps forward and stands in a shaft of light.

      // DR. PAUL STEIN
      // (voice-over)
      // Is this what I’m up against? Will I be able to stop this?

      // He looks up to the night sky, his face a stoic mask of determination.

      // DR. PAUL STEIN
      // (voice-over)
      // I will figure out a way.

      // FADE OUT.

      // END.
      // INT. LIVING ROOM - DAY

      // Dr. Stein and Rhys are silently contemplating an ancient text.

      // MRS. STEIN

      // (breaking the silence)
      // What does the text say?

      // Dr. Stein and Rhys exchange a glance, silently deciding how much to tell her.

      // DR. STEIN

      // (reluctantly)
      // It’s a spell. There’s a way to break the dark force’s power.

      // MRS. STEIN

      // How?

      // RHYS

      // (pulling out the charms from his pocket)
      // With these charms. If we can wear them or put them around the town, they should be able to stop him.

      // MRS. STEIN

      // (awed)
      // That’s incredible!

      // Dr. Stein and Rhys share a knowing look.

      // CUT TO:

      // EXT. PARK - DAY

      // Dr. Stein, Rhys and Mrs. Stein arrive at the park.  The townspeople are all wearing the protective charms around their necks.

      // MRS. STEIN

      // (awed)
      // It worked!

      // Dr. Stein and Rhys exchange a satisfied smile, proud at their accomplishment.

      // DR. STEIN

      // Looks like we broke into three.

      // CUT TO:

      // EXT. RUINS - DAY

      // The trio return to the ruins, amazed at the transformation the protective charms have brought.

      // MRS. STEIN

      // (breathless)
      // It’s beautiful…

      // Dr. Stein wraps an arm around her, a quiet sense of triumph between them.

      // DR. STEIN

      // Definitely beautiful.

      // They share a smile as the camera zooms out.
      // EXT. RUINS -- DAY

      // The ruins are bustling with people enjoying the newfound peace. Dr. Stein and Mrs. Stein greet each other with a hug as the townspeople cheer and applaud.

      // ANGLE ON: Rhys, happily watching the reunion from afar.

      // CUT TO:

      // INT. STEIN FAMILY'S HOUSE -- DAY

      // The Steins are sitting on the couch together, with Mrs. Stein resting her head on Dr. Stein's shoulder.

      // Mrs. Stein
      // So much happened in such a short time.

      // Dr. Stein
      // It certainly did. But, we can learn from this.

      // Mrs. Stein
      // Yes. Let's remember what we've been through and draw strength from it.

      // CUT TO:

      // EXT. RUINS -- DAY

      // Dr. Stein and his family walk into the ruins, appreciating the chamber that once unleashed an evil force, now a place of solace and triumph.

      // FADE OUT.
      // FADE OUT

      // EXT. ANCIENT RUINS - DAY

      // Dr. Stein and his family, now reunited, are visiting the ruins which overlook the town. The mysterious chamber once unleashed an evil force looms in the background but now serves as a reminder of triumph and solace.

      // FADE IN`,
      options,
    );

    // console.log(screenplay);
    let html =
      screenplay.title_page_html +
      screenplay.script_pages.map(i => i.html).join('');
    await saveAsPdf(html, inDevice, user.scripts || [], setUser);
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
        downloadDisabled={!finalScript}
        onSave={() => {
          saveDownloadScript(false);
        }}
        onDownload={() => {
          saveDownloadScript(true);
        }}
      />
      <GiftedChat
        messages={messages}
        renderAvatarOnTop={true}
        renderTime={renderTime}
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
