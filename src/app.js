import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import express from 'express';
import cookie from 'cookie-parser';

import helmet from 'helmet';
import cors from 'cors';

import morgan from 'morgan';

import { routes } from './routes.js';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '..', 'public', 'static')));

app.use(helmet());
app.use(cors());

app.use(cookie());

app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '..', 'public', 'views'));

app.use(routes);
