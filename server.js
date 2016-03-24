var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongojs = require('mongojs');

var app = express();

var db = mongojs('sightings');
var Birds = db.collection('birds');

app.use(bodyParser.json());
app.use(cors());

var port = 8000;

app.listen(port, function(){
    console.log("Listening on port " + port);
});


app.post('/api/sighting', function(req, res){
    Birds.insert(req.body, function(err, result){
        if(err) return res.status(500).json(err);
        else return res.json(result);
    });
});


app.get("/api/sighting", function(req, res){
    var query = {};
    
    if(req.query.name) query.name = {name: req.query.name};
    if(req.query.order) query.order = {name: req.query.order};  //these don't work
    if(req.query.id) query._id = mongojs.ObjectId(req.query.id); //this works
    
    Birds.find(query, function(error, reponse){
        if(error) res.status(500).json(error);
        else res.json(reponse);
    });
    
    
});

app.put('/api/sighting', function(req, res, next){
    if(!req.query.id) return res.status(418).send('request query \'id\' required');
    
    Birds.findAndModify({
        query: {
            _id: mongojs.ObjectID(req.query.id)
        },
        update: {
            $set: req.body
        }
    },
    function(error, response){
        console.log(error, response);
        if(error) return res.status(500).json(error);
        res.json(response);
    });
});

app.delete('/api/sighting', function(req, res, next){
    if(!req.query.id) return res.status(418).send('request query \'id\' required');
    
    Birds.remove({_id: mongojs.ObjectId(req.query.id)}, function(err, result){
      if(err){
            res.send(err);
        }else{
            res.json(result);
        } 
   }); 
});


