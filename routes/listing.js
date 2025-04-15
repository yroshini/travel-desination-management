const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");

const {isLoggedIn,isOwner,validateListing,validateReview}=require("../middleware.js");

const listingController=require("../controllers/listing.js");

const multer=require("multer"); //allows us to upload files
const{storage}=require("../cloudConfig.js");//accessing cloud and .env_files
const upload=multer ({storage}) //stores our uploaded files in this storage

router.route("/")
.get(wrapAsync(listingController.index)) // get info from controllers/listing.js
.post(
    isLoggedIn,    
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));

//---------new route-----
router.get("/new",isLoggedIn,listingController.newListing);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))

.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing));


//-------edit route---------
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports=router;