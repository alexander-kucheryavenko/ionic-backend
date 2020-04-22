const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const cleanersRoutes = require('./routes/cleaners');
const keys = require('./config/keys');
//Initiate our app
const app = express();
// app.use(cors());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// mongoo connect
mongoose.set('useCreateIndex', true);
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(error));

//dev
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/auth', authRoutes);
app.use('/cleaners', cleanersRoutes);

mongoose.set('debug', true);

module.exports = app;
