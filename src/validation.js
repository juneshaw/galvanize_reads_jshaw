var db = require('./db')

module.exports = {

login: function(loginInputs) {
  return new Promise(function (resolve, reject) {
    console.log('in validate.login');
    console.log('loginInputs: ', loginInputs.userName);
    var errors = [];
    db.userByName(loginInputs.userName).then(function(results) {
      console.log('results are of login validate: ', results);
      if (!results) {
        errors.push('No such user name');
      }
      resolve({'errors': errors});
    })
  })
}
}
