import {useEffect, useState} from 'react';
import io from 'socket.io-client';
import {base} from '../Constants';
import {backendToGifted} from './helper';
import StorageManager from '../storage/StorageManager';
import {getAllChats} from './chatAPI';

export const useWebSockets = ({roomId, enabled, sender}) => {
  const [messages, setMessages] = useState([]);
  const input = 'Input Chat Message';
  const output = 'Output Chat Message';
  const joinRoom = 'Join Room';
  const socket = io(base);

  const send = (type, messages) => {
    if (!messages || messages.trim() === '') {
      return;
    }
    socket.emit(input, {
      //chatMessage: messages[0].text,
      chatMessage: messages,
      sender,
      type,
      roomId,
    });
  };

  const fetchFromDevice = async () => {
    try {
      let res = await StorageManager.get(roomId);
      if (res === undefined) {
        return [];
      }

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    try {
      setMessages(await fetchFromDevice());

      let prior = await getAllChats(roomId);
      prior = prior
        .map(i => backendToGifted(i))
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      setMessages(prior);
      await StorageManager.put(roomId, prior);
    } catch (e) {
      console.log('Error in getting previous chats');
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    socket.emit(joinRoom, roomId);
    socket.on(output, msg => {
      setMessages(prev => [backendToGifted(msg), ...prev]);
    });

    return () => socket.disconnect();
  }, [enabled, roomId]);

  return {
    send,
    messages,
  };
};
