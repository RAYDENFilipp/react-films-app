// dotenv should be used in config
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./api/routers/authRouter');
const userRouter = require('./api/routers/userRouter');
const filmsRouter = require('./api/routers/filmsRouter');
const likeRouter = require('./api/routers/likeRouter');
const favoriteRouter = require('./api/routers/favoriteRouter');
const ResponseError = require('./errorTypes/ResponseError');
const {authMiddleware} = require('./api/middlewares/authMiddleware');
const {PORT, DB_HOSTNAME, DB_NAME, DB_PASS, DB_USER} = require('./config');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// you ca nmake it to be just /api/login & api/register and have respective routers for each
app.use('/api/auth', authRouter);
app.use(authMiddleware);
// it is an antipattern to call a collection in singular form, use plural instead
app.use('/api/user', userRouter);
app.use('/api/films', filmsRouter);
app.use('/api/likes', likeRouter);
app.use('/api/favorites', favoriteRouter);

// please, make a separate errorHandler function to work with errors, like you did with routers
app.use((err,
    req,
    res,
    next) => {
  if (err instanceof ResponseError) {
    res.status(err.errorCode).json({message: err.message});
  } else {
    res.status(500).json({message: err.message});
  }
});

const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}${DB_HOSTNAME}/${DB_NAME}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    app.listen(PORT, ()=> console.log(`Server works at ${PORT} port!`));
  } catch (e) {
    console.log(e);
  }
};

start();