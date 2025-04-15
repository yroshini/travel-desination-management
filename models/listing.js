const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { string } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    // //---to make sure the listings are categorized---
    // category:{ 
    //     type:String,
    //     enum:["mountains","arctic","farms","castles","treehouses","tinyhomes","lakefront","iconiccities"]
    // },
    
});
//----when you delete a post you need to delete the comments tooo
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;