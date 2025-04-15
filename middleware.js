const Listing= require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
//-------creating a middle ware to validate schema----
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let ermsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,error);
    }
    else{
        next();
    }
}

//-------creating a middle ware to validate schema----

module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let ermsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,error);
    }
    else{
        next();
    }
}

//-------middleware to check whether logged in or not ---
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","LogIn to access Wanderlust");
        return res.redirect("/login");
    }
    next();
};

// whenever we log in passport resets the redirecturl so to avoid that 
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// giving acces to the owner to edit/delete their posts
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have acces to edit/delete the listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

//-------giving access to owner of the reviews to delete or edit--
module.exports.isreviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    let listing=await Listing.findById(id);
    if(!review.author.equals(res.locals.currUser._id)&& (!listing.owner.equals(res.locals.currUser._id))){
        req.flash("error","You don't have acces to delete the review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}