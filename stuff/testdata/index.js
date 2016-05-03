var deckData = require('./deckdata.js');

deckData.ListAll().then(function (result) {
 deck = result;
 console.log(result);
 });
