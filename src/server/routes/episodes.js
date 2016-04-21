import {
    ref as $ref,
    atom as $atom,
    pathValue as $pathValue
} from 'falcor-json-graph';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
import { loadPage } from '../services/loadPage';
import { loadEpisodes } from '../services/loadEpisodes';
import { nextSundayAtMidnight } from './nextSundayAtMidnight';

export function episodes() {
    return ([]
        .concat(episodeLength())
        .concat(episodesByIndex())
    );
}

function episodeLength() {
    return [{
        route: `episodes.length`,
        get() {
            return loadPage(1).map(({ podcasts }) => {
                const mostRecentPodcast = podcasts[0];
                const episodesLength = mostRecentPodcast.number;
                return $pathValue(`episodes.length`, $atom(episodesLength, {
                    expires: nextSundayAtMidnight()
                }));
            });
        }
    }];
}

function episodesByIndex() {
    return [{
        route: `episodes[{ranges: episodeIndexRanges}]`,
        get({ episodeIndexRanges }) {
            return Observable
                .from(episodeIndexRanges)
                .flatMap((episodeIndexRange) =>
                    loadEpisodes(episodeIndexRange))
                .map(({ podcast, index }) => {
                    const { number } = podcast;
                    const path = `episodes['${index}']`;
                    const value = $ref(`episodesById['${number}']`, {
                        expires: nextSundayAtMidnight()
                    });
                    return $pathValue(path, value);
                });
        }
    }];
}
