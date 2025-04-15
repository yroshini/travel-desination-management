const Listing= require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.newListing=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{
                path:"author",
            },
        })
        .populate("owner");
    
    if(!listing){
        req.flash("error","No such type of Listing Existed :(");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(404,"Send valid data for Listing!");
    }
    let url=req.file.path;
    let filename=req.file.filename;
    //console.log(url,"..",filename);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id; // accessing user name for the new listing
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing was added !");
    res.redirect("/listings");
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);

    if(!listing){
        req.flash("error","No such type of Listing Existed :(");
        res.redirect("/listings");
    }
    let originalimageurl=listing.image.url;
    originalimageurl = originalimageurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalimageurl});
};

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(404,"Send valid data for Listing!");
    }
    
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    //  res.redirect("/listings");
    if(typeof req.file !=="undefined"){ // checking whether new image is uploaded while editing or not
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }    
    req.flash("success","Listing was updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing was deleted !");
    res.redirect("/listings");
};