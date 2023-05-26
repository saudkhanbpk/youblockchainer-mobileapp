import API, {ENDPOINTS} from '../api/apiService';

export const getBrands = async setData => {
  try {
    let res = await API.get(ENDPOINTS.GET_BRANDS);
    setData(res);
  } catch (error) {
    console.log('brand' + error);
  }
};

export const getBrandByManager = async id => {
  try {
    return await API.get(ENDPOINTS.GET_BRAND_BY_MANAGER + id);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createBrand = async (body, setBrand) => {
  try {
    let res = await API.post(ENDPOINTS.GET_BRANDS, body);
    console.log(res);
    setBrand(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateBrand = async (id, body, setBrand) => {
  try {
    let res = await API.put(ENDPOINTS.GET_BRANDS + id, body);
    console.log(res);
    setBrand(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const searchBrands = async q => {
  try {
    let res = await API.get(ENDPOINTS.SEARCH_BRAND + `?q=${q}`);
    //console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};
