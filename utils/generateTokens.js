const JWT = require('jsonwebtoken');

const createError = require('http-error');


module.exports = {
    signAccessToken : (userId) =>{
        return new Promise( (resolve, reject)=>{
            const payload = {};
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '7d',
                issuer: 'rawsolutions.in',
                audience: userId.toString(),
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(err);
                resolve(token);
            });
        });
    },

    signRefreshToken : (userId) =>{
        return new Promise( (resolve, reject)=>{
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '30d',
                issuer: 'rawsolutions.in',
                audience: userId.toString(),
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(err);
                resolve(token);
            });
        });
    },

    verifyAccessToken : (req, res, next) => {
        if( !req.headers['authorization'] ){
            return next(createError.Unauthorized());
        }
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err) return next(createError.Unauthorized());//err.message
            
            req.payload = payload;
            next();
        });
    },

    
}
