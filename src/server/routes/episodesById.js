import {
    ref as $ref,
    atom as $atom,
    pathValue as $pathValue
} from 'falcor-json-graph';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
import { loadEpisode } from '../services/loadEpisode';

export function episodesById() {
    return [{
        route: `episodesById[{integers: episodeIds}][
            'date', 'number',
            'title', 'description',
            'image_url', 'podcast_url'
        ]`,
        get(path) {
            const { episodeIds } = path;
            const episodeKeys = path[path.length - 1];
            return Observable
                .from(episodeIds)
                .flatMap(
                    (episodeId) => loadEpisode(episodeId),
                    (episodeId, { podcast }) => ({ episodeId, podcast })
                )
                .flatMap(
                    ({ episodeId, podcast }) => episodeKeys,
                    ({ episodeId, podcast }, key) => {
                        const path = `episodesById['${episodeId}']['${key}']`;
                        const value = podcast[key];
                        return $pathValue(path, value);
                    }
                )
        }
    }];
}
