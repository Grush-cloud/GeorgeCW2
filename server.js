// Import dependencies modules:
const express = require('express')
// const bodyParser = require('body-parser')


// Create an Express.js instance:
const app = express()

// config Express.js
app.use(express.json())
app.use(express.static('public'));
app.set('port', 3000)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers",'Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods','PUT');
    next();
});

// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://George:Nelsonattwo@cluster0.dtiun.mongodb.net', (err, client) => {
    db = client.db('Webstore')
})

//middleware to handle images 
app.get('/collection/lessons/img', (req, res, next) => {
    var imagePath = path.resolve(__dirname, "img"); 
    app.use("/img", express.static(imagePath));
})


// dispaly a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.render('index.html')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})

// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

//adding post
app.post('/collection/:collectionName', (req, res, next) => {
req.collection.insert(req.body, (e, results) => {
if (e) return next(e)
res.send(results.ops)
})
})

// return with object id 
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
if (e) return next(e)
res.send(result)
})
})


//update an object 

app.put('/collection/:collectionName/:id', (req, res, next) => {
req.collection.update(
{_id: new ObjectID(req.params.id)},
{$set: req.body},
{safe: true, multi: false},
(e, result) => {
if (e) return next(e)
res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
})
})





app.delete('/collection/:collectionName/:id', (req, res, next) => {
req.collection.deleteOne(
{ _id: ObjectID(req.params.id) },(e, result) => {
if (e) return next(e)
res.send((result.result.n === 1) ?
{msg: 'success'} : {msg: 'error'})
})
})


const port = process.env.PORT || 3000
app.listen(port)