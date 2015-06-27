var personData = require('./person_data.js');

personData.GetSQL("SELECT * FROM person").then(function (result) {
  console.log(result);
});
