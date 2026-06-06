const express = require('express')
const nunjucks = require('nunjucks')
require('dotenv').config()
const PORT = '80'
var app = express()

nunjucks.configure('', {
  autoescape: true,
  express: app
})

//lastfm top albums request

app.get('/lastfm/recenttrack', async (req, res) => {
  try {
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${process.env.LASTFM_USER_NAME}&api_key=${process.env.LASTFM_API_KEY}&limit=1&format=json`);
    const data = await response.json();

    //sends the lastfm data to frontend
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/lastfm/topalbums', async (req, res) => {
  try {
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${process.env.LASTFM_USER_NAME}&api_key=${process.env.LASTFM_API_KEY}&period=7day&limit=10&format=json`);
    const data = await response.json();

    //sends the lastfm data to frontend
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.set('view engine', 'html')

app.use(express.static("static/"));

app.get('/home', (req, res) => {
  res.render('home.html')
})

app.get('/about', (req, res) => {
  res.render('about.html')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})