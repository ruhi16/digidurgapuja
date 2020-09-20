const express = require('express');
const User = require('../models/User');
const { authSchema, loginSchema } = require('../requests/validation_schema');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const { signAccessToken, signRefreshToken, verifyAccessToken } = require('../utils/generateTokens');

const router = express.Router();
app.use(express.json());



router.post('/register', async(req, res, next)=>{   
    try{
        const results = await authSchema.validateAsync(req.body);
        const doesExists = await User.findOne({email:results.email});
        if(doesExists){
            throw createError.Conflict(`This ${results.email} already exists...`);
            // next(createError.Conflict(`This ${results.email} already exists...`) );
            // return;
        }
        
        const salt = await bcrypt.genSalt(10);
        results.password = await bcrypt.hash(results.password, salt);         
        // results.access_token = 'abcd';
        const user = new User(results);
        const savedUser = await user.save();
        // console/log(savedUser);

        user.access_token = await signAccessToken(savedUser._id);
        user.refresh_token = await signRefreshToken(savedUser._id);

        // console.log(results);
        const updatedUser = await user.save();
        
        // console.log(updatedUser);


        res.status(200).send(_.pick(updatedUser, ['id', 'firstname', 'lastname', 'access_token', 'refresh_token']));
    }catch(error){             
        if(error.isJoi){
            error.status = 422;
            next(error);
        }
    }    
});


router.post('/login', async(req, res, next)=>{  
    try{
        const results = await loginSchema.validateAsync(req.body);
        
        const user = await User.findOne({email:results.email});
        if(!user){
            console.log('User not registered...');
            throw createError.NotFound('User Not Registered...');
            // next(createError.Conflict(`This ${results.email} already exists...`) );
            // return;
        }
        
        const isMatched = await user.isValidPassword(results.password);
        if(!isMatched){
            throw createError.NotFound('User Not Registered...');
        }        


        user.access_token = await signAccessToken(user._id);
        user.refresh_token = await signRefreshToken(user._id);

        const updatedUser = await user.save();

        res.status(200).send(_.pick(updatedUser, ['id', 'firstname', 'lastname', 'access_token', 'refresh_token']));


    }catch(error){             
        if(error.isJoi === true){
            return next(createError.BadRequest('Invalid username/password...'));
        }

        next(error);
    } 


});





router.get('/users', verifyAccessToken, async(req, res, next)=>{
    
    const user = await User.findOne({ _id: req.payload['aud']});
    
    res.status(200).send(_.pick(user, ['id', 'firstname', 'lastname', 'email']));


});



router.post('/logout', verifyAccessToken, async(req, res, next)=>{
    
    const user = await User.findOne({ _id: req.payload['aud']});

    user.access_token = '';
    user.refresh_token = '';

    await user.save();
    
    res.status(200).send({message:"User Successfully Logged Out..."});


});




module.exports = router;

