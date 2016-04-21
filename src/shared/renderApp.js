import { reaxtor } from 'reaxtor';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/switchMap';

export function renderApp(hotModules, getModel, render, initialDOM = {}) {
    return hotModules
        .switchMap(({ App }) => reaxtor(App, getModel()))
        .scan(render, initialDOM)
}
