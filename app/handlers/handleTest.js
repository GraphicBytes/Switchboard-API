
//###########################################
//############### HANDLE TEST ###############
//###########################################

//////////////////////////////
////// Function Imports //////
//////////////////////////////
import { resSendOk } from '../functions/resSend/resSendOk.js';
import { createUUID } from '../functions/createUUID.js';
import { encrypt } from '../functions/crypt/encrypt.js';
import { decrypt } from '../functions/crypt/decrypt.js';

//////////////////////////
////// THIS HANDLER //////
//////////////////////////
async function handleTest(app, req, res) {
  try {

    let outputResult = { "status": 0 };


    outputResult['userNameCrypt'] = encrypt("victorha", process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);

    outputResult['pwNameCrypt'] = encrypt("EKHc0!VhwPfmze", process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);

    outputResult['userNameDecrypt'] = decrypt(outputResult['userNameCrypt'], process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);

    outputResult['pwNameDecrypt'] = decrypt(outputResult['pwNameCrypt'], process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);

    outputResult['id'] = createUUID(); 

    resSendOk(req, res, outputResult);

    return null;

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    return null;
  }
}

export default handleTest;