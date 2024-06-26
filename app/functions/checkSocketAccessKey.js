//#####################################################################
//############### CHECK ACCESS KEY ON SOCKET CONNECTION ###############
//#####################################################################

//////////////////////////////
////// FUNCTION IMPORTS //////
////////////////////////////// 
import { decrypt } from '../crypt/decrypt.js';
import { theEpochTime } from '../helpers/theEpochTime.js';
//import { theUserAgent } from '../helpers/theUserAgent.js';

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export function checkSocketAccessKey(accessKey, userAgent = null, eventName = null) {

  try {

    const accessKeyData = decrypt(accessKey, process.env.NETWORK_TOKEN_ENCRYPTION_KEY);

    if (accessKeyData) {

      const accessKey = JSON.parse(accessKeyData);

      const currentTime = theEpochTime();
      const tokenTime = parseInt(accessKey.created);
      const tokenTtl = parseInt(accessKey.ttl);

      let thisEventName = 0;
      let tokenEventID = 0;

      if (eventName !== null) {
        thisEventName = eventName;
        tokenEventID = accessKey.socket_event_id;
      }  

      if (accessKey.user_role === "super_user") { 
        return true;
      } else if (
        accessKey.token_type === "access"
        && accessKey.user_agent === userAgent
        && (currentTime - tokenTime) < tokenTtl
        && thisEventName === tokenEventID
      ) { 
        return true;

      } else { 

        if (process.env.NODE_ENV === "development") {
          console.log('socket connect without valid access token data');
        }

        return false;
      }

    } else {

      if (process.env.NODE_ENV === "development") {
        console.log('socket connect without valid access token');
      }

      return false;

    }


  } catch (err) {

    if (process.env.NODE_ENV === "development") {
      console.log(err);
    }

    return false;
  }
}