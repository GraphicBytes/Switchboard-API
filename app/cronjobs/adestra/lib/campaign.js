//################################################################
//############### ADRESTA CAMPAIGN CLASS FUNCTIONS ###############
//################################################################

/////////////////////////////////////
////// NODE & NPM DEPENDENCIES //////
/////////////////////////////////////
import _ from 'lodash';

///////////////////////////////////////
////// IN-LINE SUPPORT FUNCTIONS //////
///////////////////////////////////////

let client = null;

class Campaign {
  constructor(id, projectId, name, description, ownerUserId, colour) {
    this.id = id;
    this.projectId = projectId;
    this.name = name;
    this.description = description;
    this.ownerUserId = ownerUserId;
    this.colour = colour;
  }

  toString() {
    return `${this.id}) ${this.name}: ${this.description}`;
  }
}

const campaignGet = (id, cb) => {
  id = Number(id);
  client.methodCall('campaign.get', [id], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, new Campaign(res.id, res.project_id, res.name, res.description, res.owner_user_id, res.colour));
  });
};

const campaignAll = (cb) => {
  client.methodCall('campaign.all', [], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Campaign(w.id, w.project_id, w.name, w.description, w.owner_user_id, w.colour)));
  });
};

const campaignSearch = (q, cb) => {
  let searchArgs = {};
  if (_.isNumber(q)) {
    searchArgs.owner_user_id = q;
  } else if (_.isString(q)) {
    searchArgs.name = q;
  } else {
    searchArgs = q;
  }
  client.methodCall('campaign.search', [searchArgs], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Campaign(w.id, w.project_id, w.name, w.description, w.owner_user_id, w.colour)));
  });
};

const campaignCreate = (campaign, cb) => {
  let create = _.extend({}, campaign);
  create.owner_user_id = create.ownerUserId;
  delete create.ownerUserId;
  create.project_id = create.projectId;
  delete create.projectId;
  create = _.omit(create, (value, key) => key === 'id' || _.isNull(value) || _.isUndefined(value) || _.isFunction(value));

  client.methodCall('campaign.create', [create], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, new Campaign(res.id, res.project_id, res.name, res.description, res.owner_user_id, res.colour));
  });
};

const campaignUpdate = (campaign, cb) => {
  if (_.isUndefined(campaign.id) || _.isNull(campaign.id)) return cb(new Error("The campaign has no ID"));
  const id = Number(campaign.id);

  let update = _.extend({}, campaign);
  update.owner_user_id = update.ownerUserId;
  delete update.ownerUserId;
  update.project_id = update.projectId;
  delete update.projectId;
  update = _.omit(update, (value, key) => key === 'id' || _.isNull(value) || _.isUndefined(value) || _.isFunction(value));

  client.methodCall('campaign.update', [id, update], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, res === 1);
  });
};


/////////////////////////
////// THIS MODULE //////
/////////////////////////
const campaignModule = (parentClient) => {
  client = parentClient;
  return {
    Campaign,
    get: campaignGet,
    all: campaignAll,
    search: campaignSearch,
    create: campaignCreate,
    update: campaignUpdate
  };
};

export default campaignModule;
