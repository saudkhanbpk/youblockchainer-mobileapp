import shorthash from 'shorthash';
import ImagePicker from 'react-native-image-crop-picker';

export const diffDate = (end, setText, noSeconds) => {
  var countDownDate = end * 1000;
  var now = new Date().getTime();

  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = noSeconds ? 0 : Math.floor((distance % (1000 * 60)) / 1000);
  var temp = '';
  if (days > 0) {
    temp += `${days}d`;
  }
  if (hours > 0) {
    temp += ` : ${hours}h`;
  }
  if (minutes > 0) {
    temp += ` : ${minutes}m`;
  }
  if (!noSeconds) {
    temp += ` : ${seconds}s `;
  }
  //let temp = moment(end * 1000).toNow(true);
  setText(temp);
};

export const getArrayOfResponses = async arr => {
  let requests = arr.map(url => {
    return new Promise((resolve, reject) => {
      fetch(url[1])
        .then(r => r.json())
        .then(r => resolve({...r, contractAddress: url[0]}))
        .catch(e => reject(e));
    });
  });
  return await Promise.all(requests);
};

export const arraytoQuickReply = arr => {
  return arr.map(i => {
    return {title: i, value: i};
  });
};

export const backendToGifted = chat => {
  //console.log(chat);
  let temp = {
    _id: chat._id,
    text: chat.chatMessage,
    createdAt: new Date(chat.createdAt),
    user: {
      _id: chat.sender._id,
      name: chat.sender.username,
      avatar: chat.sender.profileImage,
    },
    image: chat.chatMessage,
    video: chat.chatMessage,
  };

  if (chat.type === 'Media' || chat.type === 'Image') {
    delete temp.text;
    delete temp.video;
  } else if (chat.type === 'Video') {
    delete temp.image;
    delete temp.text;
  } else {
    delete temp.image;
    delete temp.video;
  }

  return temp;
};

export function numFormatter(num) {
  const formatter = Intl.NumberFormat('en', {notation: 'compact'});
  return formatter.format(num);
  // if (num > 999 && num < 1000000) {
  //   return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million
  // } else if (num > 1000000) {
  //   return (num / 1000000).toFixed(2) + 'M'; // convert to M for number from > 1 million
  // } else if (num < 900) {
  //   return num; // if value < 1000, nothing to do
  // }
}

// export function toMatic(price) {
//   const formatter = Intl.NumberFormat('en', {
//     notation: 'compact',

//     currencyDisplay: 'MATIC',
//   });

//   return formatter.format(parseInt(price));
// }

export function validateEmail(email) {
  const re = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  if (!re.test(email)) {
    alert('Please enter a valid Email to continue');
    return false;
  } else {
    return true;
  }
  //return true;
}

export const pickPhoto = async () => {
  let source = {
    uri: '',
    type: '',
    name: '',
  };
  try {
    let result = await ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
    });
    let arr = result.path.split('.');
    source.uri = result.path;
    source.type = result.mime;
    source.name = `${shorthash.unique(result.path)}.${arr[arr.length - 1]}`;
    return source;
  } catch (error) {
    console.log(error);
    return source;
  }
};

export function compare(s1, s2) {
  return s1.toLowerCase() === s2.toLowerCase();
}

export const isImage = uri => {
  return uri.match(/\.(jpg|jpeg|png|gif)$/);
};

export async function checkTx(hash, web3) {
  // Log which tx hash we're checking
  console.log('Waiting for tx ' + hash);
  let status = false;
  // Set interval to regularly check if we can get a receipt
  let promise = new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      web3.eth.getTransactionReceipt(hash, (err, receipt) => {
        // If we've got a receipt, check status and log / change text accordingly
        if (receipt) {
          console.log('Gotten receipt', receipt);
          if (receipt.status === true) {
            // console.log('Tx Success:- ', receipt);
            resolve(receipt);
            //status = true;
          } else if (receipt.status === false) {
            // console.log('Tx failed');
            reject('TX has failed');
            //status = false;
          }
          // Clear interval
          clearInterval(interval);
        }
      });
    }, 1000);
  });
  clearInterval(interval);
  promise
    .then(t => {
      status = true;
    })
    .catch(console.log);
  return status;
}

export function convertToCSV(array) {
  var str = '';
  let columns = Object.keys(array[0]);
  str += columns.join(',');
  str += '\r\n';
  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ',';

      line +=
        index === 'PhoneNo' ? `"${array[i][index]}"` : `"${array[i][index]}"`;
    }

    str += line + '\r\n';
  }

  return str;
}

export function notifyEVMError(error) {
  alert(
    error.message.includes('EVM') ? error.message.split(':')[0] : error.message,
  );
}
