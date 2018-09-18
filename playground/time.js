const moment = require('moment');

// var date = new Date();
// console.log(date.toDateString());

var date = moment();
console.log(date.format('h:mm a'));