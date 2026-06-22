const express = require('express')
const nunjucks = require('nunjucks')
var fs = require('fs/promises');
require('dotenv').config()
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
app.use('/admincrap/post-blog', express.static("../static/"));

app.get('/home', (req, res) => {
  res.render('home.html')
})

app.get('/about', (req, res) => {
  res.render('about.html')
})

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
}

app.get('/admincrap/post-blog', (req, res) => {
  res.render('post-blog.html')
})

const blogs = require('./blogs.json')

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
  console.log(id);

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})