var status = require('http-status');

exports.addNote = function addNote(req, res) {
  console.log('adding new note', req.body);
  return res.status(status.OK);
};
