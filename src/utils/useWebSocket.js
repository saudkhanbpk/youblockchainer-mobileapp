import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
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

  // socket.on('connect', () => {
  //   socket.emit(joinRoom, roomId);
  //   socket.on(output, msg => {
  //     setMessages(prev => [backendToGifted(msg), ...prev]);
  //   });
  // });

  socket.on('disconnect', () => {
    console.log('Socket Disconnected from server');
    socket.connect();
  });

  socket.io.on('error', console.log);
  socket.io.on('ping', () => {
    console.log('---Chat Pinging');
  });

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

  const getPreviousChats = async () => {
    try {
      setMessages(await fetchFromDevice());

      let prior = await getAllChats(roomId);
      prior = prior
        .map(i => backendToGifted(i))
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      setMessages(prior);
      await StorageManager.put(roomId, prior);
    } catch (e) {
      console.log('Error in getting previous chats:- ', e.message);
    }
  };

  useEffect(() => {
    getPreviousChats();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    socket.emit(joinRoom, roomId);
    socket.on(output, msg => {
      setMessages(prev => [backendToGifted(msg), ...prev]);
    });
  }, [enabled, roomId]);

  return {
    send,
    messages,
    status: socket.connected,
  };
};
