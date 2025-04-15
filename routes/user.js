const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js");

router.get("/logout",userController.logout);

router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl,
        passport.authenticate("local",{
            failureRedirect:"/login",
            failureFlash:true,
        }),
        userController.login
    );
router.route("/signup")
    .get(userController.rendersignup)
    .post(wrapAsync(userController.signUp));


module.exports=router;
