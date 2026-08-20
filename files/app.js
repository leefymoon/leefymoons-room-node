//holy dependencies
const express = require('express')
const nunjucks = require('nunjucks')
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const path = require('path');
const PORT = '5500'
var app = express()

const njkConfig = nunjucks.configure('', {
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
  res.render('home.html')
});

app.get('/about', (req, res) => {
  res.render('about.html')
});

async function writeNewBlog(x) {
  const newBlog = x;

  try {
    const existingBlogs = await fs.readFile('./blogs.json', 'utf8');
    const blogsParsed = JSON.parse(existingBlogs);

    blogsParsed.unshift(newBlog);

    await fs.writeFile('./blogs.json', JSON.stringify(blogsParsed, null, 2), 'utf8');
    
    console.log('woohoo it wrote to the JSON');
  } catch (error) {
    console.error('error writing to the JSON:', error);
  }
};

app.get('/admincrap/post-blog', (req, res) => {
  res.render('admincrap/post-blog.html')
});

const blogs = require('./blogs.json');

app.get('/blog', (req, res) => {
  njkConfig.opts.autoescape = false;
  res.render('blog.html', { blogs: blogs});
  njkConfig.opts.autoescape = true; 
});

app.get('/feed.xml', (req, res) => {
  res.render('feed.xml', { blogs: blogs});
});

app.post('/submit-blog', (req, res) => {
  const id = blogs.length + 1;
  const currentDate = new Date();

  const newBlog = {
    id: id,
    title: req.body.title,
    date: req.body.date,
    rssDate: currentDate.toUTCString(),
    content: req.body.content
  };

  writeNewBlog(newBlog);
  res.redirect("/blog");
});

app.get('/graphics', (req, res) => {
  res.render('graphics.html');
});

app.get('/mytech', (req, res) => {
  res.render('mytech.html');
});

app.get('/mytech/pcs', (req, res) => {
  res.render('mytech/pcs.html');
});

app.get('/mytech/mp3-players', (req, res) => {
  res.render('mytech/mp3-players.html');
});

app.get('/mytech/consoles', (req, res) => {
  res.render('mytech/consoles.html');
});

app.get('/resources', (req, res) => {
  res.render('resources.html');
});

app.get('/shrines', (req, res) => {
  res.render('shrines.html');
});

app.get('/h', (req, res) => {
  res.sendFile('./h.html');
})

app.get('/shrines/twentyonepilots', (req, res) => {
  res.sendFile('twentyonepilots/about.html', {root: 'shrines'});
})

app.get('/shrines/twentyonepilots/songs', (req, res) => {
  res.sendFile('twentyonepilots/songs.html', {root: 'shrines'});
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})