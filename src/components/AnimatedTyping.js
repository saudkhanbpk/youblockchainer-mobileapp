import {useRef, useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

export default function AnimatedTyping(props = {textStyle: {fontSize: 30}}) {
  let [text, setText] = useState('');
  let [cursorColor, setCursorColor] = useState('transparent');
  let [messageIndex, setMessageIndex] = useState(0);
  let [textIndex, setTextIndex] = useState(0);
  let [rerender, setRerender] = useState(1);
  let [timeouts, setTimeouts] = useState({
    cursorTimeout: undefined,
    typingTimeout: undefined,
    firstNewLineTimeout: undefined,
    secondNewLineTimeout: undefined,
  });
  const {colors} = useTheme();

  let textRef = useRef(text);
  textRef.current = text;

  let cursorColorRef = useRef(cursorColor);
  cursorColorRef.current = cursorColor;

  let messageIndexRef = useRef(messageIndex);
  messageIndexRef.current = messageIndex;

  let textIndexRef = useRef(textIndex);
  textIndexRef.current = textIndex;

  let timeoutsRef = useRef(timeouts);
  timeoutsRef.current = timeouts;

  let typingAnimation = () => {
    if (textIndexRef.current < props.text[messageIndexRef.current].length) {
      setText(
        textRef.current +
          props.text[messageIndexRef.current].charAt(textIndexRef.current),
      );
      setTextIndex(textIndexRef.current + 1);

      let updatedTimeouts = {...timeoutsRef.current};
      updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 50);
      setTimeouts(updatedTimeouts);
    } else if (messageIndexRef.current + 1 < props.text.length) {
      setMessageIndex(messageIndexRef.current + 1);
      setTextIndex(0);

      let updatedTimeouts = {...timeoutsRef.current};
      updatedTimeouts.firstNewLineTimeout = setTimeout(newLineAnimation, 120);
      updatedTimeouts.secondNewLineTimeout = setTimeout(newLineAnimation, 200);
      updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 280);
      setTimeouts(updatedTimeouts);
    } else {
      clearInterval(timeoutsRef.current.cursorTimeout);
      setCursorColor('transparent');

      if (props.onComplete) {
        props.onComplete();
      }
      if (props.repeat) {
        setTimeout(() => {
          setRerender(r => r + 1);
        }, 2000);
      }
    }
  };

  let newLineAnimation = () => {
    setText(textRef.current + '\n');
  };

  let cursorAnimation = () => {
    if (cursorColorRef.current === 'transparent') {
      setCursorColor(colors.secondary);
    } else {
      setCursorColor('transparent');
    }
  };

  useEffect(() => {
    console.log('Called No:- ', rerender);
    setText('');
    setCursorColor('transparent');
    setMessageIndex(0);
    setTextIndex(0);
    setTimeouts({
      cursorTimeout: undefined,
      typingTimeout: undefined,
      firstNewLineTimeout: undefined,
      secondNewLineTimeout: undefined,
    });

    let updatedTimeouts = {...timeoutsRef.current};
    updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 500);
    updatedTimeouts.cursorTimeout = setInterval(cursorAnimation, 250);
    setTimeouts(updatedTimeouts);

    return () => {
      clearTimeout(timeoutsRef.current.typingTimeout);
      clearTimeout(timeoutsRef.current.firstNewLineTimeout);
      clearTimeout(timeoutsRef.current.secondNewLineTimeout);
      clearInterval(timeoutsRef.current.cursorTimeout);
    };
  }, [rerender]);

  return (
    <Text style={{...styles.text, ...props.textStyle}}>
      {text}
      <Text
        style={{color: cursorColor, fontSize: props.textStyle.fontSize + 5}}>
        |
      </Text>
    </Text>
  );
}

let styles = StyleSheet.create({
  text: {
    fontSize: 30,
    alignSelf: 'stretch',
  },
});
