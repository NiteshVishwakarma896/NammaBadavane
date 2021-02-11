const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Routing Routes


//middlewares
app.use(bodyParser.json({limit:'50mb'}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        res.status(200);
    }
    next();
});

//Database Connection

mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log("Connected to the database successfully 🔥 ")
  })
.catch(err => console.log(err))


//Routes
app.use('/users',require('./routes/users'));
app.use('/admin',require('./routes/admin'));
app.use('/complain',require('./routes/complains'));
app.use('/solution',require('./routes/solutions'));
app.use('/department',require('./routes/departments'));
app.use('/notification',require('./routes/notification'));
app.use('/feedback',require('./routes/feedbacks'));



//wild card route
app.get('*', (req, res) => {
    res.json({
        message:"The endpoint you are trying to access is not avaliable !",
        status:"404"
    }).status(404);
});




const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server has been started on ${port} 🔥`) });