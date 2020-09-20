const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname:{type: String},
    lastname:{type: String},
    email:{type: String},
    password:{type: String},
    access_token:{type:String},
    refresh_token:{type:String}
});



userSchema.methods.isValidPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);

    }catch(error){
        throw error
    }
}

module.exports = User = mongoose.model('user', userSchema);