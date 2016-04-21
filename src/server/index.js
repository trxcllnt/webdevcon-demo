require('source-map-support').install();

import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { reloadHotModules } from '../shared/reloadHot';
import { renderMiddleware } from './middleware/render';
import { getDataSourceFactory } from './middleware/router';
import { dataSourceRoute as falcorMiddleware } from 'falcor-express';

const app = express();

app.disable('x-powered-by');
app.use(compression());
app.use(cookieParser());
app.use(express.static('./build/client'));
app.use(bodyParser.urlencoded({ extended: false }));

const users = {};

app.use('/model.json',
    falcorMiddleware(
        getDataSourceFactory(users)));

app.use('/index.html', renderMiddleware(users, reloadHotModules(module)));

app.listen(process.env.PORT || 8888, process.env.HOST || 'localhost', function() {
    const { address, port } = this.address();
    console.log('************************************************************');
    console.log(`Express app listening at http://${address}:${port}`);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('process.pid:', process.pid);
    console.log('__dirname:', __dirname);
    console.log('root:', require('path').resolve());
    console.log('************************************************************');
});

