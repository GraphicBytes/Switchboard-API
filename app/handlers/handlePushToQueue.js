//#############################################################
//############### HANDLE PUSH API TO QUEUE FILE ###############
//#############################################################

////////////////////////////////
////// Data Model Imports //////
////////////////////////////////
import { apiPushQueueModel } from '../models/apiPushQueueModel.js';

//////////////////////////////
////// Function Imports //////
//////////////////////////////
import { resSendOk } from '../functions/resSend/resSendOk.js'; 
import { decrypt } from '../functions/crypt/decrypt.js';
import { logMalicious } from '../functions/malicious/logMalicious.js';
import { getPlatformData } from '../functions/getPlatformData.js';
import { theEpochTime } from '../functions/helpers/theEpochTime.js';
import { isNullOrEmpty } from '../functions/helpers/isNullOrEmpty.js';

//////////////////////////
////// THIS HANDLER //////
//////////////////////////
export async function handlePushToQueue(app, req, res) {

  try {

    let outputResult = { "status": 0 };

    if (process.env.NODE_ENV === "development") {
      console.log("API queue queue request triggered");
    }

    //##########################
    //##### SUBMITTED DATA #####
    //##########################

    //////////////////////
    ////// CHECK SUBMITTED DATA //////
    //////////////////////
    const { fromPlatform } = req.params;
    const networkPassPhraseCrypted = req.body.networkPassPhrase;
    const apiType = req.body.apiType;
    const queueData = req.body.queueData;
    if (
      isNullOrEmpty(fromPlatform)
      || isNullOrEmpty(apiType)
    ) {
      outputResult['msg'] = "INVALID DATA";
      logMalicious(req, "INVALID FORM DATA TRYING TO UPLOAD FILE");
      resSendOk(req, res, outputResult);
    }

    //////////////////////
    ////// CHECK NETWORK PASS PHRASE //////
    //////////////////////
    const networkPassPhrase = decrypt(networkPassPhraseCrypted, process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);
    if (networkPassPhrase !== process.env.NETWORK_SUPER_USER_PASSPHRASE) {
      logMalicious(req, "INVALID PLATFORM DATA TRYING TO PUSH API QUEUE");
      resSendOk(req, res, outputResult);
    }

    //////////////////////
    ////// CHECK PLATFORM //////
    //////////////////////
    let platformData = await getPlatformData(fromPlatform);
    if (!platformData) {
      logMalicious(req, "INVALID PLATFORM DATA TRYING TO PUSH API QUEUE");
      resSendOk(req, res, outputResult);
    }

    //////////////////////
    ////// Handle Request //////
    //////////////////////
    const currentTime = theEpochTime(); 
    
    if (process.env.NODE_ENV === "development") {
      console.log(queueData);
    }

    try {
      await apiPushQueueModel.create({
        platform: fromPlatform,
        api_type: apiType,
        request_time: currentTime,
        status: 0,
        attempts: 0,
        push_data: queueData
      });

      outputResult['status'] = 1;
      resSendOk(req, res, outputResult);

      return null;
    } catch (error) {
      console.error("Error creating document:", error);
      resSendOk(req, res, outputResult);
    }


    return null;

  } catch (error) {

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    return null;
  }
}

export default handlePushToQueue;