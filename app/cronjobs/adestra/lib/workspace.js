//#################################################################
//############### ADRESTA WORKSPACE CLASS FUNCTIONS ###############
//#################################################################

/////////////////////////////////////
////// NODE & NPM DEPENDENCIES //////
/////////////////////////////////////
import _ from 'lodash';

///////////////////////////////////////
////// IN-LINE SUPPORT FUNCTIONS //////
///////////////////////////////////////
let client = null;

class Workspace {
  constructor(id, name, description, ownerUserId, colour) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerUserId = ownerUserId;
    this.colour = colour;
  }

  toString() {
    return `${this.id}) ${this.name}: ${this.description}`;
  }
}

const workspaceGet = (id, cb) => {
  id = Number(id);
  client.methodCall('workspace.get', [id], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, new Workspace(res.id, res.name, res.description, res.owner_user_id, res.colour));
  });
};

const workspaceAll = (cb) => {
  client.methodCall('workspace.all', [], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Workspace(w.id, w.name, w.description, w.owner_user_id, w.colour)));
  });
};

const workspaceSearch = (q, cb) => {
  let searchArgs = {};
  if (_.isNumber(q)) {
    searchArgs.owner_user_id = q;
  } else if (_.isString(q)) {
    searchArgs.name = q;
  } else {
    searchArgs = q;
  }
  client.methodCall('workspace.search', [searchArgs], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Workspace(w.id, w.name, w.description, w.owner_user_id, w.colour)));
  });
};

const workspaceCreate = (workspace, cb) => {
  let create = _.extend({}, workspace);
  create.owner_user_id = create.ownerUserId;
  delete create.ownerUserId;
  create = _.omit(create, (value, key) => key === 'id' || _.isNull(value) || _.isUndefined(value) || _.isFunction(value));

  client.methodCall('workspace.create', [create], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, new Workspace(res.id, res.name, res.description, res.owner_user_id, res.colour));
  });
};

const workspaceUpdate = (workspace, cb) => {
  if (_.isUndefined(workspace.id) || _.isNull(workspace.id)) return cb(new Error("The workspace has no ID"));
  const id = Number(workspace.id);

  let update = _.extend({}, workspace);
  update.owner_user_id = update.ownerUserId;
  delete update.ownerUserId;
  update = _.omit(update, (value, key) => key === 'id' || _.isNull(value) || _.isUndefined(value) || _.isFunction(value));

  client.methodCall('workspace.update', [id, update], (err) => {
    if (err) {
      return cb(err);
    }
    return cb(null, true);
  });
};

/////////////////////////
////// THIS MODULE //////
/////////////////////////
const workspaceModule = (parentClient) => {
  client = parentClient;
  return {
    Workspace,
    get: workspaceGet,
    all: workspaceAll,
    search: workspaceSearch,
    create: workspaceCreate,
    update: workspaceUpdate
  };
};

export default workspaceModule;
