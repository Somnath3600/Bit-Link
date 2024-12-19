
const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb+srv://Somnath3600:somnath2001@cluster0.teofova.mongodb.net/');

// Define URL model
const Url = mongoose.model('Url', new mongoose.Schema({
  originalUrl: String,
  shortUrl: String
}));

// Middleware to parse JSON requests
app.use(express.json());

 app.set('view engine', 'ejs')


app.use(express.urlencoded({ extended: false}))


app.get('/', async (req, res) =>{
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short : req.params.shortUrl })
  if ( shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

