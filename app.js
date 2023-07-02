require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { connect } = require('./lib/mongo.js');

// const middleware = require('./middleware');
// const routes = require('./routes');

// Import routes
const authRoutes = require('./routes/api/auth.js');
const userRoutes = require('./routes/api/users.js');
const blogRoutes = require('./routes/api/blogs.js');
const companyRoutes = require('./routes/api/companies.js');
const commentRoutes = require('./routes/api/comments.js');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/companies.html');
});


const port = process.env.PORT || 8080;
(async () => {
  const { User, Blog, Comment, PW_2023_Q2 } = await connect();

  app.use('/api/auth', (req,  res, next) => {
    req.models = { User };
    next();
  }, authRoutes);

  app.use('/api/users', (req, res, next) => {
    req.models = { User };
    next();
  }, userRoutes);

  app.use('/api/blogs', (req,  res, next) => {
    req.models = { Blog, User };
    next();
  }, blogRoutes);

  app.use('/api/companies', (req, res, next) => {
    req.models = { PW_2023_Q2 };
    next();
  }, companyRoutes());

  app.use('/api/comments', commentRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(port, () => {
    console.log('Server started on port', port);
  });
})();
