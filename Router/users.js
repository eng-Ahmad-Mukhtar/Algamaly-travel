const express = require('express');
const router = express.Router() ;
const user_control = require('../Controllers/users_auth_controller');

router.get("/signin" , user_control.login_site)




router.post("/new_login" , user_control.new_log_in)

router.post("/new_registration" , user_control.new_user)

router.get("/destroy" , user_control.destroy)
module.exports= router ;



