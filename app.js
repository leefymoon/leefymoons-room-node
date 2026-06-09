const express = require('express')
const nunjucks = require('nunjucks')
require('dotenv').config()
const PORT = '80'
var app = express()

const silly = nunjucks.configure('', {
  autoescape: true,
  express: app
})

//lastfm recent track request
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

//lastfm top albums request
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
app.use(express.urlencoded({ extended: true }));

app.use(express.static("static/"));

app.get('/home', (req, res) => {
  res.render('home.html')
})

app.get('/about', (req, res) => {
  res.render('about.html')
})

app.get('/blog', (req, res) => {
  res.render('blog.html')
})

app.get('/post-blog', (req, res) => {
  res.render('post-blog.html')
})

const blogPosts = [];

app.post('/submit-data', (req, res) => {
  silly.opts.autoescape = false; 
  
  const newBlog = [req.body.blogTitle, req.body.blogDate, req.body.blogContent];
  blogPosts.push(newBlog);

  res.render('test.html', { blogPosts: blogPosts});

  silly.opts.autoescape = true; 
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})