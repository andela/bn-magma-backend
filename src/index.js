import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import Debug from 'debug';
import errorhandler from 'errorhandler';
import methodOverride from 'method-override';
import swaggerUI from 'swagger-ui-express';
import passport from 'passport';
import socketio from 'socket.io';
import http from 'http';
import swaggerDoc from './config/swagger.json';
import userRoute from './routes/userRoute';
import requestRoute from './routes/requestRoute';
import socialRoute from './routes/socialRoutes';
import Responses from './utils/Responses';
import passportInit from './config/passport';

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();
const debug = Debug('app:server');

// create server
const server = http.createServer(app);

app.use(cors());

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(`${__dirname}/public`));

// Initialize Passport
app.use(passport.initialize());
passportInit();

if (!isProduction) {
  app.use(errorhandler());
  app.use(morgan('dev'));
}

// Setup socket
const io = socketio(server);
app.set('io', io);

// Routes
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use('/api/v1', userRoute);
app.use('/api/v1', requestRoute);
app.use('/api/v1', socialRoute);

app.get('/', (req, res) => {
  Responses.setSuccess(200, 'Welcome to Barefoot Nomad');
  Responses.send(res);
});

app.all('/*', (req, res) => {
  Responses.setError(404, 'The requested url was not found on this server');
  Responses.send(res);
});

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res) => {
    debug(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
server.listen(process.env.PORT || 3000, () => {
  debug(`Listening on port ${server.address().port}`);
});

export default server;
