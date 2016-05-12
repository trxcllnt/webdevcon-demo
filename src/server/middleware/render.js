/** @jsx hJSX */
import { hJSX } from 'reaxtor';
import init from 'snabbdom-to-html/lib/init';
import assets from '../webpack-assets.json';
import snabbdomStyle from 'snabbdom-to-html/lib/modules/style';
import snabbdomAttributes from 'snabbdom-to-html/lib/modules/attributes';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Observable';

import { inspect } from 'util';
import { Model, reaxtor } from 'reaxtor';
import { getDataSourceFactory } from './router';

const toHTML = init([
    snabbdomStyle,
    snabbdomAttributes
]);

const renderServerSide = true;

export function renderMiddleware(users = {}, hotModules) {

    const getDataSource = getDataSourceFactory(users);

    return function renderMiddleware(req, res) {

        function getModel() {
            return new Model({
                source: getDataSource(req)
            });
        }

        const htmlObs = !renderServerSide ?
            Observable.of(renderVDomToHTMLPage(null, [])) :
            hotModules.switchMap(({ App }) => reaxtor(
                App, getModel(), {...req.cookies, ...req.query}
            ))
            .scan(renderVDomToHTMLPage, {})
            .debounceTime(16);

        htmlObs.take(1).subscribe(
            (html) => res.type('html').send(html),
            (error) => {

                error = error && error.stack ?
                    error.stack :
                    inspect(error, { depth: null });

                console.error(error);

                res.status(500)
                   .json(error);
            }
        );
    }
}

function renderVDomToHTMLPage(dom, [model, vdom]) {
    return `
    <!doctype html> ${toHTML(
        <html lang='en-us'>
            <head>
                <meta http-equiv='x-ua-compatible' content='ie=edge'/>
                <meta name='viewport' content='width=device-width, initial-scale=1'/>
                <link rel='stylesheet' type='text/css' href={assets.client.css || ''}/>
            </head>
            <body>{[
                ...(renderServerSide ? [
                    vdom,
                    <script type='text/javascript'>
                        window.seedAppCache = { JSON.stringify(model.getCache()) };
                    </script>
                ] : []),
                <script src={assets.client.js}></script>
            ]}</body>
        </html>
    )}`;
}

