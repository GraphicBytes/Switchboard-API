//##########################################################
//############### GET PLATFORM DATA FUNCTION ###############
//########################################################## 

////////////////////////////////
////// Data Model Imports //////
////////////////////////////////
import { platformsModel } from '../models/platformsModel.js';

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export async function getPlatformData(platform) { 

  return new Promise((resolve) => { 

    platformsModel.findOne({ platform: platform }, function (err, obj) {

      if (obj) { 

        resolve(obj.data);
        return null;

      } else { 

        resolve(false);
        return null;
      }
    });
  });
}
