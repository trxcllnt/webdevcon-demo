require('source-map-support').install();

import { Model } from 'reaxtor';
import { Scheduler } from 'rxjs/Rx';
import { render as renderVDom } from './render';
import { renderApp } from '../shared/renderApp';
import { reloadHotModules } from '../shared/reloadHot';
import DataSource from 'falcor-http-datasource';

const useLocalStorage = false;

renderApp(reloadHotModules(module),
          getAppModel, renderVDom,
          getAppDOMNode()).subscribe();

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
                'podcast-app-cache', JSON.stringify(this.getCache())
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
        const localStorageCache = localStorage.getItem('podcast-app-cache');
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
