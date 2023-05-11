import API, {ENDPOINTS} from '../api/apiService';

export const getAllRooms = async () => {
  try {
    let res = await API.get(ENDPOINTS.GET_ALL_ROOMS, true);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createRoom = async id => {
  try {
    let res = await API.post(ENDPOINTS.ROOM_ACTIONS, {receiver: id}, true);
    //console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllChats = async id => {
  try {
    let res = await API.get(ENDPOINTS.ROOM_ACTIONS + '/' + id, true);
    //console.log('Chats:- ', res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const askGPT = async prompt => {
  try {
    return await API.post(ENDPOINTS.ASK_GPT, {prompt});
  } catch (error) {
    console.log('Ask GPT Error:- ', error.message);
    return '';
  }
};
