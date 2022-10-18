//ТУТ ВЕСЬ ТЕКСТ ЧТО ОТПРАВЛЯЕТ БОТ
//КНОПКИ
module.exports.backb = "<--"
module.exports.hellob1 = "Отправить заявку"
module.exports.profilequeststart = "Я предоставлю"
module.exports.profilenextb = "Установил(а)"
module.exports.listofevents = "Мероприятия"
module.exports.mylistofevents = "Мои мероприятия"

//ОСНОВНОЙ
module.exports.hello = "Основная информация\nБот находится в режиме разработки"

//МОДУЛИ
const cfg = require("./cfg");

//РЕКВЕСТЫ
module.exports.reqcancel = "Вы уже отправили заявку, вам следует дождаться решения по ней, прежде чем снова подавать заявку."
module.exports.reqaccept = "Ваша заявка отправлена и теперь находится на рассмотрении, пока вашу заявку не примут/отклонят вы не сможете подать новую заявку."
module.exports.reqnoneprofile = "Для того чтобы отправить заявку вам необходимо предоставить информацию о себе, дабы мы могли с вами работать."
module.exports.reqprofileaccepted = "Вы уже прошли процесс верификации."
module.exports.reqnotaccepted = "Вашу заявку отклонил администратор по причине:\n"
module.exports.reqwasaccepted = "Поздравляем! Ваша заявка была успешно одобрена и теперь вам официально доступны функции бота."

//ПРОФИЛЬ
module.exports.profilesetupname = "Для начало хотелось бы узнать как вас зовут, будьте добры введите: Ф И О (через пробел)."
module.exports.profilesetupfam = "У вас не установлена фамилия, будьте добры введите:\n/profile_name Ф И О (через пробел)."
module.exports.profilesetupage = "Уточните ваш возраст: 1-100."
module.exports.profilesetuposebe = "Расскажите нменого о себе, можете прикрепить ссылки на дополнительные материалы, будьте добры напишите: О себе (" + cfg.maxosebe + " символа)."
module.exports.profilesetupuniver = "Укажите ваш университет."
module.exports.profilesetupcurs = "Укажите ваш курс: 1-6."
module.exports.profileready = "Ваш профиль готов для отправки заявки.\n\nНа главную: /start"
module.exports.nonename = "Вы не указали даже именни."
module.exports.noneage = "Вы не указали возраст, или ввели данные некорректно."
module.exports.nonecurs = "Вы не указали курс, или ввели данные некорректно."
module.exports.nonedesc = "Вы не указали описание, или привысили лимит в " + cfg.maxosebe + " символа."
module.exports.setedname = "Вы установили ФИО: "
module.exports.setedage = "Вы установили Возраст: "
module.exports.setedosebe = "Вы установили О себе: "
module.exports.seteduniver = "Вы указали ваш ВУЗ как: "
module.exports.setedcurs = "Вы указали ваш курс как: "
module.exports.foundunivers = "Возможно вы искали эти университеты:"


//АДМИНЫ
module.exports.adminreqacceptbug = "Вы не указали tgid."
module.exports.adminreqisnull = "Заявка не найдена, либо рассмотрена кем-то ещё."
module.exports.adminreqwasaccepted = "Вы одобрили заявку пользователя: "
module.exports.adminreqwascanceled = "Вы отклонили заявку пользователя: "
module.exports.adminreqwascanceled2 = "\nПо причиние: "

//СЛОВА
module.exports.lname = "\nИмя: "
module.exports.lfam = "\nФамилия: "
module.exports.lotc = "\nОтчество: "
module.exports.lage = "\nВозраст: "
module.exports.lunver = "\nУниверситет: "
module.exports.lcurs = "\nКурс: "
module.exports.losebe = "\nО себе: "

//ИВЕНТЫ
module.exports.eventinfosearchbug = "Ивент с указанным ID не найден."