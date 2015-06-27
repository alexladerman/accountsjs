'use strict';

var Data = require(__dirname + '/data.js');
var dbConnection = require('./connection');

var ClassData = new Data('person', 'person_id');

module.exports = ClassData;


// module.exports.ListAllWithApplicationId = function (applicationId) {
//     var sql = 'SELECT n.* ' +
//         'FROM notifications n ' +
//         'JOIN notificationServices ns ON ns.notificationServiceId = n.notificationServiceId ' +
//         'WHERE ns.applicationId = ? ' +
//         'ORDER BY tsCreation DESC LIMIT 10000';
//
//     return dbConnection.query(sql, applicationId);
// };
//
//
// module.exports.ListAllWithApplicationIdAndDeviceToken = function (applicationId, deviceToken) {
//     var sql ='SELECT n.* ' +
//         'FROM notifications n ' +
//         'JOIN notificationServices ns ON ns.notificationServiceId = n.notificationServiceId ' +
//         'WHERE ns.applicationId = ? AND n.deviceToken = ? ' +
//         'ORDER BY tsCreation DESC LIMIT 10000';
//
//     return dbConnection.query(sql, [applicationId, deviceToken]);
// };
