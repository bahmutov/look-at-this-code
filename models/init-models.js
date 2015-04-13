var R = require('ramda');

function initModels(db) {
  return {
    User: require('./User')(db)
  };
};

module.exports = R.once(initModels);
