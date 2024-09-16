




const express = require('express');


const Application = express();

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 1000;

Application.set('view engine', 'ejs');

Application.use(express.static('uploads'));
Application.use(express.static(path.join(__dirname, 'public')));
Application.set('views', path.join(__dirname, 'views'));

Application.use(express.urlencoded({ extended: false }));
Application.use(express.json());


const session = require('express-session');
const { SESSION_SECRET } = process.env;


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const MongoDBStore = require('connect-mongodb-session')(session);


const store = new MongoDBStore({
  uri: process.env.DATABASE_CONNECTION,
  collection: 'sessions'
});

store.on('error', function (error) {
  console.error('MongoDB Session Store Error:', error);
});


Application.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: store,
    cookie: {
      maxAge: 30 * 60 * 1000
    }
  })
);


const home = require('./Router/home_route');
Application.use(home);

const loguser = require('./Router/users');
Application.use(loguser);







Application.listen(port, () => {
  console.log(`Application running on http://localhost:${port}`);
})



Application.use((req, res) => {
  res.status(404).send('لا يوجد صفحه ');
});


