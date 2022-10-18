//МОДУЛИ
const cfg = require("./cfg");
const sql = require("./sql");
const func = require("./func");
const textdata = require("./textdata");

//ТОКЕН БОТА
const token = cfg.bottoken;

//БИБЛИОТЕКИ
const TelegramBot = require('node-telegram-bot-api');

//КОНСТЫ
const bot = new TelegramBot(token, {
  polling: true
});

//МАССИВЫ
const activeusers = []
const waitanswerusers1 = []
const alluniversities = []

//ЗАПУСК
try {
  async function alluniversitiesunready() {
    let request = await sql.selectalluniversities()
    if ((request == 'none') || (request == null)) return;
    request.forEach(function(unvr) {
      alluniversities.push(unvr['name'])
    })
  }
  alluniversitiesunready()
} catch (err) {

}
//ХУКИ-------------------------------------------------------------------------
//КОМАНДЫ

//+++++++++++++++++++++++++++++++++++++++++++++

bot.onText(/\/start/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (func.finditeminarray(waitanswerusers1, msg.chat.id) !== undefined) return;
  try {
    const result = await sql.checkuserprofile(msg.chat.id);
    if (result['paccept'] == 1) {
      const opts = {
        "reply_markup": {
          "inline_keyboard": [
            [{
                "text": textdata.listofevents,
                "callback_data": "calllistofevents"
              },
              {
                "text": textdata.mylistofevents,
                "callback_data": "callmylistofevents"
              }
            ]
          ]
        }
      }
      bot.sendMessage(chatId, textdata.hello, opts);
    } else {
      const opts = {
        "reply_markup": {
          "inline_keyboard": [
            [{
              "text": textdata.hellob1,
              "callback_data": "hellosendprodile"
            }]
          ]
        }
      }
      bot.sendMessage(chatId, textdata.hello, opts);
    }
  } catch (err) {
    console.error(err);
  }
});

//+++++++++++++++++++++++++++++++++++++++++++++

bot.onText(/\/profile_accept/, async (msg, match) => {
  const chatId = msg.chat.id;
  let inputmassive = match['input'].toLowerCase().split("_")
  if ((inputmassive[2] == "")) return bot.sendMessage(chatId, textdata.adminreqacceptbug);

  try {
    const result = await sql.checkuserprofile(msg.chat.id);
    if (result['role'] == 'admin') {
      const result2 = await sql.checkuserrequest(inputmassive[2])
      if (result2 == 'none') {
        bot.sendMessage(chatId, textdata.adminreqisnull);
      } else {
        await sql.acceptrequest(inputmassive[2])
        const opts = {
          "reply_markup": {
            "inline_keyboard": [
              [{
                "text": textdata.backb,
                "callback_data": "backtomainmenu"
              }]
            ]
          }
        }
        bot.sendMessage(inputmassive[2], textdata.reqwasaccepted, opts);
        bot.sendMessage(chatId, textdata.adminreqwasaccepted + inputmassive[2])
      }
    } else {

    }
  } catch (err) {
    console.error(err);
  }

});

//+++++++++++++++++++++++++++++++++++++++++++++

bot.onText(/\/profile_cancel/, async (msg, match) => {
  const chatId = msg.chat.id;
  let inputmassive = match['input'].toLowerCase().split("_")
  if ((inputmassive[2] == "")) return bot.sendMessage(chatId, textdata.adminreqacceptbug);
  try {
    const result = await sql.checkuser(msg.chat.id);
    if (result['role'] == 'admin') {
      const result2 = await sql.checkuserrequest(inputmassive[2])
      if (result2 == 'none') {
        bot.sendMessage(chatId, textdata.adminreqisnull);
      } else {
        await sql.cancelrequest(inputmassive[2])
        bot.sendMessage(inputmassive[2], textdata.reqnotaccepted + match['input'].replace("\/profile_cancel_" + inputmassive[2] + "_ ", ''))
        bot.sendMessage(chatId, textdata.adminreqwascanceled + inputmassive[2] + textdata.adminreqwascanceled2 + match['input'].replace("\/profile_cancel_" + inputmassive[2] + "_ ", ''))
      }
    } else {

    }
  } catch (err) {
    console.error(err);
  }

});

//+++++++++++++++++++++++++++++++++++++++++++++

bot.onText(/\/evi/, async (msg, match) => {
  const chatId = msg.chat.id;
  let inputmassive = match['input'].toLowerCase().split("_")
  if ((inputmassive[1] == "")) return bot.sendMessage(chatId, textdata.eventinfosearchbug);

  try {
    const result = await sql.selectevent(inputmassive[1]);
    if (result == "none") {} else {
      let eventlisttext = "\n\n" + result['title'] + "\n" + result['desc'] + "...\nОрганизатор: " + result['author'] + "\nID: " + result['id']
      bot.sendMessage(chatId, eventlisttext)
    }
  } catch (err) {
    console.error(err);
  }

});

