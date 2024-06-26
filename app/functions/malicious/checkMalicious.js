//########################################################
//############### CHECK MALICIOUS ACTIVITY ###############
//######################################################## 

////////////////////////////////
////// Data Model Imports //////
////////////////////////////////
import { maliciousIpsModel } from '../../models/maliciousIpsModel.js';
import { maliciousUserAgentsModel } from '../../models/maliciousUserAgentsModel.js';

//////////////////////////////
////// Function Imports //////
//////////////////////////////
import { sha256 } from '../crypt/sha256.js';
import { theUserIP } from '../helpers/theUserIP.js';
import { theUserAgent } from '../helpers/theUserAgent.js';

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export async function checkMalicious(req, platformData) {
  return new Promise((resolve) => {

    let userIP = theUserIP(req);
    let userAgent = theUserAgent(req);
    let toHash = userAgent + userIP;
    let userAgentHash = sha256(toHash); 

    if (userIP !== null && userIP !== "") {

      maliciousIpsModel.findOne({ ip: userIP }, function (err, obj) {

        if (obj) {

          var ipEvents = obj.attempts;
          if (ipEvents > parseInt(platformData.user_ip_block_threshold)) { 
            
            resolve(true);
            return null;

          } else {

            maliciousUserAgentsModel.findOne({ agent_hash: userAgentHash }, function (err, obj) {

              if (obj) {
                var agentEvents = obj.attempts;
                if (agentEvents > parseInt(platformData.user_agent_block_threshold)) { 

                  resolve(true);  
                  return null; 
                  
                } else {
                  resolve(false);
                  return null;
                }
              } else {
                resolve(false);
                return null;
              }
            });

          }
        } else {

          maliciousUserAgentsModel.findOne({ agent_hash: userAgentHash }, function (err, obj) {

            if (obj) {
              var agentEvents = obj.attempts;
              if (agentEvents > parseInt(platformData.user_agent_block_threshold)) { 

                resolve(true);
                return null;
                
              } else {
                resolve(false);
                return null;
              }
            } else {
              resolve(false);
              return null;
            }
          });

        }
      });


    } else {
      resolve(false);
      return null;
    }

  });
}