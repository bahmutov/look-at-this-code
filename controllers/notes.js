var Notes = require('../models/Note')();
var status = require('http-status');

exports.addNote = function addNote(req, res) {
  console.log('adding new note', req.body);

  Notes.new(req.body).store()
    .then(function (n) {
      console.log('stored new note', n);
      return res.status(status.OK).send();
    })
    .catch(function (err) {
      return res.status(status.INTERNAL_SERVER_ERROR).send(err);
    });

};
