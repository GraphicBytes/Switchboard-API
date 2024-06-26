//#########################################
//############### CRON JOBS ###############
//#########################################

////////////////////////////////
////// DATA MODEL IMPORTS //////
////////////////////////////////
import { apiDataModel } from '../models/apiDataModel.js';
import { apiPushQueueModel } from '../models/apiPushQueueModel.js';

//////////////////////////////
////// FUNCTION IMPORTS //////
//////////////////////////////
import { theEpochTime } from '../functions/helpers/theEpochTime.js';

//////////////////////////////
////// CRON JOB IMPORTS //////
//////////////////////////////
import maliciousIpsCleanup from './jobs/maliciousIpsCleanup.js';
import maliciousUserAgentsCleanup from './jobs/maliciousUserAgentsCleanup.js';
import pushAdestraData from "./jobs/pushAdestraData.js"

///////////////////////////
////// CRON FUNCTION //////
///////////////////////////
export async function cronTasks() {

  let requestTime = theEpochTime();

  //// MALICIOUS IP CLEAN UP ////
  maliciousIpsCleanup();

  //// MALICIOUS USER AGENTS CLEAN UP ////
  maliciousUserAgentsCleanup();

  //// UPDATE LAST CRON TIME ////
  let filter = { meta_key: "last_cron" };
  let update = { $set: { meta_value: requestTime, } };
  let opts = { upsert: true };
  apiDataModel.collection.updateOne(filter, update, opts);

}

export const apiPush = async () => {
  try {
    apiPushQueueModel.findOne({ status: 0 })
      .sort({ request_time: 1 })
      .limit(1)
      .exec(function (err, obj) {
        if (err) {
          console.error(err);
        } else {

          if (obj) {

            const thisID = obj._id;
            const thisPlatform = obj.platform;
            const thisApiType = obj.api_type;
            const thisApiData = obj.push_data;

            if (thisApiType === "adestra" || thisApiType === "Adestra") {
              pushAdestraData(thisID, thisPlatform, thisApiData)
            }
          }
          
        }
      });

  } catch (error) {
    console.error('An error occurred while executing the tasks:', error);
  }
}