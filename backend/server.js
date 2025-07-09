const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const posts = [
  {
    username: 'Jeff',
    title: 'Post 1', 
    content: 'Content of Post 1'
  },
  {
    username: 'Vineet',
    title: 'Post 2', 
    content: 'Content of Post 2' 
  },
  { 
    username: 'John',
    title: 'Post 3', 
    content: 'Content of Post 3' 
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401); // if there isn't any token
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if the token is no longer valid
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

app.listen(3000, () => {
  console.log('Main server running on port 3000');
});