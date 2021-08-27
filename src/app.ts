import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';

import { routes } from './routes';

import { httpHandler } from './core/middlewares/httpHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(hpp({ checkBody: false }));

app.use(cors());
app.use(morgan('dev'));

app.use(routes);

/**
 * - handlers
 */
app.use(httpHandler());

export { app };
