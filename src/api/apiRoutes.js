const USER = {
  USER_ACTIONS: '/user/users/',
  LOGIN_SIGNUP: '/user/login',
  GET_UPDATE_ME: '/user/me',
  GET_MY_CLAIMED: '/user/me/claimed',
  GET_MY_CREATED: '/user/me/created',
  GET_MY_CLAIMABLE: '/user/me/claimable',
  GET_MY_WISHLIST: '/user/me/favorites',
  GET_MY_LISTED: '/user/me/listed',
  GET_MY_BOUGHT: '/user/me/bought',
  GET_MY_LISTING_WISHLIST: '/user/me/favoriteItems',
  GET_CREATORS: '/user/creators',
  GET_PAGINATED_USERS: '/user/users/paginated',
  SEARCH_USERS: '/user/users/search',
  TOGGLE_FOLLOW: '/user/toggleFollow/',
};

const OFFERS = {
  GET_OFFERS: '/offer/',
  GET_CREATOR_OFFER: '/offer/creator/',
  CLAIM_OFFER: '/offer/claimed/',
  GET_COMMUNITY_OFFER: '/offer/community/',
  GET_COMMUNITY_OFFER_DB: '/offer/community/db/',
  GET_BRAND_OFFER_DB: '/offer/brand/db/',
  SEARCH_OFFER: '/offer/offers/search',
  GET_PAGINATED_OFFER: '/offer/offers/paginated',
  GET_FILTERED_OFFERS: '/offer/offers/filter',
  DB_OFFER_ACTION: '/offer/db/',
  GET_OFFER_BY_ADDRESS_DB: '/offer/db/address/',
  BUY_OFFER: '/offer/buy/',
  GET_LATEST_CONTRACTADDRESS: '/offer/contractAddress/latest',
  REDEEM_COMPLETE: '/offer/redeem/complete/',
  GET_REQUESTS: '/offer/requests/',
};

const LISTINGS = {
  CREATE_LISTING: '/offer/list',
  LISTING_ACTIONS: '/offer/listings/db/',
  DELETE_LISTING: '/offer/item/',
  GET_FILTERED_LISTINGS: '/offer/items/filter',
  GET_PAGINATED_LISTINGS: '/offer/items/paginated',
  SEARCH_LISTINGS: '/offer/items/search',
  BUY_LISTING: '/offer/listings/buy/',
};

const IPFS = {
  UPLOAD_IMG: '/ipfs/img',
  UPLOAD_JSON: '/ipfs/json',
};

const COMMUNITY = {
  GET_COMMUNITIES: '/community',
  GET_PAGINATED_COM: '/community/communities/paginated',
  SEARCH_COM: '/community/communities/search',
};

const BRAND = {
  GET_BRANDS: '/brand/',
  GET_PAGINATED_BRAND: '/brand/brands/paginated',
  SEARCH_BRAND: '/brand/brands/search',
  GET_BRAND_BY_WALLET: '/brand/user/',
};
export const ENDPOINTS = {
  ...OFFERS,
  ...USER,
  ...IPFS,
  ...COMMUNITY,
  ...BRAND,
  ...LISTINGS,
  GET_ADS: '/ad',
  ASK_GPT: '/gpt/ask',
};
