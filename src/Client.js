import express from 'express';

import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { join } from 'path';

import routes from './controllers/routes.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

class Client {
  constructor(options = {}) {
    this.options = options;
    this.log = console.log;
  }

  start(port = this.options.port || process.env.PORT || 3000) {
    app.enable('trust proxy', true);

    app.disable('view cache');
    app.set('view engine', 'ejs');
    app.set('views', join(__dirname, './../views'));

    app.use(morgan('combined'));
    app.use(helmet());
    app.use(compression());
    app.use(cors());
    app.use(
      rateLimit({
        windowMs: 10000,
        max: 50,
        headers: true,
        handler: (req, res) => {
          res.status(429).json({ code: 429, message: 'Too many requests' });
        },
      })
    );

    app.use(express.static('public'));
    app.use('/', routes);

    app.listen(port, () => {
      this.log(`Listening on port ${port}`);
    });
  }
}

export default Client;
