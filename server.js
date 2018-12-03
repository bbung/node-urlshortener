const express = require('express');
const Joi = require('joi');
var app = express();

app.use(express.json());

var port = process.env.PORT || 1337;

var urls = [];

app.get('/', (req,res) => {
    res.send(urls);
});
app.get('/:url', (req, res) => {
    
    const result = urls.find(s => s.shortened === req.params.url);
    if(result){
        res.redirect(result.target);
        return;
    }
    res.send(404);

});

const shortened = Joi.object().keys({
    target: Joi.string().uri({
        scheme: [
            'http',
            'https'
          ]
    }).required(),
    shortened: Joi.string().required()
});

// create new entry
app.post('/shorten',(req,res) => {
    
    const result = Joi.validate(req.body,shortened);
    
    if(result.error){
        res.send(result.error);
        return;
    }
    // check for existing url or target
    console.log(req.body);
    urls.push(req.body);
    res.send(req.body);    
    
});

app.listen(port,() =>{
    console.log(`Server is up on port ${port}`);
});