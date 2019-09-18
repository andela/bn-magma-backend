import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import Debug from 'debug';
import errorhandler from 'errorhandler';
import methodOverride from 'method-override';
import swaggerUI from 'swagger-ui-express';
import swaggerDoc from './config/swagger.json';
import userRoute from './routes/userRoute';
import requestRoute from './routes/requestRoute';
import Responses from './utils/Responses';

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();
const debug = Debug('app:server');

app.use(cors());

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(`${__dirname}/public`));

if (!isProduction) {
  app.use(errorhandler());
  app.use(morgan('dev'));
}

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use('/api/v1', userRoute);
app.use('/api/v1', requestRoute);

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
const server = app.listen(process.env.PORT || 3000, () => {
  debug(`Listening on port ${server.address().port}`);
});

export default server;
