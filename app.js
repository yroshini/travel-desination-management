
//---we only use .env files for development and not for production
if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
// console.log(process.env.SECRET);


const express=require("express");
const app=express();
const path=require('path');
const mongoose=require("mongoose");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


//-------to connect database------
const mongo_url=process.env.ATLASDB_URL;
//------connecting mongo atlas instead of connecting localhost
//const dburl=process.env.ATLASDB_URL;

main()
    .then(res=>{
        console.log("Connected to DB");
    })
    .catch(err=>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(mongo_url);
    //await mongoose.connect(dburl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

// const store=MongoStore.create({
//     mongoUrl:dburl,
//     crypto:{
//      secret:process.env.SECRET,
//     },
//     touchAfter:24 *3600,
//  });

// store.on("error",()=>{
// console.log("ERROR in MONGO Session",err);
// });

const sessionOptions={
    //store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true, // for security
    }
}


//-------basic api------
app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //stores the data
passport.deserializeUser(User.deserializeUser()); // unstore the data

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//---------testing whether our code is working or not--
app.get("/testListing",async (req,res)=>{
    let samplelisting=new Listing({
        title:"My New Villa",
        description:"By the Beach",
        price:160000,
        location:"Paris",
        country:"London",
    });
    await samplelisting.save();
    console.log("Sample saved !");
    res.send("Successfull !");
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"sigma-batch2"
//     });
//     let registeredUser=await User.register(fakeUser,"password");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !!"));
})

app.use((err,req,res,next)=>{
    console.log(err.stack);
    let{status=500,message="Something went Wrong!!"}=err;
    res.status(status).render("listings/error.ejs",{message});
    //res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("Listening to port 8080");
});