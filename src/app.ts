import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import hpp from 'hpp';

import { routes } from './routes';

import { celebrateValidation } from './core/middlewares/celebrateValidation';
import { NotFound, HttpHandler } from './core/middlewares/handlers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(hpp({ checkBody: false }));

app.use(cors());
app.use(morgan('dev'));

app.use(routes);

/**
 * Validations
 * - Not found
 * - Validation errors (celebrate, Joi)
 * - Http (errors)
 */
app.use(celebrateValidation({ setDetails: false }));

app.use(NotFound(), HttpHandler());

export { app };
