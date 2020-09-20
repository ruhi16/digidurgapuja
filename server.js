const express = require('express');
const createError = require('http-errors');
const User = require('./models/User');
require('dotenv').config();

const connectDb = require('./utils/database');
connectDb();

app = express();
app.use(express.json()); //{extended:false}



app.get('/', (req, res, next)=>{
    res.render({"message":"Hello World: "+process.env.MONGODB_URI });
});




const userRoutes = require('./routes/users');
app.use('/api', userRoutes);








// For any unkown http BROWSER requests
app.use((req, res, next)=>{
    next(createError.NotFound('Page Not Found.....'));
});




// Error handler for http REST API requests
app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    
    var errField = err.message.split('"')[1];

    res.send({
        status: err.status || 500,        
        error: {
            field: errField,
            message: err.message            
        }
    });
});







app.listen(3000, ()=>{
    console.log('Hello I am listening from port no 3000');
})