//+++++++++++++++++++++++++++++++++++++++++++++

//КОЛБЭКИ
bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  let opts;
  let text;

  // ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\
  if (action === 'backtomainmenu') {
    if (func.finditeminarray(waitanswerusers1, msg.chat.id) !== undefined) {
      waitanswerusers1.splice(find, 1);
    }
    try {
      const result = await sql.checkuserprofile(msg.chat.id);
      if (result['paccept'] == 1) {
        const opts = {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          "reply_markup": {
            "inline_keyboard": [
              [{
                  "text": textdata.listofevents,
                  "callback_data": "calllistofevents"
                },
                {
                  "text": textdata.mylistofevents,
                  "callback_data": "callmylistofevents"
                }
              ]
            ]
          }
        }
        bot.editMessageText(textdata.hello, opts);
      } else {
        const opts = {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          "reply_markup": {
            "inline_keyboard": [
              [{
                "text": textdata.hellob1,
                "callback_data": "hellosendprodile"
              }]
            ]
          }
        }
        bot.editMessageText(textdata.hello, opts);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\ВЕРНУТЬСЯ НАЗАД В МЕНЮ\

  // ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\
  if (action === 'hellosendprodile') {
    text = textdata.reqnoneprofile;
    opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      "reply_markup": {
        "inline_keyboard": [
          [{
            "text": textdata.backb,
            "callback_data": "backtomainmenu"
          }]
        ]
      },
    };

    try {
      const result = await sql.checkuserrequest(msg.chat.id);
      if (result == "none") {
        const result2 = await sql.checkuserprofile(msg.chat.id);
        if (result2['paccept'] == 1) return bot.editMessageText(textdata.reqprofileaccepted, opts);
        if (result2 == "none" || result2['name'] == null || result2['fam'] == null || result2['age'] == null || result2['osebe'] == null || result2['univer'] == null || result2['curs'] == null || result2['name'] == 'null' || result2['fam'] == 'null' || result2['age'] == 'null' || result2['osebe'] == 'null' || result2['univer'] == 'null' || result2['curs'] == 'null') {
          opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            "reply_markup": {
              "inline_keyboard": [
                [{
                    "text": textdata.profilequeststart,
                    "callback_data": "profilequeststart"
                  },
                  {
                    "text": textdata.backb,
                    "callback_data": "backtomainmenu"
                  }
                ]
              ]
            },
          };
          bot.editMessageText(textdata.reqnoneprofile, opts);
        } else {
          bot.editMessageText(textdata.reqaccept, opts);
          try {
            await sql.senduserrequest(msg.chat.id, result2['name'], result2['fam'], result2['otch'], result2['age'], result2['univer'], result2['curs'], result2['osebe']);
            const result3 = await sql.selectalladminsforunik("admin", result2['univer']);
            for (admincount in result3) {
              bot.sendMessage(result3[admincount]['tgid'], "НОВАЯ ЗАЯВКА\n\nОт: @" + msg.chat.username + textdata.lname + result2['name'] + textdata.lfam + result2['fam'] + textdata.lotc + result2['otch'] + textdata.lage + result2['age'] + textdata.lunver + result2['univer'] + textdata.lcurs + result2['curs'] + textdata.losebe + result2['osebe'] + "\n\nЧтобы принять заявку:\n/profile_accept_" + result2['tgid'] + "_\nЧтобы отклонить заявку:\n/profile_cancel_" + result2['tgid'] + "_ причина")
            }
            bot.sendMessage(result2['tgid'], "ВАША ЗАЯВКА\n" + textdata.lname + result2['name'] + textdata.lfam + result2['fam'] + textdata.lotc + result2['otch'] + textdata.lage + result2['age'] + textdata.lunver + result2['univer'] + textdata.lcurs + result2['curs'] + textdata.losebe + result2['osebe'])
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        bot.editMessageText(textdata.reqcancel, opts);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\ОТПРАВИТЬ ЗАЯВКУ\

  // ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\
  if (action === 'profilequeststart') {
    text = textdata.profileready;
    opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      "reply_markup": {
        "inline_keyboard": [
          [{
              "text": textdata.backb,
              "callback_data": "backtomainmenu"
            },
            {
              "text": textdata.profilenextb,
              "callback_data": "profilequeststart"
            }
          ]
        ]
      },
    };

    try {
      const result = await sql.checkuserprofile(msg.chat.id);
      if (result == "none") {} else if (result['name'] == null || result['name'] == 'null') {
        text = textdata.profilesetupname;
        bot.editMessageText(text, opts);
        waitanswerusers1.push([msg.chat.id, "1"])
      } else if (result['age'] == null || result['age'] == 'null') {
        text = textdata.profilesetupage;
        bot.editMessageText(text, opts);
        waitanswerusers1.push([msg.chat.id, "2"])
      } else if (result['osebe'] == null || result['osebe'] == 'null') {
        text = textdata.profilesetuposebe;
        bot.editMessageText(text, opts);
        waitanswerusers1.push([msg.chat.id, "3"])
      } else if (result['univer'] == null || result['univer'] == 'null') {
        text = textdata.profilesetupuniver;
        bot.editMessageText(text, opts);
        waitanswerusers1.push([msg.chat.id, "4"])
      } else if (result['curs'] == null || result['curs'] == 'null') {
        text = textdata.profilesetupcurs;
        bot.editMessageText(text, opts);
        waitanswerusers1.push([msg.chat.id, "5"])
      } else {
        opts = {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          "reply_markup": {
            "inline_keyboard": [
              [{
                  "text": textdata.backb,
                  "callback_data": "backtomainmenu"
                },
                {
                  "text": textdata.hellob1,
                  "callback_data": "hellosendprodile"
                }
              ]
            ]
          },
        };
        bot.editMessageText(text, opts);
      }
    } catch (err) {
      console.error(err);
    }
  }
  // ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\ЗАПОЛНЕНИЕ ПРОФИЛЯ\

  // МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\
  if (action === 'callmylistofevents') {
    text = "МОИ ИВЕНТЫ";
    opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      "reply_markup": {
        "inline_keyboard": [
          [{
            "text": textdata.backb,
            "callback_data": "backtomainmenu"
          }]
        ]
      },
    };

    try {
      const result = await sql.checkuserprofile(msg.chat.id);
      if (result == "none") {

      } else {

      }
    } catch (err) {
      console.error(err);
    }
    bot.editMessageText(text, opts);
  }
  // МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\МОИМЕРОПРИЯТИЯ\

  // МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\
  if (action === 'calllistofevents') {
    text = "ИВЕНТЫ ";

    eventlisttext = ""
    try {
      const result = await sql.selectallevents();
      const user = await sql.checkuserprofile(msg.chat.id);
      text += user['univer']
      opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        "reply_markup": {
          "inline_keyboard": [
            func.createinfoevbuttons(result, user),
            [{
              "text": textdata.backb,
              "callback_data": "backtomainmenu"
            }, ]
          ]
        }
      };
      if (result == "none") {} else {
        for (event in result) {
          if (result[event]['univer'] == user['univer']) {
            eventlisttext += "\n\n" + result[event]['title'] + "\n" + result[event]['desc'].slice(0, 16) + "...\nОрганизатор: " + result[event]['author'] + "\nПодробнее: /evi_" + result[event]['id'] + " (клик)" + "\nДата начала: " + result[event]['date']
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
    bot.editMessageText(text + eventlisttext, opts);
  }
  // МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\

  // МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\#2#2#2#2#2#2#2#2#2#2#2#2#2
  try {
    const result = await sql.selectallevents();
    const user = await sql.checkuserprofile(msg.chat.id);
    for (let i = 0; i < result.length; i++) {
      {
        if (action == "selectevent" + result[i]['id']) {
          let eventlisttext = "\n\n" + result[i]['title'] + "\n" + result[i]['desc'] + "...\nОрганизатор: " + result[i]['author'] + "\nID: " + result[i]['id'];
          opts = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            "reply_markup": {
              "inline_keyboard": [
                [{
                  "text": textdata.backb,
                  "callback_data": "backtomainmenu"
                }]
              ]
            },
          };
          bot.editMessageText(eventlisttext, opts)
        }
      }
    }
  } catch (err) {

  }


  // МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\МЕРОПРИЯТИЯ\#2#2#2#2#2#2#2#2#2#2#2#2#2

});

//СООБЩЕНИЯ
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  //НАЧАЛО ХУКА ДЛЯ СБОРКА СООБЩЕНИЙ/НАЧАЛО ХУКА ДЛЯ СБОРКА СООБЩЕНИЙ/НАЧАЛО ХУКА ДЛЯ СБОРКА СООБЩЕНИЙ/НАЧАЛО ХУКА ДЛЯ СБОРКА СООБЩЕНИЙ/НАЧАЛО ХУКА ДЛЯ СБОРКА СООБЩЕНИЙ
  find = func.finditeminarray(waitanswerusers1, msg.chat.id)
  if (find !== undefined) {
    opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      "reply_markup": {
        "inline_keyboard": [
          [{
              "text": textdata.backb,
              "callback_data": "backtomainmenu"
            },
            {
              "text": textdata.hellob1,
              "callback_data": "hellosendprodile"
            }
          ]
        ]
      },
    };
    try {
      const userprofile = await sql.checkuserprofile(msg.chat.id);
      if (waitanswerusers1[find][1] == "1") {

        let inputmassive = msg.text.toLowerCase().split(" ")
        if (inputmassive[0] == "") return bot.sendMessage(chatId, textdata.nonename);

        try {
          await sql.updateprofilename(msg.chat.id, inputmassive[0][0].toUpperCase() + inputmassive[0].slice(1), inputmassive[1][0].toUpperCase() + inputmassive[1].slice(1), inputmassive[2][0].toUpperCase() + inputmassive[2].slice(1));
          if (userprofile['age'] == null || userprofile['age'] == 'null') {
            bot.sendMessage(chatId, textdata.setedname + inputmassive[0][0].toUpperCase() + inputmassive[0].slice(1) + " " + inputmassive[1][0].toUpperCase() + inputmassive[1].slice(1) + " " + inputmassive[2][0].toUpperCase() + inputmassive[2].slice(1) + "\n\n" + textdata.profilesetupage)
          } else if (userprofile['osebe'] == null || userprofile['osebe'] == 'null') {
            bot.sendMessage(chatId, textdata.setedname + inputmassive[0][0].toUpperCase() + inputmassive[0].slice(1) + " " + inputmassive[1][0].toUpperCase() + inputmassive[1].slice(1) + " " + inputmassive[2][0].toUpperCase() + inputmassive[2].slice(1) + "\n\n" + textdata.profilesetuposebe)
          } else if (userprofile['univer'] == null || userprofile['univer'] == 'null') {
            bot.sendMessage(chatId, textdata.setedname + inputmassive[0][0].toUpperCase() + inputmassive[0].slice(1) + " " + inputmassive[1][0].toUpperCase() + inputmassive[1].slice(1) + " " + inputmassive[2][0].toUpperCase() + inputmassive[2].slice(1) + "\n\n" + textdata.profilesetupuniver)
          } else if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
            bot.sendMessage(chatId, textdata.setedname + inputmassive[0][0].toUpperCase() + inputmassive[0].slice(1) + " " + inputmassive[1][0].toUpperCase() + inputmassive[1].slice(1) + " " + inputmassive[2][0].toUpperCase() + inputmassive[2].slice(1) + "\n\n" + textdata.profilesetupcurs)
          } else {
            bot.sendMessage(chatId, textdata.setedname + inputmassive[0][0].toUpperCase() + inputmassive[0].slice(1) + " " + inputmassive[1][0].toUpperCase() + inputmassive[1].slice(1) + " " + inputmassive[2][0].toUpperCase() + inputmassive[2].slice(1) + "\n\n" + textdata.profileready, opts)
          }
        } catch (err) {
          console.error(err);
        }
        waitanswerusers1.splice(find, 1);
        if (userprofile['age'] == null || userprofile['age'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "2"])
        } else if (userprofile['osebe'] == null || userprofile['osebe'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "3"])
        } else if (userprofile['univer'] == null || userprofile['univer'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "4"])
        } else if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "5"])
        }

      } else if (waitanswerusers1[find][1] == "2") {

        let inputmassive = msg.text.toLowerCase()
        if ((inputmassive == "") || isNaN(inputmassive) || (100 < inputmassive) || (1 > inputmassive)) return bot.sendMessage(chatId, textdata.noneage);
        try {
          await sql.updateprofileage(msg.chat.id, inputmassive);
          if (userprofile['osebe'] == null || userprofile['osebe'] == 'null') {
            bot.sendMessage(chatId, textdata.setedage + inputmassive + "\n\n" + textdata.profilesetuposebe)
          } else if (userprofile['univer'] == null || userprofile['univer'] == 'null') {
            bot.sendMessage(chatId, textdata.setedage + inputmassive + "\n\n" + textdata.profilesetupuniver)
          } else if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
            bot.sendMessage(chatId, textdata.setedage + inputmassive + "\n\n" + textdata.profilesetupcurs)
          } else {
            bot.sendMessage(chatId, textdata.setedage + inputmassive + "\n\n" + textdata.profileready, opts)
          }
        } catch (err) {
          console.error(err);
        }
        waitanswerusers1.splice(find, 1);
        if (userprofile['osebe'] == null || userprofile['osebe'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "3"])
        } else if (userprofile['univer'] == null || userprofile['univer'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "4"])
        } else if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "5"])
        }

      } else if (waitanswerusers1[find][1] == "3") {

        let inputmassive = msg.text.toLowerCase()
        if ((inputmassive == "")) return bot.sendMessage(chatId, textdata.nonedesc);
        if ((inputmassive.length > cfg.maxosebe)) return bot.sendMessage(chatId, textdata.nonedesc)

        try {
          await sql.updateprofiledesc(msg.chat.id, inputmassive);
          if (userprofile['univer'] == null || userprofile['univer'] == 'null') {
            bot.sendMessage(chatId, textdata.setedosebe + inputmassive + "\n\n" + textdata.profilesetupuniver)
          } else if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
            bot.sendMessage(chatId, textdata.setedosebe + inputmassive + "\n\n" + textdata.profilesetupcurs)
          } else {
            bot.sendMessage(chatId, textdata.setedosebe + inputmassive + "\n\n" + textdata.profileready, opts)
          }
        } catch (err) {
          console.error(err);
        }
        waitanswerusers1.splice(find, 1);
        if (userprofile['univer'] == null || userprofile['univer'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "4"])
        } else if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
          waitanswerusers1.push([msg.chat.id, "5"])
        }

      } else if (waitanswerusers1[find][1] == "4") {

        let inputmassive = msg.text.toUpperCase()

        if (alluniversities.indexOf(inputmassive) != -1) {
          try {
            await sql.updateprofileuniver(msg.chat.id, inputmassive);
            waitanswerusers1.splice(find, 1);
            if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
              bot.sendMessage(chatId, textdata.seteduniver + inputmassive + "\n\n" + textdata.profilesetupcurs)
            } else {
              bot.sendMessage(chatId, textdata.seteduniver + inputmassive + "\n\n" + textdata.profileready, opts)
            }
            if (userprofile['curs'] == null || userprofile['curs'] == 'null') {
              waitanswerusers1.push([msg.chat.id, "5"])
            }
          } catch (err) {}
        } else {
          let suggest = ""
          alluniversities.forEach(function(unvr) {
            if (unvr[0].toLowerCase() == inputmassive[0].toLowerCase()) {
              suggest += "\n" + unvr
            } else if (unvr.toLowerCase() == inputmassive.toLowerCase().match(unvr.toLowerCase())) {
              suggest += "\n" + unvr
            } else if (unvr.length == inputmassive.length) {
              suggest += "\n" + unvr
            } else if (unvr.toLowerCase().indexOf(inputmassive.toLowerCase()) != -1) {
              suggest += "\n" + unvr
            }
          })
          bot.sendMessage(chatId, textdata.foundunivers + suggest)
        }

      } else if (waitanswerusers1[find][1] == "5") {

        let inputmassive = msg.text.toLowerCase()
        if ((inputmassive == "") || isNaN(inputmassive) || (7 < inputmassive) || (1 > inputmassive)) return bot.sendMessage(chatId, textdata.nonecurs);

        try {
          await sql.updateprofilecurs(msg.chat.id, inputmassive);
        } catch (err) {
          console.error(err);
        }
        waitanswerusers1.splice(find, 1);
        bot.sendMessage(chatId, textdata.setedcurs + inputmassive + "\n\n" + textdata.profileready, opts)
      }
    } catch (err) {
      console.error(err)
    }
  }
  //КОНЕЦ ХУКОВ ДЛЯ СБОРА СООБЩЕНИЙ/КОНЕЦ ХУКОВ ДЛЯ СБОРА СООБЩЕНИЙ/КОНЕЦ ХУКОВ ДЛЯ СБОРА СООБЩЕНИЙ/КОНЕЦ ХУКОВ ДЛЯ СБОРА СООБЩЕНИЙ/КОНЕЦ ХУКОВ ДЛЯ СБОРА СООБЩЕНИЙ
  //+++++++++++++++++++++++++++++++++++++++++++++
  //РЕГИСТРАЦИЯ АКТИВНЫХ ПОЛЬЗОВАТЕЛЕЙ

  if (activeusers.indexOf(msg.chat.id) != -1) return;

  try {
    const result = await sql.checkuserprofile(msg.chat.id);
    if (result == "none") {
      sql.addusertobaseprofile(msg.chat.id)
      activeusers.push(msg.chat.id)
    } else {
      activeusers.push(msg.chat.id)
    }
  } catch (err) {
    console.error(err);
  }

});
//ХУКИ-------------------------------------------------------------------------