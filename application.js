// const express = require('express');
// const Application = express();
// const http = require('http');

// const ngrok = require('ngrok');



// // Application.use(bodyParser.urlencoded({ extended: true }));

// require("dotenv").config();
// const port = process.env.PORT || 1000

// Application.set('view engine', "ejs");
// Application.use(express.static("public"));
// Application.use(express.static("uploads"));


// const mongoose = require('mongoose');
// async function startNgrok(port) {
//     let retries = 3;
//     while (retries > 0) {
//         try {
//             const url = await ngrok.connect({ addr: port });
//             console.log(`ngrok tunnel established at ${url}`);
//             console.log(url)
//             return url;
//         } catch (err) {
//             console.error('Error establishing ngrok tunnel:', err);
//             retries--;
//             if (retries > 0) {
//                 console.log('Retrying ngrok connection...');
//                 await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds before retrying
//             } else {
//                 console.log('Failed to establish ngrok connection after multiple attempts.');
//                 throw err;
//             }
//         }
//     }
// }

// // MongoDB connection
// mongoose.connect(process.env.DATABASE_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(async () => {
//         console.log('Connected to MongoDB');

//         // Start the server
//         Application.listen(port, '0.0.0.0', async () => {
//             console.log(`Application running on http://localhost:${port}`);

//             try {
//                 await startNgrok(port);
//             } catch (err) {
//                 console.error('Failed to establish ngrok tunnel:', err);
//             }
//         });
//     })
//     .catch((err) => {
//         console.error('Error connecting to MongoDB:', err);
//     });


// Application.use(express.urlencoded({ extended: false }));
// Application.use(express.json());



// const session = require('express-session');
// const { SESSION_SECRET } = process.env;
// Application.use(
//     session({
//         secret: SESSION_SECRET,
//         saveUninitialized: true,
//         resave: false,
//         cookie: { maxAge: 600000 }, 

//         rolling: false,
//     })
// )


// const home = require("./Router/home_route")
// Application.use(home)



// const loguser = require("./Router/users")
// Application.use(loguser)




// Application.use((req, res) => {
//     res.status(404).send("لا يوجد صفحه ")
// })













const express = require('express');


const Application = express();
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 1000;



// ==============




// // إعداد محرك القوالب
Application.set('view engine', 'ejs');
// Application.use(express.static('public'));
Application.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));
Application.set('views', path.join(__dirname, 'views'));
// // استخدام المكونات المتوسطة (middleware) لتحليل البيانات
Application.use(express.urlencoded({ extended: false }));
Application.use(express.json());

// // إعداد جلسات المستخدم
const session = require('express-session');
const { SESSION_SECRET } = process.env;

Application.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    // cookie: { maxAge: 600000 },
    rolling: false,
  })
);

// // الاتصال بقاعدة البيانات MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
   
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// // إضافة المسارات (Routes)
const home = require('./Router/home_route');
Application.use(home);

const loguser = require('./Router/users');
Application.use(loguser);



Application.listen(port,  () => {
    console.log(`Application running on http://localhost:${port}`);
 })

// معالجة الخطأ لصفحات غير موجودة
Application.use((req, res) => {
  res.status(404).send('لا يوجد صفحه ');
});









// const express = require('express');
// const app = express();
// const path = require('path');
// const port = process.env.PORT || 3000;

// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// // app.set('views', './views');
// app.set('views', path.join(__dirname, 'views'));
// app.get('/', (req, res) => {
//         res.render("index")
// });




// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });