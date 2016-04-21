import 'rxjs/add/observable/of';
import { pages } from '../json/pages';
import { Observable } from 'rxjs/Observable';

export function loadPage(page) {
    return Observable.of({ podcasts: pages[page - 1] });
}
