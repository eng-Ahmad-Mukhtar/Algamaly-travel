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

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 1000;



// ==============




// // إعداد محرك القوالب
Application.set('view engine', 'ejs');
// Application.use(express.static('public'));
Application.use(express.static('uploads'));
Application.use(express.static(path.join(__dirname, 'public')));
Application.set('views', path.join(__dirname, 'views'));
// // استخدام المكونات المتوسطة (middleware) لتحليل البيانات
Application.use(express.urlencoded({ extended: false }));
Application.use(express.json());

// // إعداد جلسات المستخدم
const session = require('express-session');
const { SESSION_SECRET } = process.env;

// Application.use(
//   session({
//     secret: SESSION_SECRET,
//     saveUninitialized: true,
//     resave: false,
//     // 30 * 60 * 1000
//     cookie: { maxAge: 2 * 3600000  },
//     rolling: false,
//   })
// );

// // الاتصال بقاعدة البيانات MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
   
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


// 

// Application.use(
//     session({
//       secret: SESSION_SECRET,
//       saveUninitialized: true,
//       resave: true,
//       // 30 * 60 * 1000
//       cookie: { maxAge: 9 * 3600000  },
//     //   rolling: false,
//     })
//   );

// 
// 
// 
// 

  const MongoDBStore = require('connect-mongodb-session')(session);

  // إنشاء تخزين الجلسات في MongoDB
  const store = new MongoDBStore({
    uri: process.env.DATABASE_CONNECTION,  // استخدم نفس URI لقاعدة البيانات الخاصة بك
    collection: 'sessions'  // اسم مجموعة التخزين للجلسات
  });
  
  store.on('error', function(error) {
    console.error('MongoDB Session Store Error:', error);
  });
  
  // إعداد الجلسة
  Application.use(
    session({
      secret: process.env.SESSION_SECRET,  // تأكد من استخدام `SESSION_SECRET` من متغيرات البيئة
      saveUninitialized: false,  // عدم حفظ الجلسات الفارغة
      resave: false,  // عدم إعادة حفظ الجلسات غير المعدلة
      store: store,  // تخزين الجلسة في MongoDB
      cookie: {
        maxAge:30 * 60 * 1000  // 30m ساعات، يمكنك تغيير القيمة حسب الحاجة
      }
    })
  );



















// // إضافة المسارات (Routes)
const home = require('./Router/home_route');
Application.use(home);

const loguser = require('./Router/users');
Application.use(loguser);


const multer = require('multer');


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // مسار حفظ الصور
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // اسم فريد للملف
  }
});
const upload = multer({ storage: storage });

// نقطة النهاية لتحميل الصور
Application.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // إنشاء رابط الصورة
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  // يمكنك هنا رفع الصورة إلى خدمات سحابية مثل AWS S3 أو Cloudinary

  res.json({ imageUrl }); // إعادة رابط الصورة إلى العميل
});

// تقديم الملفات الثابتة من مجلد 'uploads'
Application.use('/uploads', express.static('uploads'));


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