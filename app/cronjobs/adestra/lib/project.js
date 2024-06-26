//###############################################################
//############### ADRESTA PROJECT CLASS FUNCTIONS ###############
//###############################################################

/////////////////////////////////////
////// NODE & NPM DEPENDENCIES //////
/////////////////////////////////////
import _ from 'lodash';

///////////////////////////////////////
////// IN-LINE SUPPORT FUNCTIONS //////
///////////////////////////////////////
let client = null;

class Project {
  constructor(id, workspace, name, description, ownerUserId, colour) {
    this.id = id;
    this.workspace = workspace;
    this.name = name;
    this.description = description;
    this.ownerUserId = ownerUserId;
    this.colour = colour;
  }

  toString() {
    return `${this.id}) ${this.name}: ${this.description}`;
  }
}

const projectGet = (id, cb) => {
  id = Number(id);
  client.methodCall('project.get', [id], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, new Project(res.id, res.workspace_id, res.name, res.description, res.owner_user_id, res.colour));
  });
};

const projectAll = (cb) => {
  client.methodCall('project.all', [], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Project(w.id, w.workspace_id, w.name, w.description, w.owner_user_id, w.colour)));
  });
};

const projectSearch = (q, cb) => {
  let searchArgs = {};
  if (_.isNumber(q)) {
    searchArgs.owner_user_id = q;
  } else if (_.isString(q)) {
    searchArgs.name = q;
  } else {
    searchArgs = q;
  }
  client.methodCall('project.search', [searchArgs], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, _.map(res, (w) => new Project(w.id, w.workspace_id, w.name, w.description, w.owner_user_id, w.colour)));
  });
};

const projectCreate = (project, cb) => {
  let create = _.extend({}, project);
  create.owner_user_id = create.ownerUserId;
  delete create.ownerUserId;
  create.workspace_id = create.workspace;
  delete create.workspace;
  create = _.omit(create, (value, key) => key === 'id' || _.isNull(value) || _.isUndefined(value) || _.isFunction(value));

  client.methodCall('project.create', [create], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, new Project(res.id, res.workspace_id, res.name, res.description, res.owner_user_id, res.colour));
  });
};

const projectUpdate = (project, cb) => {
  if (_.isUndefined(project.id) || _.isNull(project.id)) return cb(new Error("The project has no ID"));
  const id = Number(project.id);

  let update = _.extend({}, project);
  update.owner_user_id = update.ownerUserId;
  delete update.ownerUserId;
  update.workspace_id = update.workspace;
  delete update.workspace;
  update = _.omit(update, (value, key) => key === 'id' || _.isNull(value) || _.isUndefined(value) || _.isFunction(value));

  client.methodCall('project.update', [id, update], (err, res) => {
    if (err) {
      return cb(err);
    }
    return cb(null, res === 1);
  });
};

/////////////////////////
////// THIS MODULE //////
/////////////////////////
const projectModule = (parentClient) => {
  client = parentClient;
  return {
    Project,
    get: projectGet,
    all: projectAll,
    search: projectSearch,
    create: projectCreate,
    update: projectUpdate
  };
};

export default projectModule;
