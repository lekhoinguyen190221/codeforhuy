var express = require('express')
var ObjectId = require('mongodb').ObjectId
var app = express()

var MongoClient = require('mongodb').MongoClient
// var url = 'mongodb://localhost:27017'
var url = 'mongodb+srv://nguyen128:shinobi123@cluster0.6jzaakt.mongodb.net/test'

app.set('view engine', 'hbs')
app.use(express.urlencoded({entended:true}))

app.post('/search', async (req,res) => {
    let name = req.body.txtSearch
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    let prods = await dbo.collection("shopeeProduct").find({'name' :new RegExp(name,'i')}).toArray()
    console.log(prods)
    res.render('viewProduct', {'prods':prods})
})

app.get('/view', async (req,res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    let prods = await dbo.collection("shopeeProduct").find().toArray()
    console.log(prods)
    res.render('viewProduct', {'prods':prods})
})

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/insert', (req,res) => {
    res.render('newProduct')
})

app.post('/update',async (req,res) => {
    let id = req.body.id
    let objectId = ObjectId(id)
    let name = req.body.txtName
    let price = Number(req.body.txtPrice)
    let pic = req.body.txtPic
    let product = {
        'name': name,
        'price': price,
        'picture': pic
    }
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    dbo.collection("shopeeProduct").updateOne({_id:objectId}, {$set:product})
    res.redirect('/')
})

app.post('/insertProduct', async (req,res) => {
    let name = req.body.txtName
    let price = Number(req.body.txtPrice)
    let pic = req.body.txtPic
    let product = {
        'name': name,
        'price': price,
        'picture': pic
    }
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    dbo.collection("shopeeProduct").insertOne(product)
    res.redirect('/')
})

app.get('/update', async (req,res) => {
    let id = req.query.id
    let objectId = ObjectId(id)
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    let prod = await dbo.collection("shopeeProduct").findOne({"_id":objectId})
    res.render('edit', {'prod':prod})
})

app.get('/delete', async (req,res) => {
    let id = req.query.id
    console.log(id);
    let objectId = ObjectId(id)
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    await dbo.collection("shopeeProduct").deleteOne({"_id":objectId})
    res.redirect('/')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running')