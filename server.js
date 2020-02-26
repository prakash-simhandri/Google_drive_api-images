var express = require('express');
var path = require('path');
const port = 2016
var app = express();

app.use(require("./routes/index"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views engine', 'ejs')  
app.get("/",(req,res)=>{
    res.send("It's working ..")
})

app.use((req,res)=>(
    res.status(404)
    .send('Unknown Request..')
))

app.listen(port,()=> console.log(`port is listening at ${port}!`))
