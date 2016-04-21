import request from 'request';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/bindNodeCallback';
import { Observable } from 'rxjs/Observable';
import { loadPage } from './loadPage';

const pageSize = 10;
const pageOffset = 1;

function indexToPageNumber(index) {
    return Math.floor(index / pageSize) + pageOffset;
}

function pageNumberToIndex(page, offset = 0) {
    return ((page - 1) * pageSize) + offset;
}

export function loadEpisodes(episodeIndexRange) {

    const { to, from } = episodeIndexRange;
    const fromPage = indexToPageNumber(from);
    const toPage = indexToPageNumber(to);

    return Observable
        .range(fromPage, (toPage - fromPage) + 1)
        .flatMap(
            (page) => loadPage(page),
            (page, { podcasts }) => ({ page, podcasts })
        )
        .flatMap(
            ({ page, podcasts }) => podcasts,
            ({ page, podcasts }, podcast, _, index) => ({
                podcast, index: pageNumberToIndex(page, index)
            })
        )
        .filter(({ index }) => index >= from && index <= to)
}
