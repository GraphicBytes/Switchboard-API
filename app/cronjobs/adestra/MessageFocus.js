//#####################################################
//############### ADRESTA MESSAGE FOCUS ###############
//#####################################################

/////////////////////////////////////
////// NODE & NPM DEPENDENCIES //////
/////////////////////////////////////
import xmlrpc from 'xmlrpc';

///////////////////////////
////// THIS FUNCTION //////
///////////////////////////
export default function MessageFocus(accountName, userName, password) {
  let client = null;

  this.methodCall = function (method, params, cb) {
    if (client === null) {
      client = xmlrpc.createClient({ url: process.env.ADESTRA_API_URL, basic_auth: { user: accountName + '.' + userName, pass: password } });
    }
    //console.log("DEBUG", method, params);
    client.methodCall(method, params, cb);
  };

  // Return a promise that resolves when all modules are loaded
  return Promise.all([
    import('./lib/workspace.js').then(workspaceModule => {
      this.workspace = workspaceModule.default(this); 
    }),
    import('./lib/project.js').then(projectModule => {
      this.project = projectModule.default(this); 
    }),
    import('./lib/contact.js').then(contactModule => {
      this.contact = contactModule.default(this); 
    }),
    import('./lib/campaign.js').then(campaignModule => {
      this.campaign = campaignModule.default(this); 
    }),
    import('./lib/transactional.js').then(transactionFactory => {
      this.transactional = transactionFactory.default(this); 
    }),
  ]).then(() => this); // Resolve the Promise with the instance of MessageFocus
};
