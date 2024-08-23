const AysncHandler = require("express-async-handler")
const bcrypt = require('bcrypt');
const user = require('../models/user');


const login_site =AysncHandler(async (req , res) => {
    res.status(200).render("login_page" , {title : "Sign In" , success:req.session.success})
})


const  new_log_in = AysncHandler(async (req, res) => {
    const {name , password } =req.body ; 
    if (!name || !password  ) {
        req.session.success = `"Validation Failed" Please, Enter your data!`
        res.status(400).redirect("/login")
    } 
    const loged_user = await user.findOne({name:name}) 
    if (loged_user) {
        const user_allowed = await bcrypt.compare(password , loged_user.password)
        if (user_allowed) {
            req.session.user=loged_user
            res.status(200).redirect("/login")
       
            
        }else{
            req.session.success = `"Non-Authoritative information"wrong identifier or Wrong Password!`
            res.status(203).redirect("/login")
        }

    }
    else{
        req.session.success = `"unauthorized" email or phone is wrong !`
            res.status(401).redirect("/login")
    }
})


const new_user = AysncHandler( async (req , res) => {
    const {name  ,password  } = req.body ; 
   if (!name  ||!password ) {
       // الادخال خاطآ
      req.session.success = `"Validation Failed" Please, Enter your data!`
       res.status(400).redirect("/Registration")
   }
   const user_founded = await user.findOne({name:name})
   if (user_founded) {
       req.session.success = `"Conflict" user already registered  !`
       res.status(409).redirect("/Registration")
   }

   const password_encryption = await bcrypt.hash(password , 10 ) 
   const Insert_data = await user.create({
       name:name , 
       
       password:password_encryption , 
    
   })
   if (Insert_data) {
       // اوكي
       req.session.success = `"Ok" Registed Successfully!`
       res.status(200).redirect("/login")
   }
   
   else{
       //  الشرط المسبق مرفوض
       req.session.success = `"Precondition Failed" Email or Phone is wrong!`
       res.status(412).redirect("/Registration")
   }
   
   })
   



   const destroy = AysncHandler ( async (req , res ) => {
    try {
        req.session.destroy();
        res.redirect("/signIn")
    } catch (error) {
      console.log(error);
    }
        })
   



module.exports ={new_log_in ,login_site  ,new_user , destroy }