const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const app = express();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/user");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const mongo_uri = "mongodb://localhost/usersBingo";

mongoose.connect(mongo_uri, function (err) {
  if (err) {
    throw err;
  } else {
    console.log("conectado a mongo {mongo_uri}");
  }
});

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/signup", usersRouter);

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const user = new User({ username, password });

  user.save(err => {
    if (err) {
      res.status(500).send("ERROR AL REGISTRAR EL USUARIO");
    } else {
      res.status(200).send("USUARIO REGISTRADO");
    }
  });
});

app.post("/authenticate", cors(), (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).send("ERROR AL AUTENTICAR EL USUARIO");
    } else if (!user) {
      res.status(500).send("EL USUARIO NO EXISTE");
    } else {
      user.isCorrectPassword(password, (err, result) => {
        if (err) {
          res.status(500).send("ERROR AL AUTENTICAR");
        } else if (result) {
          res.status(200).send("USUARIO AUTENTICADO CORRECTAMENTE");
        } else {
          res.status(500).send("USUARIO O CONTRASEÑA INCORRECTA");
        }
      });
    }
  });
});

module.exports = app;

/* --- 
variables, constantes y entradas
que se supone no voy 
a usar
*/
var createError = require("http-errors");
const logger = require("morgan");
//const { resourceLimits } = require("worker_threads");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));

app.use(cookieParser());

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//const usersRouter = require('./routes/users');
//const { default: mongoose } = require('mongoose');
//app.use('/users', usersRouter);
