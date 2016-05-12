require('source-map-support').install();

import { Model, reaxtor } from 'reaxtor';
import { Observable, Scheduler } from 'rxjs/Rx';
import { render as renderVDom } from './render';
import { reloadHotModules } from '../shared/reloadHot';

import { decode } from 'querystring';
import DataSource from 'falcor-http-datasource';

const useLocalStorage = false;
const localStorageToken = 'podcast-app-cache';

Observable
    .fromEvent(window, 'load', () => window.location.search.substring(1))
    .map((query) => decode(query))
    .switchMap(
        (params) => reloadHotModules(module),
        (params, { App }) => reaxtor(
            App, getAppModel(), params
        )
    )
    .switch()
    .scan(renderVDom, getAppDOMNode())
    .subscribe();

function getAppDOMNode(appDomNode) {
    return appDomNode = (
        document.getElementById('app') ||
        document.body.appendChild((
            appDomNode = document.createElement('article')) && (
            appDomNode.id = 'app') && (
            appDomNode)
        )
    );
}

function getAppModel() {
    return new Model({
        cache: getAppCache(),
        source: new DataSource('/model.json'),
        scheduler: Scheduler.asap,
        onChangesCompleted: function () {
            useLocalStorage &&
            localStorage && localStorage.setItem && localStorage.setItem(
                localStorageToken, JSON.stringify(this.getCache())
            );
        }
    });
}

function getAppCache() {

    let appCache;

    if (window.seedAppCache) {
        appCache = window.seedAppCache;
        delete window.seedAppCache;
    } else if (useLocalStorage && localStorage && localStorage.getItem) {
        const localStorageCache = localStorage.getItem(localStorageToken);
        if (localStorageCache) {
            try {
                appCache = JSON.parse(localStorageCache);
            } catch (e) {
                appCache = {};
            }
        }
    } else {
        appCache = {};
    }

    return appCache;
}
