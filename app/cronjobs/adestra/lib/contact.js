//###############################################################
//############### ADRESTA CONTACT CLASS FUNCTIONS ###############
//###############################################################

/////////////////////////////////////
////// NODE & NPM DEPENDENCIES //////
/////////////////////////////////////
import _ from 'lodash';

///////////////////////////////////////
////// IN-LINE SUPPORT FUNCTIONS //////
///////////////////////////////////////
let client = null;

class Contact {
  constructor(id, email) {
    this.id = id;
    this.email = email;
  }

  toString() {
    return this.email;
  }
}

const contactGet = (id, cb) => {
  id = Number(id);
  client.methodCall('contact.get', [id], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, new Contact(res.id, res.email));
  });
};

const contactSearch = (tableId, q, cb) => {
  let searchArgs = {};
  if (_.isString(q)) {
    searchArgs.email = q;
  } else {
    searchArgs = q;
  }
  client.methodCall('contact.search', [tableId, searchArgs], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Contact(w.id, w.email)));
  });
};

const contactCreate = (tableId, q, opts, cb) => {      

  client.methodCall('contact.create', [tableId, q, "email", opts], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Contact(w.id, w.email)));
  });
};

const contactTransactional = (contact, campaign, transactionData, cb) => {
  if (contact instanceof Contact) {
    contact = contact.id;
  }
  if (campaign instanceof client.campaign.Campaign) {
    campaign = campaign.id;
  }
  client.methodCall('contact.transactional', [contact, Number(campaign), transactionData], (err, res) => {
    return cb(err, res === 1);
  });
};

/////////////////////////
////// THIS MODULE //////
/////////////////////////
const contactModule = (parentClient) => {
  client = parentClient;
  return {
    Contact,
    get: contactGet,
    search: contactSearch,
    create: contactCreate,
    transactional: contactTransactional
  };
};

export default contactModule;
