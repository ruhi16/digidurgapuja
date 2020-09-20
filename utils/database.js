const mongoose = require('mongoose');


mongodbUri = "mongodb+srv://ruhi16:asdf1234@cluster0.yaizg.mongodb.net/digidurgapuja";


const connectDb = async ()=>{
    try{
        await mongoose.connect(mongodbUri,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }catch(err){
        console.log(err.message);
    }
};

mongoose.connection.on('connected', ()=>{
    console.log('Mongoose connected to db....');
});

mongoose.connection.on('error', ()=>{
    console.log('Mongoose connection errors....' + err.message);
});

mongoose.connection.on('disconnected', ()=>{
    console.log('Mongoose disconnected from db....');
});

process.on('SIGINT', async()=>{
    await mongoose.connection.close();
    process.exit(0);
});



module.exports = connectDb;
