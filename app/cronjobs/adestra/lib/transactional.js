//#####################################################################
//############### ADRESTA TRANSACTIONAL CLASS FUNCTIONS ###############
//#####################################################################

/////////////////////////////////////
////// NODE & NPM DEPENDENCIES //////
/////////////////////////////////////
import _ from 'lodash';

///////////////////////////////////////
////// IN-LINE SUPPORT FUNCTIONS //////
///////////////////////////////////////
let client = null;

class Transaction {
  constructor() {
    this._contact = null;
    this._campaign = null;
    this._data = null;
  }

  contact = (contact) => {
    this._contact = contact;
    return this;
  };

  campaign = (campaign) => {
    this._campaign = campaign;
    return this;
  };

  data = (data) => {
    if (_.isObject(data)) {
      this._data = data;
    } else {
      throw new Error("Data must be an object");
    }
    return this;
  };

  launch = (cb) => {
    if (this._contact && this._campaign) {
      if (_.isString(this._contact)) {
        return client.contact.transactional({ email: this._contact }, this._campaign, this._data, cb);
      } else if (_.isObject(this._contact) || _.isNumber(this._contact)) {
        if (_.isObject(this._contact)) {
          this._contact = this._contact.id;
        }
        return client.contact.transactional(this._contact, this._campaign, this._data, cb);
      }
    } else {
      return cb(new Error("You must provide a contact id and campaign id"));
    }
  };
}

/////////////////////////
////// THIS MODULE //////
/////////////////////////
const transactionFactory = (parentClient) => {
  client = parentClient;
  return () => new Transaction();
};

export default transactionFactory;
