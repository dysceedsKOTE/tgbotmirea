//МОДУЛИ
const cfg = require("./cfg");

//БИБЛИОТЕКИ
const {
  Pool,
  Client
} = require('pg')
const {
  Sequelize
} = require('sequelize');
const sequelize = new Sequelize(cfg.pgclient)

//ПОДКЛЮЧЕНИЕ К БАЗЕ
const client = new Client(cfg.pgclient)
client.connect()

// СТРОИМ БАЗУ ДАННЫХ-------------------------------------------------------------------------------------
try {
  sequelize.authenticate();
  console.log('Sequelize подключился к бд.');
} catch (error) {
  console.error('Ошибка подключения к бд:', error);
}

const dtable2 = sequelize.define(
  "profiles", {
    tgid: {
      type: "varchar",
      primaryKey: true
    },
    name: "varchar",
    fam: "varchar",
    otch: "varchar",
    age: "varchar",
    univer: "varchar",
    curs: "varchar",
    osebe: "text",
    paccept: {
      type: "integer",
      defaultValue: 0
    },
    role: {
      type: "varchar",
      defaultValue: "user"
    }
  }, {
    timestamps: false,
    createdAt: false,
  }
);

const dtable3 = sequelize.define(
  "requests", {
    tgid: {
      type: "varchar",
      primaryKey: true
    },
    name: "varchar",
    fam: "varchar",
    otch: "varchar",
    age: "varchar",
    univer: "varchar",
    curs: "varchar",
    osebe: "text",
    date: {
      type: "varchar"
    }
  }, {
    timestamps: false,
    createdAt: false,
  }
);

const dtable4 = sequelize.define(
  "event", {
    title: "varchar",
    desc: "text",
    author: "varchar",
    date: {
      type: "varchar",
      defaultValue: '30/12/22 00:00'
    },
    univer: "varchar"
  }, {
    timestamps: false,
    createdAt: false,
  }
);

const dtable5 = sequelize.define(
  "eventtousers", {
    eventid: {
      type: "varchar",
      primaryKey: true
    },
    usertgid: "varchar"
  }, {
    timestamps: false,
    createdAt: false,
  }
);

const dtable6 = sequelize.define(
  "universities", {
    name: {
      type: "varchar",
      primaryKey: true
    }
  }, {
    timestamps: false,
    createdAt: false,
  }
);

(async () => {
  await sequelize.sync( /*{force: true}*/ );
})();
// СТРОИМ БАЗУ ДАННЫХ-------------------------------------------------------------------------------------

async function getdata(text) {
  const query = client.query(text);
  return query;
}

module.exports.checkuserprofile = async function(tgid) {
  const query = await getdata("SELECT * FROM profiles WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.addusertobaseprofile = async function(tgid) {
  const query = await getdata("INSERT INTO profiles(tgid) VALUES ('" + tgid + "')");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.updateprofilename = async function(tgid, fam, name, otch) {
  if (typeof fam == 'undefined') {
    fam = null
  }
  if (typeof otch == 'undefined') {
    otch = null
  }
  const query = await getdata("UPDATE profiles SET name='" + name + "', fam='" + fam + "', otch='" + otch + "' WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.updateprofileage = async function(tgid, age) {
  const query = await getdata("UPDATE profiles SET age='" + age + "' WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.updateprofiledesc = async function(tgid, desc) {
  const query = await getdata("UPDATE profiles SET osebe='" + desc + "' WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.updateprofileuniver = async function(tgid, univer) {
  const query = await getdata("UPDATE profiles SET univer='" + univer + "' WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.updateprofilecurs = async function(tgid, curs) {
  const query = await getdata("UPDATE profiles SET curs='" + curs + "' WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.checkuserrequest = async function(tgid) {
  const query = await getdata("SELECT * FROM requests WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.senduserrequest = async function(tgid, name, fam, otch, age, univer, curs, desc) {
  const query = await getdata("INSERT INTO requests(tgid, name, fam, otch, age, univer, curs, osebe) VALUES ('" + tgid + "', '" + name + "', '" + fam + "', '" + otch + "', '" + age + "', '" + univer + "', '" + curs + "', '" + desc + "')");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.selectalladminsforunik = async function(role, univer) {
  const query = await getdata("SELECT * FROM profiles WHERE role = '" + role + "' AND univer = '" + univer + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows
  } else {
    answer = "none"
  }
  return answer
}

module.exports.acceptrequest = async function(tgid) {
  const query = await getdata("UPDATE profiles SET paccept=1 WHERE tgid = '" + tgid + "'");
  const query2 = await getdata("DELETE FROM requests WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.cancelrequest = async function(tgid) {
  const query = await getdata("DELETE FROM requests WHERE tgid = '" + tgid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}

module.exports.selectallevents = async function() {
  const query = await getdata("SELECT * FROM events");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows
  } else {
    answer = "none"
  }
  return answer
}

module.exports.selectalluniversities = async function() {
  try {
    const query = await getdata("SELECT * FROM universities");
    let answer = ""
    if (query.rows[0] != undefined) {
      answer = query.rows
    } else {
      answer = "none"
    }
    return answer
  } catch (err) {

  }
}

module.exports.selectevent = async function(evid) {
  const query = await getdata("SELECT * FROM events WHERE id = '" + evid + "'");
  let answer = ""
  if (query.rows[0] != undefined) {
    answer = query.rows[0]
  } else {
    answer = "none"
  }
  return answer
}


/*module.exports.checkuser = function(login) {
  client.connect()
  const client.query("SELECT * FROM users WHERE login = '" + login  + "'", (err, res) => {
  	if (res.rows[0] != undefined) {
  		console.log("Пользователь найден")
  		return res.rows[0]['login']
  	} else {
  		console.log("Пользователь не найден")
  		return "Пользователь не найден"
  	}
  	client.end()
  });
}*/