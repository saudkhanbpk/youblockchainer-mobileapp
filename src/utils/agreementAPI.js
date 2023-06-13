//import AskGPT from '../abis/AskGPT.json';
import moment from 'moment/moment';
import {contractAddress} from '../Constants';
import API, {ENDPOINTS} from '../api/apiService';
import {notifyEVMError} from './helper';

export const uploadJSON = async data => {
  try {
    let res = await API.post(ENDPOINTS.UPLOAD_JSON, data);
    return res.url;
  } catch (error) {
    console.log(error);
  }
};

export const getUserAgreementsFromContract = async (contract, address) => {
  try {
    let agreements = await contract.methods.getUserAgreements(address).call();
    return agreements;
  } catch (error) {
    console.log('Agreemente fetch from contract Failed:- ', error.message);
  }
};

export const addMilestone = async (
  name,
  amount,
  description,
  executeMetaTx,
  agreementContract,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods
      .addMilestone(name, amount, description)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Adding milestone Error:- ', error.message);
    return false;
  }
};

export const updateMilestone = async (
  id,
  name,
  amount,
  description,
  executeMetaTx,
  agreementContract,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods
      .updateMilestone(id, name, amount, description)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Adding milestone Error:- ', error.message);
    return false;
  }
};

export const deleteMilestone = async (
  id,
  agreementContract,
  executeMetaTx,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods.removeMilestone(id).encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const fundMilestone = async (
  id,
  agreementContract,
  walletAddress,
  value,
) => {
  try {
    console.log(value);
    let hash = await agreementContract.methods.fundMilestone(id).send({
      from: walletAddress,
      value,
    });
    console.log(hash);
    return true;
  } catch (error) {
    notifyEVMError(error);
    console.log('Error in funding:- ', error);
    return false;
  }
};

export const payMilestone = async (
  id,
  agreementContract,
  executeMetaTx,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods.approveMilestone(id).encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const requestPayment = async (
  id,
  agreementContract,
  executeMetaTx,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods.requestPayment(id).encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const raiseRefundRequest = async (
  milestoneId,
  amount,
  agreementContract,
  executeMetaTx,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods
      .requestRefund(milestoneId, amount)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const updateRefundRequest = async (
  requestId,
  amount,
  agreementContract,
  executeMetaTx,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods
      .updateRequest(requestId, amount)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const grantRefundRequest = async (
  requestId,
  agreementContract,
  executeMetaTx,
  agreementAddr,
) => {
  try {
    let data = await agreementContract.methods
      .grantRefund(requestId)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    return true;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const updateAgreement = async (
  id,
  body,
  setAgreement,
  contractAddress,
) => {
  try {
    let apiRes = await API.put(ENDPOINTS.AGREEMENT_ACTION + id, body);
    if (setAgreement) setAgreement({...apiRes, contractAddress});
    return true;
  } catch (error) {
    console.log('Agreement updation error:- ', error.message);
    return false;
  }
};

export const endContract = async (
  agreementContract,
  executeMetaTx,
  agreementAddr,
  agreementId,
  setAgreement,
) => {
  try {
    let data = await agreementContract.methods.endContract().encodeABI();
    let current = moment().unix();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, agreementAddr);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    if (
      await updateAgreement(
        agreementId,
        {endsAt: current},
        setAgreement,
        agreementAddr,
      )
    )
      return true;
    return false;
  } catch (error) {
    console.log('Error in delting milestone:- ', error.message);
    return false;
  }
};

export const createAgreement = async (
  me,
  expert,
  nameofAgreement,
  startsAt,
  createdAt,
  mainContract,
  executeMetaTx,
  web3,
) => {
  try {
    let obj = {
      name: nameofAgreement,
      startsAt,
      createdAt,
      user1: me,
      user2: expert,
    };

    let uri = await uploadJSON(obj);
    console.log('---Obj uploaded on IPFS:- ', uri);
    //let contract = new web3.eth.Contract(AskGPT);
    const data = mainContract.methods
      .createAgreement(uri, startsAt, nameofAgreement, expert.walletAddress)
      .encodeABI();
    console.log('---Abi encoded');
    let res = await executeMetaTx(data, contractAddress);
    if (!res) throw Error('Meta Tx Failed :(');
    console.log('---Meta Tx successful');
    console.log(JSON.stringify(res));
    console.log('To DB: ', {
      name: nameofAgreement,
      startsAt,
      user1: me._id,
      user2: expert._id,
    });
    let apiRes = await API.post(ENDPOINTS.AGREEMENT_ACTION, {
      name: nameofAgreement,
      startsAt,
      user1: me._id,
      user2: expert._id,
      agreementUri: uri,
    });
    console.log('---Agreement Created in DB', apiRes);
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
};
