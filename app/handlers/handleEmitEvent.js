//############################################
//############### DEFAULT PAGE ###############
//############################################

//////////////////////////////
////// HELPER FUNCTIONS //////
//////////////////////////////
import { isNullOrEmpty } from '../functions/helpers/isNullOrEmpty.js';

//////////////////////////////////////
////// RESULT SENDING FUNCTIONS //////
//////////////////////////////////////
import { resSendOk } from '../functions/resSend/resSendOk.js';

//////////////////////////////////
////// ENCRYPTION FUNCTIONS //////
//////////////////////////////////
import { decrypt } from '../functions/crypt/decrypt.js';

//////////////////////////
////// THIS HANDLER //////
//////////////////////////
export async function handleEmitEvent(req, res) {

  let outputResult = { qry: 0 };

  try {

    //////////////////////
    ////// CHECK SUBMITTED DATA //////
    //////////////////////
    const networkPassPhraseCrypted = req.body.networkPassPhrase;
    let eventID;
    let eventData;
    if (
      isNullOrEmpty(req.body.eventID)
      || isNullOrEmpty(req.body.eventData)
    ) {
      resSendOk(req, res, outputResult);
      return null;
    } else {
      eventID = req.body.eventID;
      eventData = req.body.eventData;
    }

    //////////////////////
    ////// CHECK NETWORK PASS PHRASE //////
    //////////////////////
    const networkPassPhrase = decrypt(networkPassPhraseCrypted, process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);
    if (networkPassPhrase !== process.env.NETWORK_SUPER_USER_PASSPHRASE) {
      resSendOk(req, res, outputResult);
      return null;
    }

    //////////////////////
    ////// EMIT SOCKET EVENT //////
    //////////////////////
    const webIOEmit = eventData;
    req.io.emit(eventID, webIOEmit);

    /////////////////
    ////// END //////
    /////////////////
    outputResult.qry = 1;
    resSendOk(req, res, outputResult);
    return null;

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    resSendOk(req, res, outputResult);

    return null;
  }
}

export default handleEmitEvent;