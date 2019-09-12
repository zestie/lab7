//import packages
let express = require('express');
let bodyParser = require('body-parser');    // parse payload of incoming POST requests
let mongoose = require('mongoose');

//reference to the schemas
let Developers = require('./models/developers');
let Tasks = require('./models/tasks');

let app = express();                        //configure express

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('images'));
app.use(express.static('css'));
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(8080);

const url = 'mongodb://localhost:27017/lab7';   //url to the MongoDB server

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true},
    function (err) {
        if (err) {
            console.log('Error in Mongoose connection');
            throw err;
        } else {
            console.log('Succesfully Connected');
        }
    }
);

/*  ***************************************
                ROUTES HANDLERS
    ***************************************
*/

/*  ***************************************
                GET Methods
    ***************************************
*/

//request  home page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

//request newtask page
app.get('/newtask', function(req, res) {
    res.sendFile(__dirname + '/views/newtask.html');
});

//request newdeveloper page
app.get('/newdeveloper', function(req, res) {
        res.sendFile(__dirname + '/views/newdeveloper.html');
});

//request listtasks page
app.get('/listtasks', function(req, res) {
    Tasks.find({}, function(err, data){
        res.render('listtasks.html', { Tasks: data })
    });
});

//request listdevelopers page
app.get('/listdevelopers', function(req, res) {
    Developers.find({}, function(err, data){
        res.render('listdevelopers.html', { Developers: data })
    }); 
});

//request delete page
app.get('/delete', function(req, res) {
    res.sendFile(__dirname + '/views/delete.html')
});

//request updatetask page
app.get('/updatetask', function(req, res) {
    res.sendFile(__dirname + '/views/updatetask.html')
});


/*  ***************************************
                POST Methods
    ***************************************
*/

//add new developer
app.post('/addeveloper', function(req, res) {
    let devInfo = req.body;
    let developer = new Developers({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: devInfo.firstName, 
            lastName: devInfo.lastName
        },
        level: devInfo.level,
        address: {
            unit: devInfo.unit,
            street: devInfo.street,
            suburb: devInfo.suburb,
            state: devInfo.state
        }        
    });
    developer.save(function (err) {
        if (err) throw err;
        console.log("Developer successfully added to DB");
    });
    res.redirect('/listdevelopers');
});

//add new task
app.post('/addtask', function(req, res) {
    let taskInfo = req.body;
    let task = new Tasks({
        _id: new mongoose.Types.ObjectId(),
        name: taskInfo.name, 
        // assign: mongoose.Types.ObjectId(),
        assign: taskInfo.assign,
        due: taskInfo.due,
        status: taskInfo.status,
        desc: taskInfo.desc
    });
    task.save(function (err) {
        if (err) throw err;
        console.log('Task successfully added to DB');
    });
    res.redirect('/listtasks');
});


//delete tasks by id 
app.post('/deletebyid', function(req, res) {
    let taskInfo = req.body;
    let filter = {_id : mongoose.Types.ObjectId(taskInfo._id)};
    Tasks.deleteOne( filter, 
    function (err, results){
        res.redirect('/listtasks');
    });
});

//delete tasks by status 'Complete'
app.post('/deletebystatus', function(req, res) {
    Tasks.deleteMany({ status: { $eq: 'Complete' }}, 
    function(err, results){
        res.redirect('/listtasks');
    });
});

//update tasks 
app.post('/taskupdate', function(req, res) {
    let taskInfo = req.body;
    let filter = { _id : mongoose.Types.ObjectId(taskInfo._id)};
    let theUpdate = {$set: { status: 'Complete' }};
    Tasks.updateOne( filter, theUpdate, 
    function(err, results){
        res.redirect('/listtasks');
    });
});