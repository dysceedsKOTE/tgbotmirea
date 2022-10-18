//МОДУЛИ
const sql = require("./sql");

//ВСЕ ФУНКЦИИ БОТА
module.exports.finditeminarray = function(arr, value) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i][0] == value)
      return i;
}

module.exports.getTimeStamp = function() {
  var now = new Date();
  return ((now.getDate()) + '/' + (now.getMonth() + 1) + '/' + now.getFullYear() + " " + now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
}

module.exports.createinfoevbuttons = function(result, user) {
  let send = [];
  for (let i = 0; i < result.length; i++) {
    if (result[i]['univer'] == user['univer']) {
      send.push({
        "text": i + 1,
        "callback_data": "selectevent" + result[i]['id']
      })
    }
  }
  return send;
}