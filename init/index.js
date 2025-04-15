const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(res=>{
        console.log("Connected to DB");
    })
    .catch(err=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67a1f783d7e7f62af34b7803"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();