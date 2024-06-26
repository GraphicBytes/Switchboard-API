//###############################################
//############### PUSH TO ADESTRA ###############
//###############################################

////////////////////////////////
////// DATA MODEL IMPORTS //////
////////////////////////////////
import { apiAccountsModel } from '../../models/apiAccountsModel.js';
import { apiPushQueueModel } from '../../models/apiPushQueueModel.js';

//////////////////////////////
////// FUNCTION IMPORTS //////
//////////////////////////////
import MessageFocus from '../adestra/MessageFocus.js'; 
import { decrypt } from '../../functions/crypt/decrypt.js';

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export async function pushAdestraData(thisID, thisPlatform, thisApiData) {

  try {

    await apiPushQueueModel.collection.updateOne({ _id: thisID }, { $set: { status: 1, } }, { upsert: true });

    const accountID = thisApiData.apiAccount;
    const workspaceID = thisApiData.workspaceID;
    const listID = thisApiData.listID;
    const valuePairs = thisApiData.valuePairs;

    await apiAccountsModel.findOne({ api_id: accountID, platform: thisPlatform })
      .limit(1)
      .exec(async function (err, obj) {
        if (err) {
          console.error(err);
        } else {

          const accountName = obj.account_data.account_name; 

          const userName = decrypt(obj.account_username, process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);

          const password = decrypt(obj.account_password, process.env.NETWORK_PRIMARY_ENCRYPTION_KEY);

          const attempts = obj.attempts + 1;

          new MessageFocus(accountName, userName, password).then(adestraConn => { 

            adestraConn.contact.create(workspaceID, valuePairs, { list_id: listID }, (err, contact) => {

              if (err === null) {

                apiPushQueueModel.collection.updateOne({ _id: thisID }, { $set: { status: 1, attempts: 99 } }, { upsert: true });

                //apiPushQueueModel.collection.deleteOne({ _id: thisID });
 
              } else {

                if (process.env.NODE_ENV === "development") {
                  console.error(err);
                }

                if (attempts > 5) {
                  apiPushQueueModel.collection.updateOne({ _id: thisID }, { $set: { status: 404, attempts: 999 } }, { upsert: true });
                } else {
                  apiPushQueueModel.collection.updateOne({ _id: thisID }, { $set: { status: 0, attempts: attempts } }, { upsert: true });
                }               

              }
            });
          });

        }
      });

    return null;
  } catch {
    return null;
  }

}

export default pushAdestraData;