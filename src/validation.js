var db = require('./db')

module.exports = {

login: function(loginInputs) {
  return new Promise(function (resolve, reject) {
    console.log('in validate.login');
    var errors = [];
    db.user(loginInputs.userName).then(function(results) {
      if (!results) {
        errors.push('No such user name');
      }
      resolve({'errors': errors});
    })
  })
}
}
