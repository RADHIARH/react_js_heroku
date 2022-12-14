// import packages
const express = require("express");
require("dotenv").config({ path: "./config/.env" });
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cors = require("cors");
app.use(cors());
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const { SENDGRID_API } = require("./config/keys");
// Create a transporter for sendgrid.
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);
//  connect to database
var mysql = require("mysql2");
let dbConn = require("./db");

// establish server connection
const port = process.env.PORT || 3000;
console.log(port);
app.listen(port, function () {
  console.log("Node app is running on port " + port);
});
app.get("/", (req, res) => {
  res.send("hello world");
});
// cors configuration
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
// Routes
//Creating GET Router to fetch all the employes  from the MySQL Database
app.get("/employes", (req, res) => {
  dbConn.query(
    'SELECT * FROM user_table where id_role=(select id from role where role="employeur") and deleted=false',
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});
// Creating GET Router to fetch all the users  from the MySQL Database
app.get("/users", (req, res) => {
  dbConn.query(
    'SELECT * FROM user_table  where id_role=(select id from role where role="utilisateur") and deleted=false',
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});
//Creating GET Router to add new user
app.post("/add/user", (req, res) => {
  const user = req.body;
  dbConn.query(
    "insert into user_table (user_firstname,user_lastname,user_phone,user_email,user_civility,user_speciality,user_adress,user_birthday,user_seniority,user_experience,user_comment,id_role,cin,poste,verified,deleted) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      user.firstname,
      user.lastname,
      user.phone,
      user.email,
      user.civility,
      user.speciality,
      user.adress,
      user.birthday,
      user.seniority,
      user.experience,
      user.comment,
      user.role,
      user.cin,
      user.poste,
      false,
      false,
    ],
    (err, rows, fields) => {
      if (!err) res.send("user successfully added");
      else console.log(err);
    }
  );
});
//  Creating POST router to add new employe
app.post("/add/employe", (req, res) => {
  const user = req.body;
  dbConn.query(
    "insert into user_table (user_firstname,user_lastname,user_phone,user_email,user_civility,user_speciality,user_adress,user_birthday,user_seniority,user_experience,user_comment,id_role,cin,poste) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      user.firstname,
      user.lastname,
      user.phone,
      user.email,
      user.civility,
      user.speciality,
      user.adress,
      user.birthday,
      user.seniority,
      user.experience,
      user.comment,
      user.role,
      user.cin,
      user.poste,
    ],
    (err, rows, fields) => {
      if (!err) res.send("user successfully added");
      else console.log(err);
    }
  );
});
// Creating PUT Router to modify a  user
app.put("/update/user/:id", (req, res) => {
  const user = req.body;
  const user_id = req.params.id;
  console.log("userrr" + req.body);
  console.log("user" + user_id);
  dbConn.query(
    "update  user_table  set user_firstname=? ,user_lastname =? ,user_phone=?,user_email=?, user_civility=?, user_speciality=?, user_adress=?,  user_birthday=?, user_seniority=?  ,user_experience=? , user_comment =? , cin=? , poste=?  where user_id =? ",
    [
      user.firstname,
      user.lastname,
      user.phone,
      user.email,
      user.civility,
      user.speciality,
      user.adress,
      user.birthday,
      user.seniority,
      user.experience,
      user.comment,
      user.cin,
      user.poste,
      user_id,
    ],
    (err, rows, fields) => {
      if (!err) res.send("user successfully updated");
      else console.log(err);
    }
  );
});
//Creating delete Router to delete a  user
app.delete("/delete/user/:id", (req, res) => {
  const user_id = req.params.id;
  dbConn.query(
    "update  user_table  set deleted=true where user_id =? ",
    user_id,
    (err, rows, fields) => {
      if (!err) res.send("user successfully deleted");
      else console.log(err);
    }
  );
});

// login
app.post("/login", (req, res) => {
  dbConn.connect((err) => {
    if (!err) console.log("Connection Established Successfully");
    else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
  });
  dbConn.query(
    "select * from user_table where user_phone= ? ",
    req.body.telephone,
    (err, rows, fields) => {
      if (!err) {
        res.send(rows[0]);
        console.log(rows[0]);
      } else console.log(err);
    }
  );
});
app.get("/logout", (req, res) => {
  dbConn.query(sql, function (err, rows) {
    _err = err;
    _rows = rows;
  });
  dbConn.end(function () {
    callback(_err, _rows);
  });
});

// delete employe
app.delete("/delete/employe/:id", (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  dbConn.query(
    "delete from  utilisateur   where id =? ",
    user_id,
    (err, rows, fields) => {
      if (!err) res.send("user successfully deleted");
      else console.log(err);
    }
  );
});

// get a specific user by id
app.get("/users/:id", (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  dbConn.query(
    "select * from  user_table   where user_id =? ",
    user_id,
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});
// get  all permissions
app.get("/permissions", (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  dbConn.query("select * from  permission   ", user_id, (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});
// add a new  permission
app.post("/add/permissions", (req, res) => {
  const user = req.body;
  dbConn.query(
    "insert into   user_permissions	(user_permission_value ,id_user,id_permission ) values(?,?,?) ",

    [true, user.id, user.id_permission],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});
///get permission per user
app.get("/permissions/:id", (req, res) => {
  const user = req.params.id;
  dbConn.query(
    "select * from  user_permissions	where id_user =? ",
    [user],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});
app.get("/permissions/getusers/:id", (req, res) => {
  const user = req.params.id;
  dbConn.query(
    "select * from  user_permissions	where id_user =? && id_permission=1 ",
    [user],
    (err, rows, fields) => {
      if (!err) res.send(rows[0].user_permission_value);
      else console.log(err);
    }
  );
});
// delete permission
app.put("/permissions/:id", (req, res) => {
  const user = req.params.id;
  dbConn.query(
    "update  user_permissions	 set user_permission_value =false where id_user_permission =?  ",
    [user],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
        console.log(rows);
      } else console.log(err);
    }
  );
});

// send email
app.post("/send/email", (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      pass: process.env.WORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });
  transporter.verify((err, success) => {
    err
      ? console.log(err)
      : console.log(`=== Server is ready to take messages: ${success} ===`);
  });

  var mailOptions = {
    from: process.env.EMAIL, // sender address
    to: req.body.email, // list of receivers
    code: req.body.code, // Subject line
    url: req.body.url,
    html: `
        <div style="padding:10px;border-style: ridge">
        <p>You have a new contact request.</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Email: ${req.body.email}</li>
            <li>code: ${req.body.code}</li>
            <li>url: ${req.body.url}</li>
        </ul>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ status: false, respMesg: "Email not sended Successfully" });
    } else {
      res.json({ status: true, respMesg: "Email Sent Successfully" });
    }
  });
  dbConn.query(
    "update  user_table  set user_password =?  where user_id =? ",
    [req.body.code, req.body.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});


app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
