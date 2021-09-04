import express from 'express';
import cors from 'cors';
import hpp from 'hpp';

import { routes } from './routes';

import { celebrateValidation } from './core/middlewares/celebrateValidation';
import { NotFound, HttpHandler } from './core/middlewares/handlers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(hpp({ checkBody: false }));

app.use(routes);

app.use(celebrateValidation({ setDetails: false }));

app.use(NotFound(), HttpHandler());

export { app };
