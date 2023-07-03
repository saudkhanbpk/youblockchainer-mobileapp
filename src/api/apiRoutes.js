const USER = {
  USER_ACTIONS: '/user/users/',
  LOGIN_SIGNUP: '/user/login',
  GET_UPDATE_ME: '/user/me',
  GET_PAGINATED_USERS: '/user/users/paginated',
  SEARCH_USERS: '/user/users/search',
  TOGGLE_FOLLOW: '/user/toggleFollow/',
  META_TX: '/user/metatx',
  GET_USER_AGREEMENTS: '/user/agreements/', //append user id
  AGREEMENT_ACTION: '/user/agreement/', //append agreement id
  GET_LATEST_CONTRACTADDRESS: '/user/contractAddress/latest',
};

const IPFS = {
  UPLOAD_IMG: '/ipfs/img',
  UPLOAD_JSON: '/ipfs/json',
};

const BRAND = {
  GET_BRANDS: '/brand/',
  GET_PAGINATED_BRAND: '/brand/brands/paginated',
  SEARCH_BRAND: '/brand/brands/search',
  GET_BRAND_BY_MANAGER: '/brand/user/',
};

const CHAT = {
  GET_ALL_ROOMS: '/chat',
  ROOM_ACTIONS: '/chat/room/',
  DELETE_MSG: '/chat/msg/',
};

export const ENDPOINTS = {
  ...USER,
  ...IPFS,
  ...BRAND,
  ...CHAT,
  ASK_GPT: '/gpt/ask',
  GET_VIDEOS: '/admin',
};
