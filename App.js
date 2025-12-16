import app from './server.js';
import { json, urlencoded } from 'express';
import morgan from 'morgan';
import Empsrouter from './Routers/Emps.router.js';
import Depsrouter from './Routers/Deps.router.js';


//logging middleware
app.use(morgan("dev"));

// Middleware to parse JSON bodies
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

app.use('/employees', Empsrouter)
app.use('/departments', Depsrouter)