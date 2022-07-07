/**
 * variables para importar lo necesario para el funcionamiento
 * del logueo de los usuarios.
 */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const cors = require('cors')
const app = express();

const User = require("../bingo/models/user");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));

const mongo_uri = "mongodb://localhost/usersBingo";

/**
 * conexión a mongo db
 */
mongoose
    .connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

/**
 * Rutas
 * @type {Router}
 */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/signup", usersRouter);

/**
 * Obtener todos los usuarios.
 */
app.get("/get", cors(), (req, res) => {
    const data = User.find();
    data
        .then((result) => res.json(result))
        .catch((err) => console.log(err));
});

/**
 * Registrar un usuario.
 */
app.post("/register", cors(), (req, res) => {
    const {username, password} = req.body;

    const user = new User({username, password});

    user.save(err => {
        if (err) {
            res.status(500).send("ERROR AL REGISTRAR EL USUARIO");
        } else {
            res.status(200).send("USUARIO REGISTRADO");
        }
    });
});

/**
 * Autenticar el logueo de un usuario.
 */
app.post("/authenticate", cors(), (req, res) => {
    const {username, password} = req.body;

    User.findOne({username}, (err, user) => {
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
