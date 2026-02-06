const mongoose = require('mongoose');


function conectToDb()
{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("database connected");
    })
}

module.exports = conectToDb;