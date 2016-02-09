var db = require('./db')

module.exports = {

login: function(loginInputs) {
  return new Promise(function (resolve, reject) {
    var errors = [];
    db.loginUserName(req.body.userName).then(function(results) {
      if (!results) {
        errors.push('No such user name');
      }
      resolve({'errors': errors})
    })
  })
}
