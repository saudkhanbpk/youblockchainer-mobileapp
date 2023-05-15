import {contractAddress} from '../Constants';
import API, {ENDPOINTS} from '../api/apiService';

export const createAgreement = async (
  me,
  expert,
  nameofAgreement,
  startsAt,
  mainContract,
  executeMetaTx,
) => {
  try {
    let obj = {
      name: nameofAgreement,
      startsAt,
      user1: me,
      user2: expert,
    };

    let uri = await API.post(ENDPOINTS.UPLOAD_JSON, obj);
    console.log('---Obj uploaded on IPFS');
    const data = mainContract.methods
      .createAgreement(uri, startsAt, nameofAgreement, expert.walletAddress)
      .encodeABI();

    let res = await executeMetaTx(data, contractAddress);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');

    let apiRes = await API.post(ENDPOINTS.AGREEMENT_ACTION, {
      name: nameofAgreement,
      startsAt,
      user1: me._id,
      user2: expert._id,
    });
    console.log('---Agreement Created in DB', apiRes);
  } catch (error) {
    alert(error.message);
  }
};
