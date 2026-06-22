const express = require('express')
const nunjucks = require('nunjucks')
var fs = require('fs/promises');
require('dotenv').config()
const PORT = '5500'
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
app.use('/admincrap/post-blog', express.static("../static/"));

app.get('/home', (req, res) => {
  res.render('home.html')
})

app.get('/about', (req, res) => {
  res.render('about.html')
})

async function loadBlogs() {
  try {
    const blogsRaw = await fs.readFile('blogs.json', 'utf8');
    const blogs = JSON.parse(blogsRaw);

  } catch (error) {
    console.error("Error reading or parsing file:", error);
  }
}

app.get('/admincrap/post-blog', (req, res) => {
  res.render('post-blog.html')
})

const blogs = require('./blogs.json')

app.get('/blog', (req, res) => {
  silly.opts.autoescape = false;

  loadBlogs();
  res.render('blog.html', { blogs: blogs});

  silly.opts.autoescape = true; 
});

app.get('/feed.xml', (req, res) => {
  loadBlogs();
  res.render('feed.xml', { blogs: blogs});
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})