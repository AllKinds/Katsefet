import * as path from 'path';
import * as express from 'express';
import { userRouter } from './user/user.router';
import { fileRouter } from './file/file.router';
import { folderRouter } from './folder/folder.router';
import { ClientError, ServerError } from './errors/application';
import { authenticate } from './auth/passport';

export function initRouter(app) {
  console.log('init router');
  app.get('/metadata.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '../metadata.xml'));
  });

  app.use('/', (req, res, next) => {
    if (req.user) {
      console.log('user ' + req.user.firstname + ' ' + req.user.lastname + ' verified');
      return next();
    }
    console.log('User unknown. Authenticating');
    return authenticate(req, res, next);
  });

  app.use(express.static(path.join(__dirname, '../public')));

  app.use('/api/file', fileRouter);
  app.use('/api/user', userRouter);
  app.use('/api/folder', folderRouter);

  app.get('/login/failed', (req, res) => {
    res.send('login to the application failed :(');
  });

  app.use((error, req, res, next) => {
    if (error instanceof ClientError || error instanceof ServerError) {
      return res.status(error.status).send(error.message + '');
    }
    next(error);
  });

  app.use((error, req, res, next) => {
    return res.status(500).json({
      type: 'Unknown Application Error',
      message: error.message
    });
  });
}
