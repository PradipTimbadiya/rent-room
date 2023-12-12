const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const router = require('./router/router');
require('./db/conn');

app.get('/',(req,res)=>{
    res.send('done');
})

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/v1',router);

app.listen(PORT,()=>{
    console.log(`successfully run at port ${PORT}.💫`);
})